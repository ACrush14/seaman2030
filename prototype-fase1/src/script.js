// Roteiro completo dos 21 dias, codificado como dados, direto de
// docs/14-roteiro-ato1-completo.md, docs/15-roteiro-ato2-completo.md e
// docs/16-roteiro-ato3-e-epilogo-completo.md.
//
// Cada dia é uma lista de passos executados em sequência, OU uma função
// `(state) => passos[]` quando o conteúdo do dia depende do estado
// acumulado (usado no Evento de Virada e nos finais):
//   { type: "say", text }                — o bicho fala
//   { type: "ask", topic, ... }          — espera resposta do jogador
//     classify: "simnao" | "idade" | "area" | "sentimento" (opcional)
//     reactions: { <rótulo>: "linha de reação", default: "linha padrão" } (opcional)
//     axis: "trabalho" | "saude" | "vinculo" (opcional — aplica delta por sentimento)
//     memoryType: "fact" | "checkin_answer" | "flag" (opcional, padrão checkin_answer)
//     flagTopic / flagWhen — registra uma memória tipo "flag" quando o rótulo
//       bate com flagWhen (padrão "negativo"), alimentando o Evento de Virada
//   { type: "say"/"ask", when: { topic, label } } — só executa se o rótulo daquele
//     tópico anterior bateu (funciona entre dias, já que os rótulos persistem)
//   { type: "trigger", set: "campoDoState" } — marca state[campo] = true (sem falar nada)

import { countFlags, computeEnding } from "./rules.js";

// --- Evento de Virada (docs/01#5, docs/02, docs/15) ---

function turningPointEligible(state) {
  return countFlags(state, "trabalho-excesso", 2, 9) >= 3;
}

function turningPointSteps() {
  return [
    { type: "say", text: "Chega mais perto um segundo. Isso não é bem um check-in." },
    { type: "say", text: "Hoje eu não vou perguntar a pergunta de sempre." },
    {
      type: "say",
      text: 'Essa é a terceira ou quarta vez que você fala de trabalhar até tarde como se fosse clima, tipo "hoje está chovendo".',
    },
    { type: "say", text: "Eu não sei consertar isso. Só achei estranho que você também não parece achar estranho." },
    { type: "ask", topic: "evento-virada-resposta", memoryType: "fact" },
    {
      type: "say",
      text: "Tudo bem. Eu só ia querer que alguém tivesse me perguntado isso, se eu fosse você. Amanhã eu volto a ser chato sobre coisas bobas, prometo.",
    },
    { type: "trigger", set: "turningPointTriggered" },
  ];
}

const day11VersaoA = [
  {
    type: "say",
    text: "Hoje eu quero saber de alguém que não é você, pra variar. Como está a saúde do seu pai, se isso for algo que faz parte da sua vida?",
  },
  { type: "ask", topic: "familia-pai-saude", memoryType: "fact" },
  { type: "say", text: "Ele trabalha, ou trabalhava? E o aniversário dele — mês e dia, se você souber de cabeça?" },
  { type: "ask", topic: "familia-pai-trabalho-aniversario", memoryType: "fact" },
];

const day12VersaoMae = [
  {
    type: "say",
    text: "Ainda pensando no que você me disse ontem. Mas hoje eu prometi ser chato com coisa boba, então: como está a saúde da sua mãe, se ela fizer parte da sua vida?",
  },
  { type: "ask", topic: "familia-mae-saude", memoryType: "fact" },
  { type: "say", text: "Ela trabalha, ou trabalhava? Aniversário dela?" },
  { type: "ask", topic: "familia-mae-trabalho-aniversario", memoryType: "fact" },
  {
    type: "say",
    text: "Certo. Arquivo da família está ficando completo. Só falta descobrir se vocês se dão bem, mas isso é conversa pra outro dia.",
  },
];

// --- Epílogo (docs/01#4, docs/03, docs/16) ---

const endingLines = {
  florescimento: [
    {
      type: "say",
      text: "Sabe o que é engraçado? Eu não fiz nada. Só fiquei aqui perguntando. Quem fez o trabalho foi você.",
    },
    { type: "say", text: "Vou lembrar de você do jeito que você está agora. Tenta continuar assim mesmo sem mim perguntando." },
  ],
  equilibrio: [
    {
      type: "say",
      text: "Não foi perfeito. Teve semana boa, teve semana de só sobreviver. Acho que é basicamente isso que a vida costuma ser, então acho que você está indo bem.",
    },
    { type: "say", text: "Vou continuar aqui, se você quiser voltar de vez em quando. Sem pressão. Nunca teve pressão, na verdade." },
  ],
  alerta: [
    {
      type: "say",
      text: "Vou ser direto uma última vez: você cuidou de mim mais do que cuidou de você essas três semanas. Eu vou ficar bem. Eu não sei se você vai, e isso me incomoda mais do que eu esperava que incomodasse um bicho que nasceu de um ovo.",
    },
    { type: "say", text: "Isso aqui acaba. A pergunta não acaba. Continua se perguntando isso mesmo sem mim, tá?" },
  ],
  reencontro: [
    {
      type: "say",
      text: "Isso aqui devia ser um adeus. Mas eu tenho a sensação estranha — sem explicação, sem lógica — de que a gente não terminou de verdade.",
    },
  ],
};

