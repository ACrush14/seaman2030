# 04 — Arquitetura Técnica

Volta para [PLANNING.md](../PLANNING.md). Modelo narrativo em [01-narrative-design.md](01-narrative-design.md).

> **Atualizado após a Fase 1/2:** a versão original deste documento assumia que o "cérebro" do bicho seria a API da Claude. Prototipamos isso e depois testamos um motor 100% roteirizado local (sem API) — ver [prototype-fase1/](../prototype-fase1/README.md) — que já cobre os 21 dias completos, o Evento de Virada e os 4 finais, validado por simulação automatizada. **O Unity deve portar esse motor local, não a arquitetura de API abaixo.** A arquitetura via LLM continua documentada na seção 8 como caminho de evolução futuro, não como base do MVP.

## 1. Visão geral dos componentes (MVP — motor local)

```
[App Unity (mobile)]
   |-- Motor de diálogo (C#, porta de src/script.js + engine.js + classify.js + rules.js)
   |-- Captura de voz (STT nativo) / texto — ver docs/12
   |-- Renderização 3D do bicho (URP) + animação de estágio/expressão
   |-- Notificações push (gatilho do check-in diário)
   |-- Persistência local (arquivo local / PlayerPrefs — equivalente ao data/game-state.json do protótipo)
```

Sem backend, sem API, sem custo por sessão. Firebase (Auth + Firestore) vira **opcional, adiado para depois do vertical slice** — só necessário se/quando quiser sincronizar entre dispositivos ou fazer backup em nuvem (ver seção 7).

## 2. Modelo de dados (local, um único "save" por jogador)

Estrutura já validada em [prototype-fase1/src/state.js](../prototype-fase1/src/state.js) — portar para uma classe/struct C# serializável (`JsonUtility` ou similar):

```
GameState
  campaignStartDate: timestamp
  currentDay: number                 // 1-21
  stepIndex: number                  // posição atual dentro do roteiro do dia
  waitingTopic: string | null        // tópico da pergunta em aberto, se houver
  dayCompletedAt: timestamp | null
  lastInteractionAt: timestamp
  axes: { trabalho: number(0-100), saude: number(0-100), vinculo: number(0-100) }
  axesHistory: [{ day, trabalho, saude, vinculo }]   // uma entrada por dia concluído
  memories: [{ day, type: "fact"|"checkin_answer"|"flag", topic, summary }]
  labels: { [topic]: string }        // rótulo classificado de cada pergunta já respondida
  turningPointTriggered: boolean
  ending: null | "florescimento" | "equilibrio" | "alerta" | "reencontro"
```

## 3. Motor de diálogo (roteirizado, sem API)

Porta direta da lógica já testada no protótipo:

| Módulo JS (referência) | Responsabilidade | Equivalente em Unity |
|---|---|---|
| [src/script.js](../prototype-fase1/src/script.js) | Roteiro dos 21 dias como dados: falas, perguntas, ramificações condicionais (`when`), e as funções que decidem o Evento de Virada e o final | `ScriptableObject` por dia, ou uma tabela de dados (JSON/CSV) carregada em runtime — mais fácil de editar sem recompilar |
| [src/classify.js](../prototype-fase1/src/classify.js) | Classificação por palavra-chave (sim/não, idade, área, sentimento) | Classe `AnswerClassifier` com os mesmos padrões de regex/palavra-chave |
| [src/rules.js](../prototype-fase1/src/rules.js) | Contagem de sinais de alerta + cálculo do final pela média dos eixos | Classe `CampaignRules`, sem dependências externas |
| [src/engine.js](../prototype-fase1/src/engine.js) | Percorre o roteiro do dia, aplica ramificações, guarda memórias, ajusta eixos | Classe `DialogueEngine`, chamada pela UI a cada resposta do jogador |

A lógica de `advance(state, userText)` é pura (não depende de I/O) — pode ser portada quase 1:1, só trocando a serialização (JSON do Node vira `JsonUtility`/`ScriptableObject` do Unity).

## 4. Cálculo de estágio e final

