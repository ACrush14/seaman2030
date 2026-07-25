import { script } from "./script.js";
import { classify, classifySentimento } from "./classify.js";
import { clampAxis } from "./state.js";
import { computeEnding } from "./rules.js";

const AXIS_DELTA = 6; // magnitude do ajuste de eixo por resposta classificada
const VINCULO_PRESENCA = 1; // bônus único por dia concluído (consistência)

function resolveDaySteps(state) {
  const raw = script[state.currentDay];
  if (typeof raw === "function") return raw(state) ?? [];
  return raw ?? [];
}

export function isDayComplete(state) {
  return !state.waitingTopic && (state.stepIndex ?? 0) >= resolveDaySteps(state).length;
}

function stepConditionMet(state, step) {
  if (!step.when) return true;
  return state.labels[step.when.topic] === step.when.label;
}

/**
 * Avança o roteiro do dia atual.
 * userText === null é usado só pra puxar as falas de abertura do dia
 * (não deve ser chamado com null enquanto o bicho espera uma resposta).
 * Retorna { lines, waitingFor, dayEnded }.
 */
export function advance(state, userText) {
  const steps = resolveDaySteps(state);
  const lines = [];
  let i = state.stepIndex ?? 0;

  if (steps.length === 0) {
    return {
      lines: ["Isso é tudo que o roteiro tem por enquanto neste dia — conteúdo ainda não implementado."],
      waitingFor: null,
      dayEnded: true,
    };
  }

  if (state.waitingTopic) {
    const askStep = steps[i];
    const answer = (userText || "").trim();

    state.memories.push({
      day: state.currentDay,
      type: askStep.memoryType || "checkin_answer",
      topic: askStep.topic,
      summary: answer.slice(0, 160),
    });

    let label = "default";
    if (askStep.classify) {
      label = classify(askStep.classify, answer);
      state.labels[askStep.topic] = label;
    }
    if (askStep.reactions) {
      const reaction = askStep.reactions[label] ?? askStep.reactions.default;
      if (reaction) lines.push(reaction);
    }

    if (askStep.axis) {
      let delta;
      if (askStep.axisDeltaByLabel && label in askStep.axisDeltaByLabel) {
        // Pergunta sim/não onde o rótulo em si (não o texto) define se é bom ou ruim
        // pro eixo (ex.: responder mensagem de trabalho às 23h = "sim" é o sinal ruim).
        delta = askStep.axisDeltaByLabel[label];
      } else {
        const sentimento = askStep.classify === "sentimento" ? label : classifySentimento(answer);
        delta = sentimento === "negativo" ? -AXIS_DELTA : sentimento === "positivo" ? AXIS_DELTA : 0;
      }
      if (delta) {
        state.axes[askStep.axis] = clampAxis(state.axes[askStep.axis] + delta);
      }
    }

    // Sinaliza padrões de alerta (ex.: trabalho excessivo) pra alimentar o
    // Evento de Virada — ver docs/01#5-evento-de-virada.
    if (askStep.flagTopic && label === (askStep.flagWhen ?? "negativo")) {
      state.memories.push({ day: state.currentDay, type: "flag", topic: askStep.flagTopic, summary: answer.slice(0, 160) });
    }

    state.waitingTopic = null;
    i += 1;
  }

  while (i < steps.length) {
    const step = steps[i];
    if (!stepConditionMet(state, step)) {
      i += 1;
      continue;
    }
    if (step.type === "trigger") {
      state[step.set] = true;
      i += 1;
      continue;
    }
    if (step.type === "say") {
      lines.push(step.text);
      i += 1;
      continue;
    }
    if (step.type === "ask") {
      state.stepIndex = i;
      state.waitingTopic = step.topic;
      return { lines, waitingFor: step.topic, dayEnded: false };
    }
    i += 1;
  }

  state.stepIndex = i;
  state.waitingTopic = null;
  if (!state.dayCompletedAt) {
    state.dayCompletedAt = new Date().toISOString();
    state.axes.vinculo = clampAxis(state.axes.vinculo + VINCULO_PRESENCA);
  }
  if (state.currentDay === 21 && !state.ending) {
    state.ending = computeEnding(state);
  }
  return { lines, waitingFor: null, dayEnded: true };
}
