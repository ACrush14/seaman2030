# Protótipo Fase 1 — Conversa em Texto Puro (Ato 1)

Implementa a Fase 1 do [roadmap](../docs/05-roadmap-producao.md): validar se a personalidade e os check-ins do Ato 1 soam certos, sem app, sem voz. Segue o roteiro de [docs/14-roteiro-ato1-completo.md](../docs/14-roteiro-ato1-completo.md) e a arquitetura de [docs/04-arquitetura-tecnica.md](../docs/04-arquitetura-tecnica.md).

## Como rodar

```bash
cd prototype-fase1
npm install
cp .env.example .env
```

Edite `.env` e coloque sua `ANTHROPIC_API_KEY` (ou rode `ant auth login` e deixe em branco).

```bash
npm start
```

## Comandos no chat

- Digite qualquer coisa para conversar com o bicho.
- `/status` — mostra dia atual, estágio e eixos (só para depuração — isso nunca aparece assim no jogo real).
- `/avancar` — força o avanço para o próximo dia da campanha (equivalente ao "modo de teste acelerado" do roadmap; no jogo real o dia só avança por interação real, ver [docs/01](../docs/01-narrative-design.md#regra-de-ausência-o-que-acontece-se-o-jogador-não-abrir-o-app-num-dia)).
- `/sair` — salva e encerra.

## O que este protótipo cobre (e o que não cobre)

- **Cobre:** os 7 dias do Ato 1, personalidade via prompt, extração estruturada de eixos e memórias via tool use forçado (`seaman_turn`), persistência local simples em `data/game-state.json`.
- **Não cobre (fica para fases seguintes):** voz (Fase 2), visual/Unity (Fase 3), Atos 2-3 e os finais (Fase 4), notificações push, Firebase real.

## Custo

Por padrão usa `claude-opus-4-8` (melhor qualidade). Para sessões de teste mais longas e baratas, defina `CLAUDE_MODEL=claude-sonnet-5` ou `CLAUDE_MODEL=claude-haiku-4-5` no `.env` — ver a postura de custo/monetização em [PLANNING.md](../PLANNING.md).

## O que observar durante o teste

Use o roteiro de perguntas de [docs/08-plataforma-e-testes.md](../docs/08-plataforma-e-testes.md#4-coleta-de-feedback-roteiro-de-perguntas-pós-sessão) depois de jogar os 7 dias.
