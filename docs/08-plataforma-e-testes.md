# 08 — Plataforma e Plano de Testes

Volta para [PLANNING.md](../PLANNING.md). Stack técnica em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md). Fases de produção em [05-roadmap-producao.md](05-roadmap-producao.md).

## 1. Plataforma por fase

Não existe "uma" plataforma — ela muda conforme a fase de produção, e isso evita investir em mobile antes de validar o essencial (o tom da conversa).

| Fase | Plataforma | Como o testador acessa |
|---|---|---|
| Fase 1 — protótipo de texto | Nenhuma "plataforma" real: script/CLI local ou uma página web simples de chat | Só você (dogfooding); se envolver alguém, via um link de chat simples ou até uma conversa mediada por você |
| Fase 2 — protótipo de voz | Web/desktop (navegador com Web Speech API, ou app desktop simples) | Link local ou executável simples, testado por você e 1–2 pessoas de confiança |
| Fase 3 — vertical slice | Android (prioridade) | APK assinado enviado diretamente, ou faixa de **Teste Interno do Google Play Console** (até 100 testadores, sem revisão de loja) |
| Fase 4–5 — campanha completa | Android + avaliar iOS depois | Google Play (Teste Fechado/Aberto) e, se for além do círculo próximo, **TestFlight** para iOS |

**Por que Android primeiro:** distribuição de teste é mais simples e barata (Play Console: taxa única de US$25; APK direto nem precisa disso). iOS exige Apple Developer Program (US$99/ano) e TestFlight — vale adiar até validar o essencial em Android.

**Requisitos mínimos (proposta, a ajustar na Fase 3):** Android 8.0+ (API 26+), pensando em alcance amplo sem exigir hardware topo de linha, já que o jogo não depende de gráficos pesados.

## 2. Considerações de loja (para quando for além de teste fechado)

- **Classificação indicativa:** o jogo toca em relacionamento, fidelidade, política, religião e saúde mental — provavelmente precisa de classificação para adolescentes/adultos (equivalente ao "T for Teen" que o Seaman original tinha nos EUA). Definir isso formalmente só é necessário perto do lançamento, mas já vale ter em mente para não subestimar o processo de submissão.
- **Política de IA generativa das lojas:** Google Play e Apple têm políticas específicas para apps com conteúdo gerado por IA em tempo real (moderação de conteúdo, mecanismo de denúncia, transparência sobre uso de IA). Isso é um item de checklist pré-lançamento, não um bloqueio agora.
- **Idade mínima recomendada:** dado o teor das perguntas (ver [11-dados-privacidade.md](11-dados-privacidade.md)), sugerir um age-gate (14+ ou 16+) já no protótipo mobile, mesmo em teste fechado.

## 3. Plano de testes por fase

### Fase 0–1: leitura e protótipo de texto
- **Quem testa:** você primeiro; depois 2–3 pessoas de confiança, avisadas do teor pessoal das perguntas.
- **Consentimento:** antes de qualquer sessão, explicar o que o app pergunta e como os dados são tratados (ver [11-dados-privacidade.md](11-dados-privacidade.md#4-consentimento-de-playtesters)) — mesmo num teste informal por chat.
- **O que observar:** o tom soa genuíno ou clichê? Algum check-in pareceu formulário/clínico? A extração de `axes_delta`/memórias está funcionando sem inventar fatos que o jogador não disse?
- **Como registrar feedback:** perguntas curtas pós-sessão (ver seção 4).

### Fase 3: vertical slice mobile
- **Quem testa:** círculo próximo, 3–5 pessoas, via Teste Interno do Play Console.
- **Checklist por sessão:** o dia avançou corretamente? A notificação disparou? A memória citou algo real da conversa anterior? A transição visual (Cutscene 1/2) rodou sem travar?
- **Modo de teste acelerado:** usar o recurso já previsto no roadmap ([05-roadmap-producao.md](05-roadmap-producao.md)) para não depender de 7 dias reais por rodada de teste.

### Fase 4–5: campanha completa
- **Quem testa:** grupo maior (beta fechado), cobrindo os 21 dias completos ao menos uma vez, idealmente com 2–3 pessoas em cada um dos 4 finais possíveis (variando respostas de propósito para cobrir Florescimento/Equilíbrio/Alerta/Reencontro).
- **Bug tracking:** GitHub Issues no próprio repositório [seaman2030](https://github.com/ACrush14/seaman2030), com labels sugeridas: `tom` (personalidade quebrou), `bug` (erro técnico), `mecanica` (eixos/estágio/final incorretos), `custo-api` (uso de tokens fora do esperado).

## 4. Coleta de feedback (roteiro de perguntas pós-sessão)

Usar sempre estas perguntas curtas, adaptando à fase:

1. Teve algum momento em que o bicho pareceu "um aplicativo" em vez de um personagem? Qual?
2. Alguma pergunta pareceu invasiva ou fora de hora?
3. Ele lembrou de algo que você disse antes? Isso pareceu natural ou forçado?
4. Teve alguma piada ou reação que não combinou com o personagem?
5. (Só na Fase 3+) A evolução visual/o estágio pareceu condizente com os dias passados?

## 5. Critérios de saída (resumo — detalhado por fase em [05-roadmap-producao.md](05-roadmap-producao.md))

Cada fase só avança quando os testers relatam consistentemente "isso parece ele mesmo" nas perguntas 1 e 4 acima — não existe uma métrica numérica de qualidade de tom, é avaliação qualitativa recorrente.
