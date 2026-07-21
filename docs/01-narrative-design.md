# 01 — Design Narrativo

Volta para [PLANNING.md](../PLANNING.md).

## 1. Premissa

Você encontra um ovo de origem desconhecida. Dentro dele, algo com rosto humano e corpo de peixe está prestes a nascer — e, pelo motivo que for, a única coisa que parece mantê-lo vivo e saudável é **prestar atenção real em como ele está**, o que inevitavelmente vira uma desculpa para ele prestar atenção em como *você* está (trabalho, sono, rotina, humor). Ele não é gentil sobre isso. Ele é curioso, um pouco sarcástico, e implacavelmente direto.

A campanha dura **21 dias corridos** (proposta inicial, a validar em playtest — ver risco em [PLANNING.md](../PLANNING.md#6-riscos--decisões-em-aberto)), divididos em 3 atos de uma semana cada, terminando em um final real que reflete a jornada. Essa duração coincide com o tempo real que o Seaman original levava para ser concluído — ver [00-pesquisa-referencia.md](00-pesquisa-referencia.md#1-o-que-o-jogo-original-realmente-fazia-fatos-de-design), o que reforça (não define sozinho) essa escolha.

## 2. Os três eixos de cuidado

Toda interação (check-in estruturado ou conversa livre) empurra três eixos, cada um de 0 a 100, começando em 50 (neutro):

| Eixo | O que mede | Alimentado por |
|---|---|---|
| **Trabalho** | Equilíbrio entre demanda de trabalho e limites saudáveis | Respostas de check-in sobre carga horária, pausas, prazos, sensação de exaustão |
| **Saúde** | Sono, movimento, alimentação, cuidado básico | Respostas de check-in sobre sono, comida, corpo, energia física |
| **Vínculo** | Qualidade e frequência da relação com o bicho (não é sobre "produtividade", é sobre presença) | Frequência e profundidade da conversa livre, consistência em voltar todo dia, se o jogador lembra/retoma assuntos que o bicho trouxe antes |

**Importante (diretriz de design):** os eixos não devem ser lidos pelo jogador como "nota". A UI nunca mostra números crus ao jogador — ela mostra o estado do bicho (cor, postura, energia, falas). Os números existem só no backend para decidir estágio de evolução e final. Isso evita que o jogo vire uma régua de autocobrança.

## 3. Estágios de evolução (ligados aos dias da campanha)

| Dias | Ato | Estágio do bicho | O que muda na interação |
|---|---|---|---|
| Dia 1 | Prólogo | **Ovo** | Sem conversa ainda — só sons/movimentos dentro do ovo. Eclode no fim do dia 1 (ver storyboard). |
| Dias 2–7 | **Ato 1 — Eclosão** | **Larval** | Check-ins simples e diretos ("dormiu quantas horas?", "seu dia foi corrido?"). Bicho é curioso sobre o básico do mundo humano, ainda não conhece o jogador. |
| Dias 8–14 | **Ato 2 — Reconhecimento** | **Juvenil** | O bicho começa a **citar respostas antigas** ("você disse semana passada que ia tentar sair mais cedo do trabalho — rolou?"). Check-ins ficam mais específicos. Acontece o **Evento de Virada** (ver seção 5) entre os dias 10–12. |
| Dias 15–20 | **Ato 3 — Espelho** | **Quase-adulto** | O bicho passa a **refletir de volta** padrões observados ("percebi que toda sexta você fala que dormiu mal — isso é normal pra você ou já virou rotina?"). Conversas mais vulneráveis, menos piadas de efeito, mais presença. |
| Dia 21 | **Epílogo** | **Forma final** (variável) | Cutscene de encerramento + um dos finais (seção 4). Sem novo ciclo automático — é o fim da campanha. |

### Regra de ausência: o que acontece se o jogador não abrir o app num dia

Decisão de design necessária e antes não resolvida: **o "Dia N" da campanha só avança quando o jogador completa a interação daquele dia, não pelo simples passar do relógio.** Ou seja, se o jogador some por 4 dias reais, o jogo não "pula" 4 dias de conteúdo sozinho — ele espera, e quando o jogador volta, ainda está no mesmo dia da campanha em que parou.

- **Por quê:** evita que a narrativa avance sem o jogador (o que quebraria a lógica de "o bicho evolui porque você prestou atenção nele") e evita a sensação de culpa/obrigação que o design já rejeita explicitamente (ver seção 6).
- **O que marca "completar o dia":** pelo menos uma troca de mensagem no check-in daquele dia — não precisa ser uma conversa longa.
- **Limite de avanço:** no máximo 1 dia de campanha avança por período de 24h reais, mesmo que o jogador converse várias vezes seguidas — preserva o ritmo de 3 semanas mesmo que alguém tente "maratonar" o jogo (nota: isso também é a base do "modo de teste acelerado" do roadmap, que existe justamente pra poder pular essa trava durante testes internos).
- **Ausência prolongada:** dias sem abrir o app não penalizam os eixos de Trabalho/Saúde (não é justo inferir nada sobre a vida real do jogador a partir do silêncio), mas podem refletir no eixo de **Vínculo** (ver seção 2) — o bicho pode comentar a ausência com leveza ao reencontrar o jogador, nunca com cobrança.
- **Notificação:** o lembrete diário (push) continua sendo enviado normalmente enquanto o dia não for completado, servindo de convite a voltar, não de cobrança.

## 4. Finais

Calculados no Dia 21 a partir da média dos três eixos ao longo da jornada (não só do valor final — pra recompensar consistência, não só o último dia). Todos os finais são escritos para serem **narrativamente satisfatórios**, nunca punitivos — a diferença é de tom e imagem, não de "sucesso vs. fracasso".

| Final | Condição (aprox.) | Tom |
|---|---|---|
| **Florescimento** | Trabalho e Saúde ambos altos (>70) | O bicho atinge uma forma vibrante e se transforma/parte em paz — celebração do equilíbrio conquistado. |
| **Equilíbrio** | Eixos medianos, sem extremos | Final calmo: o bicho permanece como companheiro estável, reconhecendo que "dias bons e ruins se misturaram, e tudo bem". |
| **Alerta** | Trabalho ou Saúde baixo (<30), independente do outro | O bicho fica visivelmente mais quieto/pálido e, na cena final, **devolve a preocupação ao jogador** de forma direta mas afetuosa — não é jumpscare de culpa, é o momento mais sincero do jogo. Termina com um convite claro (não raso) a continuar prestando atenção em si mesmo depois que o jogo acabar. |
| **Reencontro** (secreto) | Vínculo muito alto (>85) independente dos outros dois | Final alternativo/easter egg: sugestão de que o bicho "lembra" e pode retornar (gancho para New Game+ — fora do MVP, ver [PLANNING.md](../PLANNING.md#3-escopo-do-mvp)). |

## 5. Evento de Virada (Dias 10–12)

Ponto de virada obrigatório do Ato 2: o bicho, pela primeira vez, **recusa fazer o check-in de brincadeira de sempre** e pergunta algo fora do script padrão — geralmente motivado por um padrão que ele "percebeu" nas respostas anteriores (ex.: menções repetidas a trabalhar tarde da noite). Esse é o momento que estabelece que o jogo não é só um bichinho de estimação: é sobre o jogador. Roteiro completo em [docs/02-roteiro-dialogos.md](02-roteiro-dialogos.md#evento-de-virada-dias-10-12).

## 6. Tom e limites (diretriz para todo roteiro)

- O bicho pode ser sarcástico, impaciente, engraçado — **nunca** condescendente, clínico ou com tom de terapeuta/coach.
- Nunca usar escalas numéricas ("de 1 a 10, como está seu estresse?") — sempre perguntas concretas e específicas do cotidiano.
- Nunca implica culpa moral por más respostas (trabalhar demais, dormir mal). O julgamento não é do personagem — é só reflexo, o jogador tira as próprias conclusões.
- Se o jogador sinalizar algo sério (menção a crise real, burnout severo, saúde mental grave), o bicho não deve tentar "resolver" — deve reagir com genuína atenção e, fora da ficção, o app deve ter um aviso/rodapé apontando para recursos reais de apoio (ver nota de produto em [docs/05-roadmap-producao.md](05-roadmap-producao.md)).