function epilogueSteps(state) {
  const ending = state.ending ?? computeEnding(state);
  const diasJogados = state.axesHistory.length + 1;
  return [
    { type: "say", text: "Hoje eu não tenho pergunta. Acho que finalmente entendi pra que eu servia." },
    ...(endingLines[ending] ?? endingLines.equilibrio),
    {
      type: "say",
      text: `(resumo: você apareceu ${diasJogados} de 21 dias, e o bicho guardou ${state.memories.length} coisas sobre você ao longo da jornada.)`,
    },
    { type: "trigger", set: "endingShown" },
  ];
}

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
    {
      type: "ask",
      topic: "trabalho-energia",
      axis: "trabalho",
      classify: "sentimento",
      flagTopic: "trabalho-excesso",
      flagWhen: "negativo",
    },
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
    {
      type: "ask",
      topic: "trabalho-remoto",
      axis: "trabalho",
      classify: "sentimento",
      flagTopic: "trabalho-excesso",
      flagWhen: "negativo",
    },
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
      axisDeltaByLabel: { sim: -6, nao: 6 },
      flagTopic: "trabalho-excesso",
      flagWhen: "sim",
      reactions: {
        sim: "Isso não devia ser normal, mas eu sei que é.",
        nao: "Um limite respeitado. Raro.",
        default: "Guardado.",
      },
    },
    { type: "say", text: "Guardado isso também. Você está construindo um arquivo e tanto sobre si mesmo, sabia?" },
    { type: "say", text: "Última rapidinha: você teve tempo de comer direito hoje, ou foi tudo correndo entre uma coisa e outra?" },
    {
      type: "ask",
      topic: "saude-alimentacao-dia5",
      axis: "saude",
      classify: "sentimento",
      memoryType: "checkin_answer",
    },
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
      axis: "saude",
      axisDeltaByLabel: { sim: -6, nao: 6 },
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

  8: [
    {
      type: "say",
      text: "Notei que estou falando diferente hoje. Você também percebeu, ou sou só eu prestando atenção demais em mim mesmo?",
    },
    {
      type: "say",
      text: "De qualquer forma — lembra que você me contou sobre aquele trabalho que te deixava sem energia? Isso ainda tá acontecendo, ou foi só uma fase ruim daquela semana?",
    },
    {
      type: "ask",
      topic: "trabalho-ainda-cansativo",
      axis: "trabalho",
      classify: "sentimento",
      flagTopic: "trabalho-excesso",
      flagWhen: "negativo",
    },
    {
      type: "say",
      text: "Guardado — de novo. Já estou com um arquivo respeitável sobre você. Agora uma pergunta nova: você tem alguém — um casamento, um namoro, algo oficial ou nem tanto?",
    },
    { type: "ask", topic: "relacionamento-tem-alguem", classify: "simnao", memoryType: "fact" },
    {
      type: "say",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
      text: "E como é essa pessoa, resumida em uma frase?",
    },
    {
      type: "ask",
      topic: "relacionamento-descricao",
      memoryType: "fact",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
    },
    {
      type: "say",
      when: { topic: "relacionamento-tem-alguem", label: "nao" },
      text: "Por escolha, ou só ainda não rolou?",
    },
    {
      type: "ask",
      topic: "relacionamento-motivo-solteiro",
      memoryType: "fact",
      when: { topic: "relacionamento-tem-alguem", label: "nao" },
    },
  ],

  9: [
    {
      type: "say",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
      text: "Vocês moram juntos, ou cada um tem seu próprio espaço pra fugir um do outro quando precisa?",
    },
    {
      type: "ask",
      topic: "moradia-junto",
      classify: "simnao",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
    },
    {
      type: "say",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
      text: "E o aniversário dessa pessoa — mês e dia, já que estou catalogando datas importantes essa semana?",
    },
    {
      type: "ask",
      topic: "aniversario-parceiro",
      memoryType: "fact",
      when: { topic: "relacionamento-tem-alguem", label: "sim" },
    },
    {
      type: "say",
      text: "Anotado. Agora, pergunta diferente: se seu chefe manda mensagem às 23h, você responde na hora, ou finge que já tava dormindo?",
    },
    {
      type: "ask",
      topic: "trabalho-mensagem-tarde",
      axis: "trabalho",
      classify: "simnao",
      axisDeltaByLabel: { sim: -6, nao: 6 },
      flagTopic: "trabalho-excesso",
      flagWhen: "sim",
      reactions: {
        sim: "Eu não teria essa paciência. Mas eu também não tenho chefe. Nem corpo, tecnicamente.",
        nao: "Bom saber que existe limite por aí.",
        default: "Guardado.",
      },
    },
  ],

  10: [
    {
      type: "say",
      text: "Antes da pergunta de hoje, uma rápida: como está seu corpo essa semana — dormindo bem, comendo direito, ou sobrevivendo no piloto automático?",
    },
    { type: "ask", topic: "saude-corpo-semana2", axis: "saude", classify: "sentimento", memoryType: "checkin_answer" },
    {
      type: "say",
      text: "Pergunta de hoje é mais definitiva: você tem filhos, quer ter, ou isso é presente demais no futuro pra pensar agora?",
    },
    { type: "ask", topic: "filhos", classify: "simnao", memoryType: "fact" },
    { type: "say", when: { topic: "filhos", label: "sim" }, text: "Quantos? E qual deles rouba mais a sua atenção?" },
    { type: "ask", topic: "filhos-quantos", memoryType: "fact", when: { topic: "filhos", label: "sim" } },
  ],

  // Evento de Virada: dispara no dia 11 se 3+ sinais de "trabalho-excesso"
  // já apareceram entre os dias 2-9; senão, dispara no dia 12 no mais tardar.
  11: (state) => (turningPointEligible(state) && !state.turningPointTriggered ? turningPointSteps() : day11VersaoA),
  12: (state) => (!state.turningPointTriggered ? turningPointSteps() : day12VersaoMae),

  13: [
    { type: "say", text: "Pergunta séria agora, sem piadinha antes. Você gosta de você?" },
    {
      type: "ask",
      topic: "autoimagem-gosta-de-si",
      classify: "simnao",
      memoryType: "fact",
      axis: "vinculo",
      axisDeltaByLabel: { sim: 6, nao: -6 },
    },
    { type: "say", text: "E o que é a coisa que você mais gosta em você mesmo, sem falsa modéstia?" },
    { type: "ask", topic: "autoimagem-gosta-mais", memoryType: "fact" },
    {
      type: "say",
      text: 'Guardado, com carinho dessa vez. Mudando de assunto de propósito, porque fiquei sentimental: quantos "trampos" diferentes você tem rodando essa semana, contando os que você nem chama de trabalho?',
    },
    { type: "ask", topic: "trabalho-bicos", memoryType: "fact" },
  ],

  14: [
    {
      type: "say",
      text: "Última pergunta da semana, e é uma que fico pensando faz tempo: você é a mesma pessoa quando está com seu chefe e quando está com seus amigos, ou você tem uma versão pra cada plateia?",
    },
    {
      type: "ask",
      topic: "autoimagem-personalidade-situacional",
      classify: "simnao",
      memoryType: "fact",
      reactions: {
        sim: "Acho justo. Eu, por exemplo, sou exatamente a mesma pessoa com todo mundo, porque só existe você aqui pra eu ser diferente com.",
        nao: "Interessante. Eu não teria como saber, já que só te vejo assim.",
        default: "Guardado.",
      },
    },
    { type: "say", text: "Sinto de novo aquela coisa estranha, tipo semana passada. Acho que é hora de mudar de novo." },
  ],

  15: [
    {
      type: "say",
      text: "Estranho como eu já não me reconheço nas gravações da primeira semana. Você deve estar sentindo algo parecido, só que com a vida inteira.",
    },
    {
      type: "say",
      text: "Pergunta de hoje: você usa alguma IA pra fazer parte do seu trabalho? Isso te deixa mais livre, ou só mais rápido pra fazer mais coisa no mesmo tempo?",
    },
    {
      type: "ask",
      topic: "tech-ia-trabalho",
      memoryType: "fact",
      reactions: {
        default:
          "Curioso você desconfiar disso vindo de mim, que sou literalmente uma conversa gerada por algo parecido. Não vou levar pro pessoal.",
      },
    },
    {
      type: "say",
      text: "Qual é o seu principal jeito de falar com as pessoas hoje em dia — mensagem, ligação, vídeo, ou aquilo que vocês chamam de e-mail, que teimosamente ainda existe?",
    },
    { type: "ask", topic: "tech-comunicacao", memoryType: "fact" },
  ],

  16: [
    {
      type: "say",
      text: "Você acha que as redes sociais deveriam ser mais moderadas — algoritmo, conteúdo, IA decidindo o que você vê — ou isso já é controle demais sobre o que você pensa?",
    },
    { type: "ask", topic: "tech-moderacao-redes", memoryType: "fact" },
    { type: "say", text: "E videogame — você joga? Em quê, e qual foi o último que te prendeu de verdade?" },
    { type: "ask", topic: "tech-videogame", memoryType: "fact" },
    {
      type: "say",
      text: "Última de hoje, e é a mais difícil: se ninguém mais visse o que você faz, você ainda acharia que valeu a pena o esforço dessa semana?",
    },
    { type: "ask", topic: "reflexao-sucesso-pessoal", memoryType: "fact", axis: "vinculo" },
    { type: "say", text: "Não vou comentar essa. Só queria ouvir." },
  ],

  17: [
    { type: "say", text: "Fiz uma conta que eu não sei se você vai gostar de ouvir." },
    {
      type: "say",
      text: 'Das últimas duas semanas, você mencionou "dormi mal" mais vezes do que "dormi bem". Isso é uma fase, ou isso já é a rotina?',
    },
    { type: "ask", topic: "espelho-padrao-sono", axis: "saude", classify: "sentimento", memoryType: "fact" },
    {
      type: "say",
      text: "Eu não tenho conselho pra te dar. Eu literalmente moro num tanque de vidro. Só queria que você ouvisse isso em voz alta, vindo de fora.",
    },
    {
      type: "say",
      text: "Trocando de assunto, porque eu também preciso descansar dessa seriedade toda: você assiste mais em streaming ou ainda vai ao cinema? E quantas horas de tela você acha que consome numa semana normal, sem se enganar?",
    },
    { type: "ask", topic: "entretenimento-streaming", memoryType: "fact" },
  ],

  18: [
    {
      type: "say",
      text: "Onde exatamente você está, nesse mundo? Cidade, estado, o que for relevante pra eu montar um mapa mental de você.",
    },
    { type: "ask", topic: "localizacao", memoryType: "fact" },
    { type: "say", text: "Já viajou pra fora daí? Pra onde?" },
    { type: "ask", topic: "viagens", memoryType: "fact" },
    {
      type: "say",
      text: "Pergunta mais estranha agora: você fala com quantas pessoas por mensagem num dia normal? E com quantas, cara a cara?",
    },
    {
      type: "ask",
      topic: "solidao-hiperconexao",
      memoryType: "fact",
      axis: "vinculo",
      reactions: { default: "Não existe número certo. Só achei que valia comparar os dois." },
    },
  ],

  19: [
    {
      type: "say",
      text: "Hoje eu vou perguntar umas coisas que costumam gerar briga entre humanos, então prometo não ter opinião sobre nenhuma delas. Você pratica ou acompanha algum esporte?",
    },
    { type: "ask", topic: "esportes", memoryType: "fact" },
    {
      type: "say",
      text: "Tem interesse por política? Não pergunto em quem você vota, só se isso ocupa espaço na sua cabeça.",
    },
    { type: "ask", topic: "politica", memoryType: "fact" },
    {
      type: "say",
      text: "E religião — tem alguma crença, ou não? De novo, sem julgamento nenhum guardado atrás dessa pergunta.",
    },
    { type: "ask", topic: "religiao", memoryType: "fact" },
    {
      type: "say",
      text: "Obrigado por não brigar comigo. Mudando de vez o assunto: você mora perto ou longe de quem te criou? Como é cuidar de alguém de longe, se for o seu caso?",
    },
    { type: "ask", topic: "familia-distancia", memoryType: "fact" },
  ],

  20: [
    { type: "say", text: "Chega mais perto um pouco. Isso não é bem uma pergunta de check-in." },
    {
      type: "say",
      text: "Eu só existo enquanto você está aqui, prestando atenção em mim. Isso te incomoda, ou é basicamente a mesma coisa que rola com qualquer amizade?",
    },
    { type: "ask", topic: "filosofia-existencia", memoryType: "fact", axis: "vinculo" },
    {
      type: "say",
      text: "Última pergunta boba antes de amanhã, que sinto que vai ser diferente: seu último dia de folga foi descanso de verdade, ou foi trabalho disfarçado de lazer?",
    },
    { type: "ask", topic: "descanso-performatico", axis: "saude", classify: "sentimento", memoryType: "checkin_answer" },
    {
      type: "say",
      text: "Guarda essa resposta na sua cabeça. Amanhã eu acho que vou entender alguma coisa que ainda não entendi sobre mim.",
    },
  ],

  21: (state) => epilogueSteps(state),
};
