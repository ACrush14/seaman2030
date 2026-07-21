# 12 — Pipeline de Voz (captura e geração de fala)

Volta para [PLANNING.md](../PLANNING.md). Complementa a seção de voz em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#6-voz).

## Por que isto é mais complicado do que "gravar um dublador"

As falas do bicho são **geradas dinamicamente pelo LLM a cada conversa** (ver [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#3-prompt-de-personalidade)), não um roteiro fixo. Isso significa que não dá pra simplesmente contratar um dublador e gravar linhas prontas — a voz de saída precisa ser **sintetizada em tempo real a partir de texto que não existia antes daquela conversa**. Por isso voz é uma decisão técnica própria, não só uma escolha de "quem grava".

## 1. Entrada de voz (STT — fala do jogador virando texto)

- **Padrão:** reconhecimento nativo do aparelho (Android SpeechRecognizer / iOS Speech framework) — baixa latência, funciona sem depender só de rede, mais privado (o áudio não precisa sair do aparelho).
- **Fallback:** um serviço de STT em nuvem para quando o reconhecimento nativo falhar ou para melhorar precisão em fala informal/gírias em português — avaliar na Fase 2 se o nativo já é suficiente antes de adicionar essa complexidade.
- **Como saber que o jogador parou de falar:** a opção mais simples e mais barata de implementar no protótipo é um botão de "segurar para falar" (push-to-talk); detecção automática de silêncio (VAD) é uma melhoria de UX pra depois, não bloqueante.
- **Fallback textual sempre visível** — já é diretriz registrada em [04](04-arquitetura-tecnica.md#6-voz) e [09](09-direcao-de-arte.md#6-uiux-wireframe-conceitual).
- **Privacidade:** áudio bruto não deve ser retido depois de transcrito, a menos que o jogador tenha consentido explicitamente com isso para fins de depuração — ver [11-dados-privacidade.md](11-dados-privacidade.md).

## 2. Geração de texto

Já coberta em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#3-prompt-de-personalidade) — o LLM gera a fala do bicho junto com a extração estruturada de eixos/memórias.

## 3. Saída de voz (TTS — texto do bicho virando áudio)

Duas rotas possíveis, a validar ouvindo lado a lado na Fase 2 do roadmap:

### Rota A — TTS sintético + processamento de áudio

Usar uma voz de TTS pronta (nuvem ou nativa) e aplicar uma camada de processamento por cima — alteração de pitch, leve distorção de formante, um traço de reverb abafado — para criar um timbre não-humano, coerente com o visual grotesco.

- **Vantagens:** barato, rápido de prototipar, sem nenhuma questão de clonagem de voz.
- **Desvantagens:** pode soar mais "robótico" que "vivo" se o processamento for exagerado — precisa calibrar ouvindo, não só na teoria.

### Rota B — Clonagem de voz a partir de uma gravação real (pode ser a sua própria voz)

Gravar alguns minutos de fala natural (ver roteiro de gravação abaixo) e usar um serviço/modelo de clonagem de voz (existem opções comerciais com clonagem de voz personalizada, e alternativas que rodam localmente) para treinar uma voz sintética baseada nessa gravação. Depois, aplicar a mesma camada de processamento da Rota A por cima da voz clonada.

- **Vantagens:** prosódia mais natural como ponto de partida (a voz "soa mais viva" antes mesmo de distorcida); usar a sua própria voz resolve custo de contratar dublador e qualquer questão de direitos de terceiros, já que é sua e você decide o uso.
- **Desvantagens:** serviços de clonagem custam por geração/uso; qualidade em português brasileiro varia por provedor (validar na prática); depois de processada e distorcida, a voz de origem fica irreconhecível de qualquer forma — ou seja, "usar sua voz" ajuda na prática/economia de produção, não significa que "sua voz" será reconhecível no produto final.

### Recomendação

Gravar a mesma frase de teste nas duas rotas na Fase 2 e comparar ouvindo — é uma decisão de tom de personagem, melhor validada empiricamente do que decidida na teoria.

## 4. Se optar pela Rota B: o que gravar

Um banco de gravação útil para clonagem cobre variedade de fonemas e de emoção, não só volume de texto:

- Frases neutras com boa cobertura fonética do português
- Frases em tom de pergunta/curiosidade
- Frases em tom sarcástico/irônico
- Frases em tom mais grave/preocupado (para os momentos do Evento de Virada e do Espelho, ver [02-roteiro-dialogos.md](02-roteiro-dialogos.md))
- Mistura de frases curtas e longas (ajuda o modelo a aprender cadência, não só timbre)

O roteiro de gravação específico (linha por linha) só precisa existir quando for prototipar a Rota B na Fase 2 — não é um bloqueio para o planejamento atual.

## 5. Latência e custo

- **Meta de latência** do ciclo completo (fala do jogador → STT → LLM → TTS → áudio de resposta): abaixo de ~2–3 segundos, para não quebrar a sensação de diálogo — a validar com medição real na Fase 2, não estimar de antemão.
- **Custo:** toda geração de TTS tem custo por caractere/segundo — isso entra no mesmo orçamento de custo por sessão já registrado como risco em [PLANNING.md](../PLANNING.md#6-riscos--decisões-em-aberto) e na postura de monetização definida ali.
- **Streaming de áudio em chunks** (o bicho "fala" enquanto ainda está gerando o resto da frase) ajuda a esconder latência, mas aumenta a complexidade — só vale a pena implementar se o teste sem streaming não bater a meta de latência.

## 6. Fallback quando a voz falha

Se STT ou TTS falhar (sem internet, erro de serviço), a conversa deve cair automaticamente para o modo texto **sem travar a cena** — nunca deixar o jogador esperando um áudio que não vai chegar. Ver também o fallback geral de API em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#7-resiliência-quando-a-api-falha).
