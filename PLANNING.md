# Seaman2030 — Plano de Projeto

Reimaginação moderna do conceito de **Seaman** (Vivarium/SEGA, 1999/2000, Dreamcast — e sua sequência de PS2) para os dias atuais, endereçando diretamente o motivo pelo qual o jogo original está "datado", e acrescentando um propósito próprio: um companheiro que **evolui junto com o seu cuidado real com trabalho e saúde**, contado como uma campanha fechada com começo, meio e fim.

> ⚠️ **Nota de propriedade intelectual:** "Seaman" é marca registrada. Este plano trata o projeto como uma **releitura/spin espiritual pessoal**, não uma cópia comercial. Sugestão: usar um nome de trabalho próprio (ex.: *Merman*, *Aquarium*, *Homunculus* — a decidir) caso o projeto avance para algo compartilhável publicamente, mantendo "Seaman2030" só como codinome interno.

## Mapa dos documentos

| Documento | Conteúdo |
|---|---|
| `PLANNING.md` (este arquivo) | Visão geral, conceito, escopo, stack, marcos |
| [docs/00-pesquisa-referencia.md](docs/00-pesquisa-referencia.md) | O que a pesquisa sobre o Seaman original confirma/muda no nosso design |
| [docs/01-narrative-design.md](docs/01-narrative-design.md) | Estrutura de atos, estágios de evolução, eixos de cuidado, finais |
| [docs/02-roteiro-dialogos.md](docs/02-roteiro-dialogos.md) | Roteiros de diálogo (check-ins e conversa livre) por fase |
| [docs/06-banco-perguntas-modernas.md](docs/06-banco-perguntas-modernas.md) | Catálogo de perguntas modernizadas (2026) sobre trabalho/saúde por ato |
| [docs/07-banco-perguntas-fundacao.md](docs/07-banco-perguntas-fundacao.md) | Perguntas de fundação: identidade, família, relacionamento, autoimagem, tecnologia, filosofia |
| [docs/08-plataforma-e-testes.md](docs/08-plataforma-e-testes.md) | Plataforma por fase, distribuição de testes, plano de testes e feedback |
| [docs/09-direcao-de-arte.md](docs/09-direcao-de-arte.md) | Direção de arte, fidelidade visual por fase, ambiente, UI/UX, paleta |
| [docs/10-calendario-roteiro-21-dias.md](docs/10-calendario-roteiro-21-dias.md) | Calendário dia-a-dia (1 a 21) mapeando conteúdo de cada dia da campanha |
| [docs/11-dados-privacidade.md](docs/11-dados-privacidade.md) | Guarda de dados, privacidade, consentimento (LGPD) |
| [docs/03-storyboard-cutscenes.md](docs/03-storyboard-cutscenes.md) | Storyboard das cenas-chave (eclosão, evoluções, finais) |
| [docs/04-arquitetura-tecnica.md](docs/04-arquitetura-tecnica.md) | Stack, modelo de dados, arquitetura de prompt/API |
| [docs/05-roadmap-producao.md](docs/05-roadmap-producao.md) | Marcos de produção, do protótipo à campanha completa |

## 1. O que fazia o Seaman original especial (e por que está datado)

| Pilar original | Por que funcionava em 1999 | Por que está datado em 2026 |
|---|---|---|
| Reconhecimento de voz (microfone do Dreamcast) | Inovador para a época | Reconhecimento rígido, vocabulário limitado, frustrante hoje |
| Diálogo scriptado com humor ácido/surreal | Sensação de personalidade única, narrado por Leonard Nimoy | Repetitivo após poucas sessões; sem memória real das conversas |
| Ciclo de vida (ovo → girino → seaman adulto) em tempo real | Criava senso de posse e rotina diária | Mecânica de "cuidar todo dia" hoje compete com dezenas de apps de hábito/pet |
| Estética grotesca (rosto humano em corpo de peixe) | Chocante e memorável | Ainda funciona — **isso deve ser preservado**, não é o que envelheceu |
| Hardware dedicado (VMU, microfone proprietário) | Diferencial técnico | Hoje é só fricção — todo mundo já tem microfone e IA de voz no bolso |
| Jogo sem fim definido, decaía com o tempo indefinidamente | Mantinha o jogador voltando | Hoje soa a obrigação/culpa, não a experiência — **decidimos não repetir isso** |

## 2. Conceito central da versão moderna

Manter o DNA (bicho de estimação estranho, rabugento, que **conversa de verdade** com você e reage ao que você diz) e adicionar um propósito emocional que o original não tinha: o bicho existe numa **jornada fechada** e reflete, através da sua evolução, como você tem cuidado de si mesmo.