- **Estágio:** função pura de `currentDay` (ver tabela em [01-narrative-design.md](01-narrative-design.md#3-estágios-de-evolução-ligados-aos-dias-da-campanha)).
- **Avanço de `currentDay`:** no protótipo, avança manualmente via `/avancar` (modo de teste). **No jogo real, deve voltar a implementar a regra completa de [01-narrative-design.md](01-narrative-design.md#regra-de-ausência-o-que-acontece-se-o-jogador-não-abrir-o-app-num-dia):** incrementa só quando `dayCompletedAt` é preenchido **e** já se passaram 24h reais desde o último avanço, disparado por notificação push.
- **Evento de Virada:** implementado e testado — dispara no dia 11 se 3+ `flags` do mesmo tópico apareceram entre os dias 2–9, ou garantido no dia 12 (ver [prototype-fase1/README.md](../prototype-fase1/README.md#roteiro-completo-21-dias)).
- **Final:** calculado no dia 21 a partir da **média** de `axesHistory`, conforme thresholds em [01-narrative-design.md](01-narrative-design.md#4-finais) — testado com 4 cenários de simulação, 3 dos 4 finais confirmados alcançáveis (ver README do protótipo).

## 5. Voz

Plano completo de captura e geração de voz (STT, TTS, opção de clonagem, latência e custo) em [12-pipeline-de-voz.md](12-pipeline-de-voz.md) — a Rota A (TTS do navegador/SO + pitch alterado) já foi validada em [prototype-fase2/](../prototype-fase2/README.md), sem custo, sem chave.

## 6. Resiliência

- **STT/TTS indisponível:** cai automaticamente para o modo texto, sem interromper a cena (ver [12-pipeline-de-voz.md](12-pipeline-de-voz.md#6-fallback-quando-a-voz-falha)).
- Como o motor de diálogo é 100% local, não existe mais o risco de "API fora do ar" no caminho crítico do MVP.

## 7. Firebase (opcional, adiado)

Só entra em cena se/quando o jogo precisar de:
- Sincronizar progresso entre dispositivos (trocar de celular sem perder o bicho)
- Backup em nuvem do save
- Métricas de uso agregadas (quantos jogadores, retenção, etc.)

Nenhuma dessas coisas bloqueia o vertical slice (Fase 3) nem a campanha completa (Fase 4) — pode ficar pra Fase 5 ou pós-lançamento.

## 8. Caminho de evolução futuro: diálogo gerado por LLM (fora do MVP)

Documentado aqui como referência, caso a decisão registrada em [prototype-fase1/README.md](../prototype-fase1/README.md#o-que-este-protótipo-cobre-e-o-que-não-cobre) mude no futuro (ex.: o roteiro fixo ficar repetitivo demais em replays, ou quiser conversas livres genuinamente abertas):

- **Cérebro conversacional:** backend (Node/Python) chamando a API da Claude com um system prompt de personalidade (três blocos: personalidade fixa, contexto de estágio/ato, memória recuperada) + extração estruturada de `axes_delta`/`new_memories` via tool use, na mesma chamada.
- **Persistência:** passaria a exigir Firebase (Auth + Firestore) de verdade, já que o estado do jogo precisaria ser acessível pelo backend.
- **Custo:** limitar duração de conversa livre por dia, cache do bloco de personalidade fixa (prompt caching), orçamento de tokens priorizando check-in estruturado sobre conversa livre.
- **Resiliência:** se o LLM cair, resposta local pré-definida neutra (nunca tela de erro), preservando a ficção.
- **Nota de privacidade:** essa rota volta a enviar as respostas do jogador a um provedor terceiro (a API da Claude) — reativaria a seção de consentimento específico já desenhada em [11-dados-privacidade.md](11-dados-privacidade.md#6-nota-sobre-custoterceiros).

Essa rota pode até ser adotada de forma **híbrida**: roteiro fixo como espinha dorsal (garante ritmo, Evento de Virada e finais previsíveis) + LLM só nos trechos de conversa livre (ex. Dia 6), onde variedade importa mais que previsibilidade. Não é uma decisão a tomar agora — só registrar que o caminho existe.
