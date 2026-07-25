import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  loadState,
  saveState,
  stageForDay,
  applyAxesDelta,
  addMemories,
  advanceDay,
} from "../prototype-fase1/src/state.js";
import { requestTurn } from "../prototype-fase1/src/claude.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

function statusPayload(state) {
  return {
    currentDay: state.currentDay,
    stage: stageForDay(state.currentDay),
    axes: state.axes,
    memoriesCount: state.memories.length,
  };
}

app.get("/api/status", (req, res) => {
  const state = loadState();
  res.json(statusPayload(state));
});

app.post("/api/turn", async (req, res) => {
  const userText = typeof req.body.text === "string" ? req.body.text : null;
  const state = loadState();
  const startedAt = Date.now();
  try {
    const result = await requestTurn(state, userText);
    applyAxesDelta(state, result.axes_delta);
    addMemories(state, state.currentDay, result.new_memories);
    state.lastInteractionAt = new Date().toISOString();
    if (!state.dayCompletedAt) state.dayCompletedAt = state.lastInteractionAt;
    saveState(state);
    res.json({
      reply: result.reply,
      latencyMs: Date.now() - startedAt,
      ...statusPayload(state),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/advance", (req, res) => {
  const state = loadState();
  advanceDay(state);
  saveState(state);
  res.json(statusPayload(state));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Seaman2030 — protótipo de voz rodando em http://localhost:${PORT}`);
});
