# Protótipo Fase 1 — Roteiro Local (Ato 1)

Implementa a Fase 1 do [roadmap](../docs/05-roadmap-producao.md): validar se a personalidade e os check-ins do Ato 1 soam certos, sem app, sem voz — e, a partir desta versão, **sem depender de nenhuma API externa**.

## Por que sem API

O Seaman original não usava IA generativa — ele funcionava com respostas roteirizadas e reconhecimento simples de algumas palavras-chave via microfone (ver [docs/00-pesquisa-referencia.md](../docs/00-pesquisa-referencia.md)). Este protótipo segue a mesma lógica: o roteiro completo do Ato 1 ([docs/14-roteiro-ato1-completo.md](../docs/14-roteiro-ato1-completo.md)) foi codificado direto em [src/script.js](src/script.js), e um classificador simples por palavra-chave ([src/classify.js](src/classify.js)) resolve as ramificações (sim/não, idade, área de trabalho, sentimento da resposta) — sem chamada de rede, sem custo, sem chave, resposta instantânea.

## Como rodar

```bash
cd prototype-fase1
npm install
npm start
```

Não precisa de `.env`, não precisa de chave de API. `npm install` só existe porque o projeto pode ganhar dependências de dev no futuro — hoje ele não tem nenhuma dependência de runtime.

## Comandos no chat

- Digite qualquer coisa para responder ao bicho.
- `/status` — mostra dia atual, estágio e eixos (só para depuração — isso nunca aparece assim no jogo real).
- `/avancar` — avança pro próximo dia da campanha (equivalente ao "modo de teste acelerado" do roadmap).
- `/sair` — salva e encerra.

## Como o motor funciona

- [src/script.js](src/script.js) — o roteiro do Ato 1 (dias 1–7) como dados: falas do bicho, perguntas, e ramificações condicionais.
- [src/classify.js](src/classify.js) — classificação por palavra-chave (sim/não, idade, área de trabalho, sentimento) — a mesma filosofia do Seaman original, não IA.
- [src/engine.js](src/engine.js) — percorre o roteiro do dia, aplica ramificações, guarda memórias e ajusta os eixos de cuidado a cada resposta.
- [src/state.js](src/state.js) — persistência local simples em `data/game-state.json`.

## Limitação conhecida ao testar de forma automatizada

O `readline` do Node perde linhas quando várias respostas chegam de uma vez via redirecionamento de arquivo (`node src/index.js < arquivo.txt`) — só a primeira linha de cada lote chega a ser processada. **Isso não afeta o uso real** (alguém digitando ao vivo sempre vai ter uma resposta por vez), só atrapalha scripts de teste automatizado. Para testar a lógica do motor diretamente sem esse problema, chame `advance()` de [src/engine.js](src/engine.js) direto num script Node, como foi feito para validar esta versão.

## O que este protótipo cobre (e o que não cobre)

- **Cobre:** os 7 dias do Ato 1, ramificações por palavra-chave, ajuste de eixos por sentimento simples, memórias, persistência local.
- **Não cobre (fica para fases seguintes):** voz (Fase 2), visual/Unity (Fase 3), Atos 2-3 e os finais (Fase 4), notificações push, Firebase real.
- **Decisão em aberto:** se o roteiro fixo (este protótipo) já é suficiente pra experiência final, ou se ainda vale a pena investir em geração dinâmica via LLM (como estava previsto originalmente em [docs/04-arquitetura-tecnica.md](../docs/04-arquitetura-tecnica.md)) para as conversas livres e os Atos mais avançados, onde o roteiro fixo tende a ficar repetitivo em replays. Vale decidir isso depois de jogar os 7 dias algumas vezes.