- **Mecânica híbrida:** no dia a dia o jogador conversa livremente com o bicho (humor, curiosidade sobre o mundo humano, no espírito do Seaman original). Periodicamente (um "ritual" diário) o bicho puxa um **check-in estruturado** sobre trabalho e saúde — nunca com cara de app de bem-estar clínico, sempre no tom sarcástico/curioso do personagem. As respostas desses check-ins (e sinais extraídos da conversa livre) alimentam três eixos internos que impulsionam a evolução do bicho. Detalhes em [docs/01-narrative-design.md](docs/01-narrative-design.md).
- **Campanha fechada:** a jornada tem duração definida (proposta: 21 dias corridos, 3 semanas/3 atos) e um **final real** — não um loop infinito. O final é determinado pelo acumulado dos três eixos de cuidado ao longo da jornada, com variações (não é "vitória vs. derrota", é reflexo do que a jornada real foi).
- **Voz → conversa real:** reconhecimento de fala moderno (STT do dispositivo) + LLM (API da Claude) gerando as respostas do bicho em tempo real, com personalidade consistente via system prompt (rabugento, curioso, sarcástico, nunca condescendente sobre saúde mental/trabalho).
- **Memória:** o bicho lembra de conversas anteriores e das respostas dos check-ins (nome do jogador, fatos, padrões — "você mencionou 3 vezes essa semana que dormiu mal").
- **Plataforma:** app mobile (Android/iOS). Notificações push substituem o hábito de "ligar o Dreamcast pra ver como ele está" e viram o gatilho do check-in diário.
- **Visual:** design perturbador/cômico (rosto humano realista em corpo de peixe) preservado, com fidelidade visual moderna (3D em tempo real, Unity URP).

## 3. Escopo do MVP

**Incluir:**
- Um único bicho com personalidade fixa (não precisa de múltiplas espécies)
- Conversa por voz ou texto (fallback texto é importante para acessibilidade/testes)
- Ciclo de check-in diário estruturado (trabalho/saúde/humor) + conversa livre
- Três eixos de cuidado (Trabalho, Saúde, Vínculo) com decaimento/crescimento conforme interação
- Memória de curto e médio prazo (respostas de check-in + últimas N conversas) persistida por usuário
- Campanha vertical-slice: Ato 1 completo (eclosão + primeira semana) jogável fim a fim, para validar tom e ritmo antes de produzir os 21 dias inteiros

**Fora do MVP:**
- Os 3 atos completos e os múltiplos finais (fase 2 de produção, ver roadmap)
- Múltiplos bichos / "aquário" social entre usuários
- Narrador estilo Leonard Nimoy (precisaria de dublagem própria — custo alto)
- Hardware alternativo (smart speaker, etc.)
- New Game+ / final secreto "Reencontro"

## 4. Stack técnica

- **App:** Unity (mobile, URP) para 3D real e controle fino de animação do personagem.
- **Voz → texto:** STT nativo do dispositivo (Android SpeechRecognizer / iOS Speech framework), com fallback em nuvem se precisar de mais precisão.
- **Cérebro conversacional:** backend (Node/Python) chamando a API da Claude com system prompt de personalidade + contexto de memória (RAG leve) + extração estruturada dos eixos de cuidado a partir da conversa. Detalhes em [docs/04-arquitetura-tecnica.md](docs/04-arquitetura-tecnica.md).
- **Texto → voz:** TTS moderno para timbre estranho/não-humano, coerente com o visual grotesco.
- **Persistência:** Firebase (Auth + Firestore) para estado do bicho, eixos de cuidado, progresso na campanha (dia/ato atual) e histórico de conversas.

## 5. Marcos sugeridos (resumo — detalhado em docs/05-roadmap-producao.md)

1. **Fase 0 — Planejamento:** este pacote de documentos (narrativa, roteiros, storyboard, arquitetura, roadmap).
2. **Fase 1:** protótipo de conversa em texto puro (sem app, sem voz) cobrindo Ato 1 — validar se a personalidade e os check-ins soam certos (engraçado + genuíno, não clínico).
3. **Fase 2:** adicionar voz (STT/TTS) num protótipo desktop/web simples.
4. **Fase 3:** modelo 3D básico do personagem + app mobile mínimo (vertical slice do Ato 1), decaimento/evolução dos eixos ao longo do tempo real.
5. **Fase 4:** produção dos Atos 2 e 3 completos + os finais múltiplos + memória persistente entre sessões + notificações push.
6. **Fase 5:** polimento visual/animação, playtest com amigos, ajuste fino de personalidade e balanceamento dos eixos.

## 6. Riscos / decisões em aberto

- **Custo de API de LLM em tempo real** por usuário/sessão — precisa de um modelo de custo (ex. limitar duração de conversa por dia) se for além de uso pessoal.
- **Tom de humor vs. tema sensível:** falar de trabalho/saúde/esgotamento exige um equilíbrio cuidadoso — o bicho pode ser sarcástico e direto, mas nunca pode soar como terapeuta, nem minimizar sinais reais de esgotamento. Ver diretrizes de tom em [docs/02-roteiro-dialogos.md](docs/02-roteiro-dialogos.md).
- **Balanceamento dos 3 eixos e dos finais:** evitar que o jogo pareça "julgar" o jogador (ex. "final ruim" por ter uma semana difícil de verdade). Os finais devem ser variações narrativas, não punições.
- **Latência da conversa por voz** (STT → LLM → TTS) precisa ficar baixa o suficiente pra não quebrar a ilusão de diálogo natural — vale prototipar isso cedo (fase 1/2) antes de investir em visual 3D.
- **Duração da campanha (21 dias):** é uma proposta inicial — validar no playtest da Fase 1 se o ritmo é rápido/lento demais antes de produzir os 3 atos completos.
