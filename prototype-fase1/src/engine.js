import { script } from "./script.js";
import { classify, classifySentimento } from "./classify.js";
import { clampAxis } from "./state.js";

function daySteps(state) {
  return script[state.currentDay] ?? [];
}

export function isDayComplete(state) {
  return !state.waitingTopic && (state.stepIndex ?? 0) >= daySteps(state).length;
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
  const steps = daySteps(state);
  const lines = [];
  let i = state.stepIndex ?? 0;

  if (steps.length === 0) {
    return {
      lines: ["Isso é tudo que o Ato 1 tem por enquanto — os próximos atos ainda não foram implementados neste protótipo."],
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
      const reaction = askStep.reactions && (askStep.reactions[label] ?? askStep.reactions.default);
      if (reaction) lines.push(reaction);
    }

    if (askStep.axis) {
      const sentimento = askStep.classify === "sentimento" ? label : classifySentimento(answer);
      const delta = sentimento === "negativo" ? -2 : sentimento === "positivo" ? 2 : 0;
      if (delta !== 0) {
        state.axes[askStep.axis] = clampAxis(state.axes[askStep.axis] + delta);
      }
    }
    state.axes.vinculo = clampAxis(state.axes.vinculo + 1);

    state.waitingTopic = null;
    i += 1;
  }

  while (i < steps.length) {
    const step = steps[i];
    if (!stepConditionMet(state, step)) {
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
  if (!state.dayCompletedAt) state.dayCompletedAt = new Date().toISOString();
  return { lines, waitingFor: null, dayEnded: true };
}
