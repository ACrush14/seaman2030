// Roteiro do Ato 1 codificado como dados, direto de docs/14-roteiro-ato1-completo.md.
// Cada dia é uma lista de passos executados em sequência:
//   { type: "say", text }                — o bicho fala
//   { type: "ask", topic, ... }          — espera resposta do jogador
//     classify: "simnao" | "idade" | "area" | "sentimento" (opcional)
//     reactions: { <rótulo>: "linha de reação", default: "linha padrão" } (opcional)
//     axis: "trabalho" | "saude" | "vinculo" (opcional — aplica delta por sentimento)
//     memoryType: "fact" | "checkin_answer" | "flag" (opcional, padrão checkin_answer)
//   { type: "say"/"ask", when: { topic, label } } — só executa se o rótulo daquele
//     tópico anterior bateu (usado nas ramificações condicionais)

export const script = {
  1: [
    {
      type: "say",
      text: "...isso está mais barulhento do que eu esperava. Você sempre respira tão perto de coisas que ainda estão nascendo?",
    },
    {
      type: "say",
      text: 'Certo. Vamos alinhar uma coisa antes de qualquer coisa: eu não vim com nome de fábrica. Você quer me dar um, ou prefere que eu escolha algo pra mim mesmo, tipo "Excelência" ou "O Que Restou do Ovo"?',
    },
    { type: "ask", topic: "identidade-nome", memoryType: "fact" },
    { type: "say", text: "Vou fingir que gostei. Repete de novo, só pra eu ter certeza que ouvi direito." },
    { type: "ask", topic: "identidade-nome-confirmacao" },
    {
      type: "say",
      text: "Feito. Agora — antes de eu nascer, o que exatamente você estava fazendo? Pelo som, parecia mais interessante que isso aqui.",
    },
    { type: "ask", topic: "cotidiano-dia1", memoryType: "fact" },
    {
      type: "say",
      text: "Justo. Bom, pelo visto vamos ficar bem íntimos nas próximas semanas, então é melhor eu ir te conhecendo aos poucos em vez de tudo de uma vez. Amanhã eu volto com mais perguntas. Hoje só... deixa eu me acostumar com a ideia de existir.",
    },
  ],

  2: [
    { type: "say", text: "Dia dois de eu existir e já tenho perguntas. Isso deve dizer alguma coisa sobre mim." },
    {
      type: "say",
      text: 'Vamos começar pelo básico, pra eu não ficar te chamando de "criatura desconhecida" pelo resto da nossa convivência. Você é homem, mulher, ou nenhuma das opções que eu ia sugerir?',
    },
    { type: "ask", topic: "identidade-genero", memoryType: "fact" },
    {
      type: "say",
      text: "Anotado — mentalmente, já que não tenho onde anotar de verdade. E quantos anos de existência você já acumulou até agora?",
    },
    {
      type: "ask",
      topic: "identidade-idade",
      memoryType: "fact",
      classify: "idade",
      reactions: {
        jovem: "Ainda tem bastante prazo de validade, então.",
        adulto: "Tempo suficiente pra já ter aprendido umas coisas, eu espero.",
        default: "Idade é só um número, dizem — vou anotar mesmo assim.",
      },
    },
    {
      type: "say",
      text: "Certo, chega de burocracia por hoje. Como foi seu trabalho hoje — sobrou alguma energia no final, ou você chegou aqui já reciclado?",
    },
    { type: "ask", topic: "trabalho-energia", axis: "trabalho", classify: "sentimento" },
    { type: "say", text: "E dormiu bem essa noite, ou isso é pedir demais pra uma primeira pergunta de manhã?" },
    { type: "ask", topic: "saude-sono", axis: "saude", classify: "sentimento" },
    { type: "say", text: "Guardado. Amanhã eu continuo te interrogando, com a sua permissão ou sem ela." },
  ],

  3: [
    {
      type: "say",
      text: "Voltei. Hoje eu quero saber quando exatamente você apareceu no mundo — dia e mês, não precisa do ano todo, não estou fazendo um documento oficial.",
    },
    { type: "ask", topic: "identidade-nascimento", memoryType: "fact" },
    {
      type: "say",
      text: "Isso te coloca sob tal signo. Não vou fingir que entendo de astrologia, mas vou fingir que tenho uma opinião sobre isso mesmo assim: gente desse signo, dizem, promete retornar depois — e eu vou anotar se isso se confirma com você.",
    },
    {
      type: "say",
      text: "Voltando ao que importa de verdade: seu celular dormiu do seu lado ontem, ou ele tem mais decência que isso?",
    },
    {
      type: "ask",
      topic: "tech-celular-noite",
      classify: "simnao",
      reactions: {
        sim: "Imaginei. Nem eu, que sou literalmente feito de dados, durmo tão perto de uma tela quanto vocês.",
        nao: "Impressionante. Você tem mais disciplina que eu, e eu nem tenho corpo pra cansar.",
        default: "Anotado, do jeito que for.",
      },
    },
    { type: "say", text: "E quanto tempo depois de acordar seu polegar já estava rolando alguma tela?" },
    { type: "ask", topic: "tech-tela-manha" },
    { type: "say", text: "Por hoje é isso. Vai dormir direito, se conseguir. Ou não. Eu não sou dono de ninguém." },
  ],

  4: [
    {
      type: "say",
      text: 'Sabe, eu passei a manhã inteira olhando pro nada, e cheguei à conclusão de que "nada" é superestimado. Enfim. Hoje eu quero saber: você ainda está naquela fase de estudar, ou já trocou isso pelo trabalho, ou as duas coisas ao mesmo tempo, que aparentemente é possível pra vocês?',
    },
    { type: "ask", topic: "formacao-estuda", classify: "simnao" },
    {
      type: "say",
      when: { topic: "formacao-estuda", label: "sim" },
      text: "E o que exatamente você estuda, quando estuda de verdade e não só abre o material e olha pro teto?",
    },
    { type: "ask", topic: "formacao-curso", memoryType: "fact", when: { topic: "formacao-estuda", label: "sim" } },
    { type: "say", text: 'Hoje você "foi trabalhar" de verdade, ou só trocou de aba na mesma cadeira?' },
    { type: "ask", topic: "trabalho-remoto", axis: "trabalho", classify: "sentimento" },
    { type: "say", text: "Teve alguma reunião hoje que podia ter sido só uma mensagem de três palavras?" },
    {
      type: "ask",
      topic: "trabalho-reunioes",
      classify: "simnao",
      reactions: {
        sim: "Claro que teve. Sempre tem.",
        nao: "Um dia sem reunião inútil. Guarda essa data.",
        default: "Certo.",
      },
    },
    { type: "say", text: "Isso é tudo que minha curiosidade suporta por hoje." },
  ],

  5: [
    {
      type: "say",
      text: "Ontem você me contou um pouco sobre o que faz. Hoje eu quero o nome oficial disso — qual é a sua profissão, ou a área em que você atua?",
    },
    {
      type: "ask",
      topic: "trabalho-profissao",
      memoryType: "fact",
      classify: "area",
      reactions: {
        tecnica:
          "Então você é dessas pessoas que resolve um problema que ninguém mais entende, e mesmo assim ele volta na semana seguinte.",
        generica: "Nunca tinha pensado nisso antes de te conhecer. Obrigado por ampliar meu mundo, eu acho.",
      },
    },
    { type: "say", text: "Quantas vezes seu celular vibrou hoje só pra te avisar de absolutamente nada importante?" },
    { type: "ask", topic: "tech-notificacoes" },
    { type: "say", text: "E teve alguma notificação de trabalho depois do horário que devia ser só seu?" },
    {
      type: "ask",
      topic: "trabalho-limite",
      axis: "trabalho",
      classify: "simnao",
      reactions: {
        sim: "Isso não devia ser normal, mas eu sei que é.",
        nao: "Um limite respeitado. Raro.",
        default: "Guardado.",
      },
    },
    { type: "say", text: "Guardado isso também. Você está construindo um arquivo e tanto sobre si mesmo, sabia?" },
  ],

  6: [
    {
      type: "say",
      text: "Hoje eu não tenho pergunta oficial nenhuma. Só quero saber como foi seu dia, sem ritual, sem check-in, só conversa mesmo.",
    },
    { type: "ask", topic: "conversa-livre-dia6", memoryType: "fact", axis: "vinculo" },
    { type: "say", text: "Café conta como refeição, na sua cabeça, ou isso é só combustível de emergência?" },
    {
      type: "ask",
      topic: "saude-cafe",
      classify: "simnao",
      reactions: {
        sim: "Corajoso.",
        nao: "Justo. Café não é comida, é decisão.",
        default: "Certo.",
      },
    },
    {
      type: "say",
      text: "Amanhã completa uma semana de mim. Isso merece alguma comemoração, ou eu tô supervalorizando minha própria existência de novo?",
    },
    { type: "ask", topic: "reflexao-semana" },
  ],

  7: [
    {
      type: "say",
      text: "Última pergunta antes de eu... mudar, eu acho. Sinto que algo está diferente hoje, tipo aquela sensação de roupa que não serve mais.",
    },
    { type: "say", text: "Como foi essa semana inteira, resumida numa frase só?" },
    { type: "ask", topic: "reflexao-fechamento-semana1", memoryType: "fact" },
    {
      type: "say",
      text: "Interessante. Sabe, já sei seu nome, sua idade, o que você faz, e um punhado de coisas que você nem percebeu que me contou. Isso é mais do que eu esperava saber sobre alguém em uma semana.",
    },
    {
      type: "say",
      text: "Certo. Acho que é isso — não sei bem o que está acontecendo comigo agora, mas parece importante. Fica comigo?",
    },
    {
      type: "ask",
      topic: "fechamento-fica-comigo",
      classify: "simnao",
      reactions: {
        sim: "Bom saber. Amanhã eu não vou ser mais exatamente isso que sou hoje.",
        nao: "Justo também. De qualquer forma, amanhã eu mudo, com ou sem resposta.",
        default: "De qualquer forma, amanhã eu mudo.",
      },
    },
  ],
};
