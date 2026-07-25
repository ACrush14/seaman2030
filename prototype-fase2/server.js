import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadState, saveState, stageForDay, advanceDay } from "../prototype-fase1/src/state.js";
import { advance, isDayComplete } from "../prototype-fase1/src/engine.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

function statusPayload(state, extra = {}) {
  return {
    currentDay: state.currentDay,
    stage: stageForDay(state.currentDay),
    axes: state.axes,
    memoriesCount: state.memories.length,
    ...extra,
  };
}

// Se o dia ainda não começou (estado recém-criado ou logo após /avancar),
// já puxa as falas de abertura pra devolver junto do status.
function maybeOpeningLines(state) {
  if (state.stepIndex === 0 && !state.waitingTopic) {
    const { lines } = advance(state, null);
    saveState(state);
    return lines;
  }
  return [];
}

app.get("/api/status", (req, res) => {
  const state = loadState();
  const openingLines = maybeOpeningLines(state);
  res.json(statusPayload(state, { openingLines }));
});

app.post("/api/turn", (req, res) => {
  const userText = typeof req.body.text === "string" ? req.body.text : "";
  const state = loadState();

  if (isDayComplete(state)) {
    return res.json(statusPayload(state, { reply: "(o roteiro de hoje já acabou — use /avancar)", latencyMs: 0 }));
  }

  try {
    const startedAt = Date.now();
    const { lines, dayEnded } = advance(state, userText);
    const latencyMs = Date.now() - startedAt;

    state.lastInteractionAt = new Date().toISOString();
    saveState(state);

    res.json(statusPayload(state, { reply: lines.join(" "), latencyMs, dayEnded }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/advance", (req, res) => {
  const state = loadState();
  advanceDay(state);
  const openingLines = maybeOpeningLines(state);
  saveState(state);
  res.json(statusPayload(state, { openingLines }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seaman2030 — protótipo de voz rodando em http://localhost:${PORT} (sem API, roteiro local)`);
});
