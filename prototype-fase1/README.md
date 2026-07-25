# Protótipo Fase 1 — Roteiro Local (21 dias completos)

Implementa a Fase 1 do [roadmap](../docs/05-roadmap-producao.md) e adianta boa parte da Fase 4: valida se a personalidade e os check-ins soam certos, sem app, sem voz, sem Unity — e **sem depender de nenhuma API externa**. Cobre os 21 dias inteiros da campanha (Atos 1, 2, 3 e o Epílogo com os 4 finais), não só o Ato 1.

## Por que sem API

O Seaman original não usava IA generativa — ele funcionava com respostas roteirizadas e reconhecimento simples de algumas palavras-chave via microfone (ver [docs/00-pesquisa-referencia.md](../docs/00-pesquisa-referencia.md)). Este protótipo segue a mesma lógica: o roteiro completo ([docs/14](../docs/14-roteiro-ato1-completo.md), [docs/15](../docs/15-roteiro-ato2-completo.md), [docs/16](../docs/16-roteiro-ato3-e-epilogo-completo.md)) foi codificado direto em [src/script.js](src/script.js), e um classificador simples por palavra-chave ([src/classify.js](src/classify.js)) resolve as ramificações (sim/não, idade, área de trabalho, sentimento da resposta) — sem chamada de rede, sem custo, sem chave, resposta instantânea.

## Como rodar

```bash
cd prototype-fase1
npm install
npm start
```

Não precisa de `.env`, não precisa de chave de API.

## Comandos no chat

- Digite qualquer coisa para responder ao bicho.
- `/status` — mostra dia atual, estágio e eixos (só para depuração — isso nunca aparece assim no jogo real).
- `/avancar` — avança pro próximo dia da campanha (equivalente ao "modo de teste acelerado" do roadmap).
- `/sair` — salva e encerra.

## Roteiro completo (21 dias)

| Dias | Ato | O que tem |
|---|---|---|
| 1–7 | Ato 1 (Larval) | Identidade, formação, trabalho/saúde básico |
| 8–14 | Ato 2 (Juvenil) | Relacionamento, família, autoimagem, **Evento de Virada** |
| 15–20 | Ato 3 (Quase-adulto) | Tecnologia, cena Espelho, esportes/política/religião (tratamento neutro), filosofia |
| 21 | Epílogo | Cálculo do final + um dos **4 finais** |

**Evento de Virada:** dispara no dia 11 se 3+ sinais de "trabalho em excesso" já apareceram nas respostas entre os dias 2–9; senão, dispara garantido no dia 12 (ver [docs/01](../docs/01-narrative-design.md#5-evento-de-virada-dias-10–12)).

**Finais:** calculados pela **média** dos eixos ao longo de toda a campanha, não só o valor do último dia (ver [docs/01](../docs/01-narrative-design.md#4-finais)). Testado via simulação automatizada com diferentes padrões de resposta:

| Cenário testado | Final obtido |
|---|---|
| Respostas consistentemente positivas | Florescimento |
| Respostas consistentemente negativas/sobrecarregadas | Alerta |
| Respostas mistas | Equilíbrio |
| Engajamento máximo (vínculo no teto) | Florescimento (não Reencontro) |

O **Reencontro** (final secreto) fica propositalmente quase inatingível numa jogada normal — como o vínculo começa em 50 e só sobe aos poucos, a média da jornada inteira dificilmente passa de 85, mesmo maximizando as respostas. Isso é consistente com a própria descrição do final em [docs/01](../docs/01-narrative-design.md#4-finais): é um gancho "fora do MVP" (New Game+), não uma meta normal de uma jogada.

## Como o motor funciona

- [src/script.js](src/script.js) — o roteiro completo dos 21 dias como dados: falas do bicho, perguntas, ramificações condicionais, e as funções que decidem o Evento de Virada e qual final mostrar.
- [src/classify.js](src/classify.js) — classificação por palavra-chave (sim/não, idade, área de trabalho, sentimento) — a mesma filosofia do Seaman original, não IA.
- [src/rules.js](src/rules.js) — regras compartilhadas: contagem de sinais de alerta e cálculo do final.
- [src/engine.js](src/engine.js) — percorre o roteiro do dia, aplica ramificações, guarda memórias e ajusta os eixos de cuidado a cada resposta.
- [src/state.js](src/state.js) — persistência local simples em `data/game-state.json`.

## Limitação conhecida ao testar de forma automatizada

O `readline` do Node perde linhas quando várias respostas chegam de uma vez via redirecionamento de arquivo (`node src/index.js < arquivo.txt`) — só a primeira linha de cada lote chega a ser processada. **Isso não afeta o uso real** (alguém digitando ao vivo sempre vai ter uma resposta por vez), só atrapalha scripts de teste automatizado. Para testar a lógica do motor diretamente sem esse problema, chame `advance()` de [src/engine.js](src/engine.js) direto num script Node, como foi feito para validar esta versão.

## O que este protótipo cobre (e o que não cobre)

- **Cobre:** os 21 dias completos, ramificações por palavra-chave, Evento de Virada, os 4 finais, ajuste de eixos por sentimento simples, memórias, persistência local.
- **Não cobre (fica pra Fase 3+):** voz (já existe em [prototype-fase2](../prototype-fase2/)), visual/Unity, notificações push, Firebase real, cutscenes de verdade (a lógica e o texto existem, falta a camada visual).
- **Decisão em aberto:** se o roteiro fixo já é suficiente pra experiência final, ou se ainda vale a pena investir em geração dinâmica via LLM (como estava previsto originalmente em [docs/04-arquitetura-tecnica.md](../docs/04-arquitetura-tecnica.md)) para as conversas livres, onde o roteiro fixo tende a ficar repetitivo em replays. Vale decidir isso depois de jogar a campanha inteira algumas vezes.
