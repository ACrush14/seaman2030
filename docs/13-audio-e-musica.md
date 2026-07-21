# 13 — Direção de Som e Música

Volta para [PLANNING.md](../PLANNING.md). Complementa a direção de arte visual em [09-direcao-de-arte.md](09-direcao-de-arte.md) e a voz do personagem em [12-pipeline-de-voz.md](12-pipeline-de-voz.md).

## 1. Por que isso precisa de planejamento próprio

Até agora, todo o desenho de "personalidade sonora" cobria só a voz do bicho. Faltava o resto do universo sonoro: ambiente, efeitos funcionais e música. Sem isso, mesmo com o diálogo certo, o jogo pode soar vazio ou genérico.

## 2. Ambiente sonoro

- **Camada de fundo contínua e discreta:** água, bolhas ocasionais, um zumbido baixo — coerente com a cena fixa definida em [09-direcao-de-arte.md](09-direcao-de-arte.md#3-ambiente-decisão-simplificar-drasticamente). Deve ser sutil o bastante para nunca competir com a voz/texto da conversa.
- **Variação por estágio/final:** o ambiente sonoro pode mudar sutilmente de textura acompanhando a paleta de cor por estágio/final já definida em [09](09-direcao-de-arte.md#5-paleta-de-cores) — mais "morno" e vivo no Florescimento, mais "abafado" no Alerta.

## 3. Efeitos sonoros funcionais

| Momento | Efeito |
|---|---|
| Ovo rachando/eclosão | Som curto e físico, sem exagero (ver [Cutscene 1](03-storyboard-cutscenes.md#cena-1--eclosão-fim-do-dia-1)) |
| Notificação push diária | Som de notificação próprio e reconhecível, mas discreto — não deve soar como notificação genérica de sistema |
| Transição de estágio | Um som curto de "mudança", sutil, sem música por cima (a transformação visual já carrega o peso, ver [03](03-storyboard-cutscenes.md)) |
| Envio de mensagem/pergunta do bicho | Um "tique" sonoro leve, opcional, pra marcar que é a vez do jogador responder |

## 4. Música

- **Uso mínimo e deliberado:** música não deve tocar o tempo todo — presença constante de trilha dilui o peso dos poucos momentos em que ela aparece. Reforça a decisão já tomada de que o **Evento de Virada é silencioso de propósito** (ver [Cutscene 3](03-storyboard-cutscenes.md#cena-3--evento-de-virada-dias-10–12-sem-transformação-visual)).
- **Onde a música aparece:** transições de estágio (breve, poucos segundos) e a cutscene de final (Dia 21), com uma variação de tema por final — quente/ascendente no Florescimento, estável no Equilíbrio, contido/melancólico no Alerta.
- **Origem da música:** compor algo próprio simples (mesmo que minimalista) ou usar música royalty-free com licença clara — **nunca depender de música licenciada de terceiros sem os direitos resolvidos**, para não criar um bloqueio de lançamento por causa de trilha sonora.

## 5. Prioridade de produção

Som/música é a última camada a receber atenção de produção — só entra em jogo a partir da Fase 3 (vertical slice), depois que voz e texto já estiverem validados. Não é um bloqueio para a Fase 1/2.
