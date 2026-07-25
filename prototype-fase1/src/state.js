import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = join(__dirname, "..", "data", "game-state.json");

function initialState() {
  return {
    campaignStartDate: new Date().toISOString(),
    currentDay: 1,
    stepIndex: 0,
    waitingTopic: null,
    dayCompletedAt: null,
    lastInteractionAt: null,
    axes: { trabalho: 50, saude: 50, vinculo: 50 },
    axesHistory: [],
    memories: [],
    labels: {},
    turningPointTriggered: false,
    ending: null,
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

// Ver docs/01-narrative-design.md#3-estágios-de-evolução-ligados-aos-dias-da-campanha
export function stageForDay(day) {
  if (day <= 1) return "ovo";
  if (day <= 7) return "larval";
  if (day <= 14) return "juvenil";
  if (day <= 20) return "quase-adulto";
  return "final";
}

export function clampAxis(value) {
  return Math.max(0, Math.min(100, value));
}

// Regra de ausência (docs/01): o dia só avança por ação explícita — aqui,
// o comando /avancar do protótipo faz o papel do "modo de teste acelerado".
export function advanceDay(state) {
  state.axesHistory.push({ day: state.currentDay, ...state.axes });
  state.currentDay += 1;
  state.stepIndex = 0;
  state.waitingTopic = null;
  state.dayCompletedAt = null;
}
