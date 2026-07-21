# 04 — Arquitetura Técnica

Volta para [PLANNING.md](../PLANNING.md). Modelo narrativo em [01-narrative-design.md](01-narrative-design.md).

## 1. Visão geral dos componentes

```
[App Unity (mobile)]
   |-- Captura de voz (STT nativo) / texto
   |-- Renderização 3D do bicho (URP) + animação de estágio/expressão
   |-- Notificações push (gatilho do check-in diário)
   |
   v
[Backend (Node/Python)]
   |-- Orquestra a chamada à API da Claude (personalidade + memória + extração de eixos)
   |-- Calcula progresso de campanha (dia atual, estágio, eixos)
   |-- TTS (texto -> voz do personagem)
   |
   v
[Firebase]
   |-- Auth (identidade do jogador)
   |-- Firestore (estado do bicho, eixos, histórico de conversas, memórias extraídas)
```

## 2. Modelo de dados (Firestore)

```
users/{userId}
  campaignStartDate: timestamp
  currentDay: number            // 1-21
  stage: "ovo" | "larval" | "juvenil" | "quase-adulto" | "final"
  axes: {
    trabalho: number (0-100),
    saude: number (0-100),
    vinculo: number (0-100)
  }
  axesHistory: [{ day: number, trabalho, saude, vinculo }]   // para média da jornada, não só valor final
  turningPointTriggered: boolean   // Evento de Virada já ocorreu?
  ending: null | "florescimento" | "equilibrio" | "alerta" | "reencontro"

users/{userId}/memories/{memoryId}
  createdAtDay: number
  type: "fact" | "checkin_answer" | "flag"
  summary: string          // texto curto extraído (ex. "prazo do projeto X na sexta")
  topic: string            // para recuperação por assunto (ex. "trabalho-prazo")
  raw: string              // trecho original da conversa, para contexto se precisar

users/{userId}/conversations/{conversationId}
  day: number
  type: "checkin" | "free"
  turns: [{ speaker: "user"|"bicho", text, timestamp }]
```

## 3. Prompt de personalidade

O system prompt enviado à API da Claude combina três blocos, montados pelo backend a cada chamada:

1. **Personalidade fixa** (constante em todas as chamadas) — tom, limites, diretrizes de "nunca soar clínico", extraídas de [02-roteiro-dialogos.md](02-roteiro-dialogos.md#guia-de-voz-do-personagem).
2. **Contexto de estágio/ato** — qual dia da campanha, qual estágio de evolução, se o Evento de Virada já foi disparado ou está prestes a disparar (dias 10–12 com sinais acumulados).
3. **Memória recuperada** — não a conversa inteira, só as `memories` mais relevantes para o dia atual (ex. últimos check-ins do mesmo tópico, fatos marcados como `flag`), para manter o prompt pequeno e o custo controlado.

**Extração estruturada:** além da resposta em linguagem natural para o jogador, cada chamada de check-in pede à API (via saída estruturada / tool use) um objeto pequeno tipo:

```json
{
  "reply": "texto que o bicho fala",
  "axes_delta": { "trabalho": -3, "saude": 0, "vinculo": +1 },
  "new_memories": [{ "type": "flag", "topic": "trabalho-noite", "summary": "trabalhou até tarde de novo" }]
}
```

Isso evita ter uma segunda chamada de LLM só para analisar a conversa — a extração acontece na mesma resposta.

## 4. Cálculo de estágio e final

- **Estágio:** função pura de `currentDay` (ver tabela em [01-narrative-design.md](01-narrative-design.md#3-estágios-de-evolução-ligados-aos-dias-da-campanha)), não depende dos eixos — todo jogador passa pelos mesmos estágios visuais no mesmo ritmo, o que muda é o *conteúdo* da conversa.
- **Evento de Virada:** disparado quando `flags` do mesmo `topic` aparecem 3+ vezes nas memórias entre os dias 2–9, verificado a cada novo check-in a partir do dia 10.
- **Final:** calculado no dia 21 a partir da **média** de `axesHistory` (não do valor pontual do último dia), conforme thresholds em [01-narrative-design.md](01-narrative-design.md#4-finais).

## 5. Custo e limites de API

- Limitar duração de conversa livre por dia (ex. N turnos) para controlar custo por usuário — configurável no backend, não hardcoded no app.
- Cache do bloco de "personalidade fixa" do prompt (prompt caching da API da Claude) já que esse bloco não muda entre chamadas do mesmo usuário.
- Check-in estruturado tem prioridade sobre conversa livre em termos de orçamento de tokens, por ser o que impulsiona a progressão da campanha.

## 6. Voz

- STT: nativo do dispositivo (Android SpeechRecognizer / iOS Speech framework), texto como fallback sempre visível na UI (nunca esconder o campo de texto atrás da voz).
- TTS: voz sintética não-humana para o bicho, coerente com o visual grotesco — avaliar opções (voz do próprio SO com pitch/timbre alterado vs. serviço de voz sintética dedicado) na Fase 2 do roadmap.
