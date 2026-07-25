# 05 — Roadmap de Produção

Volta para [PLANNING.md](../PLANNING.md).

## Fase 0 — Planejamento (atual)

- [x] Conceito central e escopo ([PLANNING.md](../PLANNING.md))
- [x] Design narrativo: atos, eixos, estágios, finais ([01-narrative-design.md](01-narrative-design.md))
- [x] Roteiro de diálogos e guia de voz ([02-roteiro-dialogos.md](02-roteiro-dialogos.md))
- [x] Storyboard das cutscenes-chave ([03-storyboard-cutscenes.md](03-storyboard-cutscenes.md))
- [x] Arquitetura técnica (Unity + Firebase + Claude API) ([04-arquitetura-tecnica.md](04-arquitetura-tecnica.md))
- [ ] Nome de trabalho definitivo (ver nota de IP em [PLANNING.md](../PLANNING.md)) — decidir antes de qualquer divulgação pública
- [ ] Playtest do roteiro em texto puro com 2–3 pessoas próximas (ler as falas em voz alta / simular por chat) para validar tom antes de qualquer produção visual

## Fase 1 — Protótipo de conversa (texto puro, sem app)

**Objetivo:** validar se a personalidade e os check-ins do Ato 1 (Dias 1–7) soam certos — engraçados e genuínos, nunca clínicos — antes de investir em voz ou visual.

