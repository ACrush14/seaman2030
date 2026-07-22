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

- [x] Implementar o backend mínimo (chamada à API da Claude com o prompt de personalidade de [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#3-prompt-de-personalidade)) — ver [prototype-fase1/](../prototype-fase1/README.md)
- [x] Simular os 7 dias do Ato 1 via CLI/chat de texto, com um "relógio" manual avançando o dia (comando `/avancar`)
- [x] Incluir desde já um **modo de teste acelerado** (avançar `currentDay` manualmente, sem esperar tempo real) — jogadores do Seaman original faziam isso adiantando o relógio do console para testar o jogo inteiro em poucas horas; vale adotar como feature de dev desde a Fase 1 (ver [00-pesquisa-referencia.md](00-pesquisa-referencia.md#3-nota-de-produção-modo-de-teste-acelerado))
- [x] Testar a extração estruturada de `axes_delta` e `new_memories` — implementado via tool use forçado (`seaman_turn`)
- [ ] Critério de saída: 2–3 playtesters concordam que o bicho "parece ele mesmo" e que os check-ins não soam a formulário — falta rodar o playtest de verdade (requer chave de API)

## Fase 2 — Voz (protótipo desktop/web)

- Adicionar STT/TTS a um protótipo simples (web ou desktop), ainda sem visual 3D
- Medir latência do ciclo STT → LLM → TTS (meta: manter a ilusão de diálogo natural)
- Escolher fornecedor de TTS para o timbre do personagem (ver seção 6 de [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md))

## Fase 3 — Vertical slice mobile (Ato 1 completo)

- Modelo 3D básico do personagem (estágio Ovo + Larval) em Unity URP
- App mobile mínimo: eclosão (Cena 1 do storyboard) + 7 dias de check-in/conversa livre jogáveis fim a fim
- Notificações push como gatilho do check-in diário
- Persistência real via Firebase (Auth + Firestore, modelo de dados de [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#2-modelo-de-dados-firestore))
- Critério de saída: alguém de fora consegue jogar os 7 dias sem suporte seu e entende o que o jogo é

## Fase 4 — Campanha completa (Atos 2 e 3 + finais)

- Produzir estágios visuais Juvenil e Quase-adulto + as 3 transições ([03-storyboard-cutscenes.md](03-storyboard-cutscenes.md))
- Implementar o Evento de Virada (lógica de detecção de flags + cutscene própria)
- Implementar os 4 finais (lógica de cálculo + cutscenes + tela de epílogo não-numérica)
- Memória de médio prazo completa (busca por tópico, não só últimas N mensagens)

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
