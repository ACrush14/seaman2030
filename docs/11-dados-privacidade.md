# 11 — Dados e Privacidade (guarda dos dados)

Volta para [PLANNING.md](../PLANNING.md). Modelo de dados técnico em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#2-modelo-de-dados-firestore). Nota de conteúdo sensível já registrada em [05-roadmap-producao.md](05-roadmap-producao.md#nota-de-produto-conteúdo-sensível).

> **Aviso:** este documento é um plano de produto, não parecer jurídico. Antes de qualquer lançamento além de teste fechado com pessoas próximas, vale revisão por alguém com conhecimento de LGPD/proteção de dados.

## 1. Por que isto precisa de atenção redobrada

O jogo, por design, faz perguntas que tocam em **dados pessoais sensíveis** conforme a LGPD (Lei 13.709/2018, Art. 5º, II) — não são só preferências de entretenimento:

- Saúde física e mental (check-ins de saúde, sono, exercício, menção a terapia)
- Vida sexual/orientação (perguntas de relacionamento em [07-C](07-banco-perguntas-fundacao.md#bloco-c--relacionamento-e-família-semana-2))
- Convicção religiosa e opinião política ([07-H](07-banco-perguntas-fundacao.md#bloco-h--esportes-política-religião-semana-3--tratamento-neutro-obrigatório))

Isso muda o padrão de cuidado necessário comparado a um app comum de bem-estar ou a um jogo qualquer.

## 2. O que é armazenado

Ver o schema completo em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#2-modelo-de-dados-firestore). Resumindo por sensibilidade:

| Categoria | Exemplos | Sensibilidade |
|---|---|---|
| Conta | e-mail/ID de autenticação | Comum |
| Progresso de jogo | dia atual, estágio, eixos, final obtido | Comum |
| Fatos biográficos neutros | entretenimento favorito, localização, profissão | Comum |
| Fatos sensíveis | saúde, relacionamento/fidelidade, religião/política, menções a saúde mental | **Sensível — Art. 5º, II LGPD** |
| Conversas brutas | texto das sessões de chat | Mista (contém tanto o comum quanto o sensível) |

## 3. Princípios de tratamento

- **Minimização:** só extrair para `memories` o que for necessário para callbacks narrativos (ver [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#3-prompt-de-personalidade)) — não guardar granularidade maior que o necessário.
- **Consentimento destacado para dados sensíveis:** antes do primeiro check-in que toca em saúde, relacionamento, religião/política ou saúde mental, o app deve mostrar um aviso curto e específico (não escondido em termos de uso genéricos) explicando que aquele tipo de pergunta é opcional e como o dado é usado.
- **Sempre pulável:** toda pergunta sensível pode ser recusada sem penalidade narrativa ou mecânica — já é uma diretriz de tom em [01-narrative-design.md](01-narrative-design.md#6-tom-e-limites-diretriz-para-todo-roteiro), mas aqui vira também uma exigência de privacidade.
- **Acesso restrito:** regras de segurança do Firestore devem restringir cada documento ao próprio UID do usuário — ninguém, nem o backend fora do fluxo normal de conversa, lê os dados de outro usuário.
- **Sem uso manual dos dados de teste sem aviso:** durante playtests, se for necessário olhar manualmente as conversas de um tester para debugar (ex. investigar um bug de memória), isso precisa ser avisado previamente a essa pessoa — nunca acesso silencioso.
- **Direito de exclusão:** o usuário pode pedir exclusão total da conta e dos dados a qualquer momento (equivalente ao direito de eliminação, LGPD Art. 18) — a implementar como uma ação simples nas configurações, não um processo manual via e-mail.
- **Retenção:** proposta inicial — dados mantidos enquanto a conta existir; sem prazo de expiração automática no MVP, mas revisar isso antes do lançamento público.

## 4. Consentimento de playtesters

Antes de qualquer sessão de teste (mesmo informal, com amigos), usar um texto curto equivalente a:

> "Esse protótipo/jogo vai te perguntar coisas pessoais de verdade (trabalho, saúde, relacionamento, e às vezes religião/política). Isso é intencional — é o coração da experiência. Você pode pular qualquer pergunta sem problema. Suas respostas ficam guardadas [onde: ex. banco de dados do desenvolvedor / arquivo local], só eu tenho acesso, e você pode pedir pra eu apagar tudo a qualquer momento. Isso não substitui aconselhamento profissional de saúde, e se algo real e sério aparecer na nossa conversa, é melhor procurar apoio de verdade, não só o personagem do jogo."

Adaptar o texto conforme o meio de teste (chat manual, protótipo de texto, app mobile).

## 5. Classificação etária e age-gate

Dado o teor (relacionamento, fidelidade, saúde mental, política/religião), recomenda-se:

- Age-gate simples na primeira abertura do app (declaração de idade, sem verificação forte no MVP).
- Classificação indicativa proposta: 14+ ou 16+, a confirmar formalmente com o processo de classificação da loja na Fase 4/5 (ver [08-plataforma-e-testes.md](08-plataforma-e-testes.md#2-considerações-de-loja-para-quando-for-além-de-teste-fechado)).
- Nenhum dado de menores de idade deve ser coletado no MVP/testes fechados — restringir participação de testers a adultos por enquanto.

## 6. Nota sobre custo/terceiros

**Atualizado:** o motor de diálogo do MVP passou a ser 100% local e roteirizado (sem API — ver [prototype-fase1/](../prototype-fase1/README.md) e [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md)). Isso é uma boa notícia de privacidade: **nenhuma resposta do jogador sai do aparelho** no caminho atual — não há terceiro processando as conversas, e esse item deixa de ser necessário no aviso de consentimento por enquanto.

Isso só volta a valer se o caminho de evolução opcional via LLM (ver [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#8-caminho-de-evolução-futuro-diálogo-gerado-por-llm-fora-do-mvp)) for adotado no futuro — nesse caso, reativar o aviso: "suas mensagens são processadas por um serviço de IA para gerar as respostas do personagem", e revisar a política de retenção de dados do provedor de API antes de qualquer lançamento público.