- [x] Implementar o backend mínimo — **revisado:** em vez de chamada à API da Claude, virou um motor 100% roteirizado (mesma filosofia do Seaman original — ver [00-pesquisa-referencia.md](00-pesquisa-referencia.md)) que roda o texto completo de [14-roteiro-ato1-completo.md](14-roteiro-ato1-completo.md) com classificação por palavra-chave para as ramificações. Ver [prototype-fase1/](../prototype-fase1/README.md#por-que-sem-api)
- [x] Simular os 7 dias do Ato 1 via CLI/chat de texto, com um "relógio" manual avançando o dia (comando `/avancar`)
- [x] Incluir desde já um **modo de teste acelerado** (avançar `currentDay` manualmente, sem esperar tempo real) — jogadores do Seaman original faziam isso adiantando o relógio do console para testar o jogo inteiro em poucas horas; vale adotar como feature de dev desde a Fase 1 (ver [00-pesquisa-referencia.md](00-pesquisa-referencia.md#3-nota-de-produção-modo-de-teste-acelerado))
- [x] Testar a extração estruturada de eixos e memórias — implementado via classificação por palavra-chave (sim/não, idade, área, sentimento) em vez de extração por LLM
- [x] Critério de saída: rodado e verificado — simulação completa dos dias 1–2, com ramificações e ajuste de eixos funcionando corretamente, respostas em 0–1ms, sem nenhuma chave de API
- [ ] Decisão em aberto: o roteiro fixo é suficiente pra experiência final, ou vale a pena reintroduzir geração dinâmica via LLM pra conversas livres e Atos mais avançados (onde o roteiro fixo tende a ficar repetitivo em replays)? Ver nota em [prototype-fase1/README.md](../prototype-fase1/README.md#o-que-este-protótipo-cobre-e-o-que-não-cobre)
- [x] **Adiantado da Fase 4:** o roteiro completo dos 21 dias (Atos 1–3, Evento de Virada, os 4 finais) já está implementado e testado no motor — ver checklist da Fase 4 abaixo.

## Fase 2 — Voz (protótipo desktop/web)

- [x] Adicionar STT/TTS a um protótipo simples (web ou desktop), ainda sem visual 3D — ver [prototype-fase2/](../prototype-fase2/README.md) (Web Speech API do navegador: Rota A de [docs/12](12-pipeline-de-voz.md)), reaproveitando o motor roteirizado da Fase 1
- [x] Medidor de latência do ciclo STT → motor → TTS embutido na própria página — validado via HTTP real: 0ms de processamento local (sem chamada de rede externa, a meta de latência deixa de ser um risco)
- [ ] Escolher fornecedor de TTS para o timbre do personagem (ver seção 6 de [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md)) — decisão adiada até decidir se compensa investir na Rota B (clonagem) dado que a Rota A (TTS do navegador) já resolve o essencial sem custo

## Fase 3 — Vertical slice mobile (Ato 1 completo)

- Modelo 3D básico do personagem (estágio Ovo + Larval) em Unity URP
- App mobile mínimo: eclosão (Cena 1 do storyboard) + 7 dias de check-in/conversa livre jogáveis fim a fim
- Notificações push como gatilho do check-in diário
- Persistência real via Firebase (Auth + Firestore, modelo de dados de [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#2-modelo-de-dados-firestore))
- Critério de saída: alguém de fora consegue jogar os 7 dias sem suporte seu e entende o que o jogo é

## Fase 4 — Campanha completa (Atos 2 e 3 + finais)

- [x] **Conteúdo/lógica implementados e testados no motor roteirizado** (adiantado da Fase 1, antes da Fase 3 de Unity): os 21 dias completos, o Evento de Virada com bifurcação real (dispara entre os dias 10–12, por acúmulo de sinais de excesso de trabalho ou garantido até o dia 12), e o cálculo dos 4 finais por média de eixos ao longo da jornada. Ver [prototype-fase1/README.md](../prototype-fase1/README.md#roteiro-completo-21-dias).
  - Balanceamento testado via simulação automatizada: Florescimento, Alerta e Equilíbrio confirmados alcançáveis com padrões de resposta plausíveis (positivo consistente, negativo consistente, misto); o Reencontro (final secreto) permanece propositalmente quase inatingível numa jogada normal — consistente com sua descrição em [01-narrative-design.md](01-narrative-design.md#4-finais) como gancho "fora do MVP", não uma meta normal de jogo.
- [ ] Produzir estágios visuais Juvenil e Quase-adulto + as 3 transições ([03-storyboard-cutscenes.md](03-storyboard-cutscenes.md)) — isso é trabalho de arte/Unity, continua pendente pra Fase 3+
- [ ] Cutscenes reais do Evento de Virada e dos finais (a lógica e o texto já existem no motor; falta a camada visual)
- [ ] Tela de epílogo não-numérica em Unity (o motor já gera um resumo textual não-numérico — falta a versão visual)
- [ ] Memória de médio prazo completa (busca por tópico, não só últimas N mensagens) — só relevante se a Fase 1 decidir reintroduzir LLM

## Fase 5 — Polimento

- Playtest com amigos cobrindo a campanha completa (21 dias reais ou acelerados para teste)
- Ajuste fino de balanceamento dos 3 eixos e dos thresholds de final
- Ajuste de personalidade com base em onde o tom "quebrou" durante os playtests
- Revisão de conteúdo sensível (ver nota de produto abaixo)

## Nota de produto: conteúdo sensível

Como o jogo toca em trabalho/saúde/esgotamento de forma real, antes de qualquer teste com pessoas fora do círculo próximo (Fase 3 em diante):

- Incluir, fora da ficção (tela de configurações ou primeira abertura do app), um aviso curto e não-alarmista de que o jogo não substitui suporte profissional, com um link para recursos reais (ex. CVV no Brasil) — texto exato a definir na Fase 3.
- O bicho (dentro da ficção) nunca deve tentar diagnosticar ou aconselhar clinicamente — isso já está nas diretrizes de tom de [01-narrative-design.md](01-narrative-design.md#6-tom-e-limites-diretriz-para-todo-roteiro).

## Próximo passo imediato

Com o pacote de planejamento completo, o próximo passo natural é a **Fase 1**: montar o protótipo de texto puro para o Ato 1. Isso é código real (backend + prompt), então é o ponto onde a produção do jogo de fato começa.
