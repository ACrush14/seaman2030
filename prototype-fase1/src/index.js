import readline from "readline";
import { loadState, saveState, stageForDay, advanceDay } from "./state.js";
import { advance, isDayComplete } from "./engine.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function printStatus(state) {
  console.log(
    `\n[Dia ${state.currentDay} — estágio ${stageForDay(state.currentDay)} | eixos: trabalho=${state.axes.trabalho} saude=${state.axes.saude} vinculo=${state.axes.vinculo} | memórias: ${state.memories.length}]\n`
  );
}

function printLines(lines) {
  for (const line of lines) {
    console.log(`\nBicho: ${line}`);
  }
  console.log();
}

function runStep(state, userText) {
  const startedAt = Date.now();
  const { lines, dayEnded } = advance(state, userText);
  const elapsedMs = Date.now() - startedAt;
  printLines(lines);
  console.log(`(respondido em ${elapsedMs}ms — roteiro local, sem API)`);
  if (dayEnded) console.log("(fim do dia — use /avancar pra continuar)");
  saveState(state);
}

async function main() {
  console.log("=== Seaman2030 — Protótipo de Roteiro (Fase 1, Ato 1) ===");
  console.log("Roda 100% local, sem chave de API — respostas roteirizadas, como o Seaman original.");
  console.log("Comandos: /status  /avancar  /sair\n");

  const state = loadState();
  printStatus(state);

  if (state.stepIndex === 0 && !state.waitingTopic) {
    runStep(state, null);
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
      runStep(state, null);
      continue;
    }

    if (input.length === 0) continue;

    if (isDayComplete(state)) {
      console.log("\n(o roteiro de hoje já acabou — use /avancar pra ir pro próximo dia)\n");
      continue;
    }

    runStep(state, input);
  }

  rl.close();
}

main();
