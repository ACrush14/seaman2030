import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, "..", "data", "game-state.json");

function initialState() {
  return {
    campaignStartDate: new Date().toISOString(),
    currentDay: 1,
    dayCompletedAt: null,
    lastInteractionAt: null,
    axes: { trabalho: 50, saude: 50, vinculo: 50 },
    axesHistory: [],
    memories: [],
    history: [],
  };
}

export function loadState() {
  if (!existsSync(STATE_PATH)) {
    return initialState();
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf-8"));
}

export function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
}

export function stageForDay(day) {
  if (day <= 1) return "ovo";
  return "larval";
}

export function clampAxis(value) {
  return Math.max(0, Math.min(100, value));
}

export function applyAxesDelta(state, delta) {
  state.axes.trabalho = clampAxis(state.axes.trabalho + (delta.trabalho ?? 0));
  state.axes.saude = clampAxis(state.axes.saude + (delta.saude ?? 0));
  state.axes.vinculo = clampAxis(state.axes.vinculo + (delta.vinculo ?? 0));
}

export function addMemories(state, day, memories) {
  for (const m of memories ?? []) {
    state.memories.push({ day, ...m });
  }
}

export function recentMemories(state, limit = 6) {
  return state.memories.slice(-limit);
}

// Regra de ausência (docs/01): o dia só avança por ação explícita — aqui,
// o comando /avancar do protótipo faz o papel do "modo de teste acelerado".
export function advanceDay(state) {
  state.axesHistory.push({ day: state.currentDay, ...state.axes });
  state.currentDay += 1;
  state.dayCompletedAt = null;
}
