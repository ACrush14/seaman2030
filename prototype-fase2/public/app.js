const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");
const textForm = document.getElementById("textForm");
const textInput = document.getElementById("textInput");
const talkButton = document.getElementById("talkButton");
const latencyEl = document.getElementById("latency");
const advanceButton = document.getElementById("advanceButton");

function renderStatus(s) {
  statusEl.textContent = `Dia ${s.currentDay} — estágio ${s.stage} | trabalho=${s.axes.trabalho} saude=${s.axes.saude} vinculo=${s.axes.vinculo} | memórias: ${s.memoriesCount}`;
}

function appendTurn(who, text) {
  const div = document.createElement("div");
  div.className = who === "user" ? "turn-user" : "turn-bicho";
  div.textContent = (who === "user" ? "Você: " : "Bicho: ") + text;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

// Rota A do pipeline de voz (docs/12): TTS sintético do navegador + pitch/rate
// alterados, sem clonagem — mais barato de prototipar.
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const ptVoice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt"));
  if (ptVoice) utterance.voice = ptVoice;
  utterance.pitch = 0.6; // timbre mais grave/estranho
  utterance.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

async function sendTurn(text) {
  appendTurn("user", text);
  const startedAt = performance.now();
  const resp = await fetch("/api/turn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await resp.json();
  if (data.error) {
    appendTurn("bicho", `[erro: ${data.error}]`);
    return;
  }
  const roundTripMs = Math.round(performance.now() - startedAt);
  appendTurn("bicho", data.reply);
  speak(data.reply);
  latencyEl.textContent = `motor local: ${data.latencyMs}ms | ida-e-volta total (rede local): ${roundTripMs}ms`;
  renderStatus(data);
  if (data.dayEnded) appendTurn("bicho", "(fim do roteiro de hoje — use \"Avançar dia\")");
}

textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text) return;
  textInput.value = "";
  sendTurn(text);
});

advanceButton.addEventListener("click", async () => {
  const resp = await fetch("/api/advance", { method: "POST" });
  const data = await resp.json();
  renderStatus(data);
  appendTurn("bicho", "(dia avançado — modo de teste acelerado)");
  for (const line of data.openingLines ?? []) appendTurn("bicho", line);
});

// --- Reconhecimento de voz (push-to-talk) ---
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognitionImpl) {
  recognition = new SpeechRecognitionImpl();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendTurn(transcript);
  };

  recognition.onerror = (event) => {
    appendTurn("bicho", `[erro de reconhecimento de voz: ${event.error} — use o campo de texto]`);
  };

  talkButton.addEventListener("mousedown", () => {
    talkButton.classList.add("recording");
    recognition.start();
  });
  talkButton.addEventListener("mouseup", () => {
    talkButton.classList.remove("recording");
  });
} else {
  talkButton.disabled = true;
  talkButton.textContent = "Voz não suportada neste navegador — use o texto";
}

// Carrega o status inicial e mostra a fala de abertura do dia (sem falar em voz alta —
// navegadores bloqueiam áudio automático sem gesto do usuário).
(async function init() {
  const resp = await fetch("/api/status");
  const data = await resp.json();
  renderStatus(data);
  for (const line of data.openingLines ?? []) appendTurn("bicho", line);
})();
