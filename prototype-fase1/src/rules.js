// Regras compartilhadas entre o motor (engine.js) e o roteiro (script.js) —
// em módulo separado pra evitar import circular entre os dois.

export function countFlags(state, topic, fromDay, toDay) {
  return state.memories.filter(
    (m) => m.type === "flag" && m.topic === topic && m.day >= fromDay && m.day <= toDay
  ).length;
}

// Cálculo do final (docs/01#4-finais e docs/04#4-cálculo-de-estágio-e-final):
// média dos eixos ao longo de toda a jornada, não só o valor do último dia.
export function computeEnding(state) {
  const history = [...state.axesHistory, { day: state.currentDay, ...state.axes }];
  const avg = (key) => history.reduce((sum, h) => sum + h[key], 0) / history.length;
  const avgTrabalho = avg("trabalho");
  const avgSaude = avg("saude");
  const avgVinculo = avg("vinculo");

  if (avgVinculo > 85) return "reencontro";
  if (avgTrabalho < 30 || avgSaude < 30) return "alerta";
  if (avgTrabalho > 70 && avgSaude > 70) return "florescimento";
  return "equilibrio";
}
