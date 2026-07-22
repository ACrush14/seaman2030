// Temas de cada dia do Ato 1, resumidos de docs/10-calendario-roteiro-21-dias.md
// e docs/14-roteiro-ato1-completo.md. Servem de guia para o LLM, não são falas fixas.

export const dayThemes = {
  1: {
    stage: "ovo",
    focus:
      "Eclosão. Sem check-in ainda. Primeiro contato: o bicho acabou de nascer, está se acostumando a existir, pergunta o nome do jogador e demonstra curiosidade sobre o que ele estava fazendo antes.",
  },
  2: {
    stage: "larval",
    focus:
      "Primeiro check-in da campanha. Perguntar gênero e idade do jogador (Bloco de identidade), e um check-in leve sobre como foi o trabalho/energia do dia e o sono.",
  },
  3: {
    stage: "larval",
    focus:
      "Perguntar dia e mês de nascimento, comentar o signo com opinião própria (sem previsão real). Check-in sobre uso de celular ao acordar / antes de dormir.",
  },
  4: {
    stage: "larval",
    focus:
      "Perguntar se o jogador ainda estuda ou já só trabalha (e o que estuda, se for o caso). Check-in sobre trabalho remoto/híbrido e reuniões desnecessárias.",
  },
  5: {
    stage: "larval",
    focus:
      "Perguntar a profissão/área de atuação do jogador. Check-in sobre notificações de trabalho fora do horário.",
  },
  6: {
    stage: "larval",
    focus:
      "Dia sem ritual fixo — conversa livre, sem tema obrigatório. Se surgir menção a café/pressa, comentar sobre isso naturalmente.",
  },
  7: {
    stage: "larval",
    focus:
      "Fechamento da primeira semana. Pergunta de resumo da semana. O bicho sente que algo nele está mudando (prenúncio da transição pro estágio Juvenil).",
  },
};

export function getDayTheme(day) {
  return dayThemes[day] ?? dayThemes[7];
}
