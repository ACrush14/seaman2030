import readline from "readline";
import { loadState, saveState, stageForDay, applyAxesDelta, addMemories, advanceDay } from "./state.js";
import { requestTurn } from "./claude.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function printStatus(state) {
  console.log(
    `\n[Dia ${state.currentDay} — estágio ${stageForDay(state.currentDay)} | eixos: trabalho=${state.axes.trabalho} saude=${state.axes.saude} vinculo=${state.axes.vinculo} | memórias: ${state.memories.length}]\n`
  );
}

async function handleTurn(state, userText) {
  const result = await requestTurn(state, userText);
  console.log(`\nBicho: ${result.reply}\n`);
  applyAxesDelta(state, result.axes_delta);
  addMemories(state, state.currentDay, result.new_memories);
  state.lastInteractionAt = new Date().toISOString();
  if (!state.dayCompletedAt) state.dayCompletedAt = state.lastInteractionAt;
  saveState(state);
}

async function main() {
  console.log("=== Seaman2030 — Protótipo de Texto (Fase 1, Ato 1) ===");
  console.log("Comandos: /status  /avancar  /sair\n");

  const state = loadState();
  printStatus(state);

  if (state.history.length === 0) {
    console.log("(o bicho está falando pela primeira vez...)");
    await handleTurn(state, null);
  }

  while (true) {
    const input = (await ask("Você: ")).trim();

    if (input === "/sair") {
      saveState(state);
      console.log("Estado salvo. Até mais.");
      break;
    }

    if (input === "/status") {
      printStatus(state);
      continue;
    }

    if (input === "/avancar") {
      advanceDay(state);
      saveState(state);
      console.log(`\n(dia avançado — agora é o dia ${state.currentDay})`);
      await handleTurn(state, null);
      continue;
    }

    if (input.length === 0) continue;

    try {
      await handleTurn(state, input);
    } catch (err) {
      console.error("Erro ao falar com a API:", err.message);
    }
  }

  rl.close();
}

main();
