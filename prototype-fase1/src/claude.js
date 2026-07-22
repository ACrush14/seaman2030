import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "./prompt.js";

const client = new Anthropic();
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-8";

const SEAMAN_TURN_TOOL = {
  name: "seaman_turn",
  description:
    "Gera a fala do bicho para o jogador e extrai dados estruturados da troca (eixos de cuidado e memórias novas).",
  input_schema: {
    type: "object",
    properties: {
      reply: {
        type: "string",
        description: "A fala do bicho nesta rodada, em português, seguindo o guia de voz.",
      },
      axes_delta: {
        type: "object",
        description: "Variação nos eixos de cuidado provocada por esta troca (pode ser 0 nos três).",
        properties: {
          trabalho: { type: "integer", description: "Delta de -10 a +10." },
          saude: { type: "integer", description: "Delta de -10 a +10." },
          vinculo: { type: "integer", description: "Delta de -10 a +10." },
        },
        required: ["trabalho", "saude", "vinculo"],
      },
      new_memories: {
        type: "array",
        description: "Fatos novos e concretos que o jogador revelou nesta troca, se houver.",
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["fact", "checkin_answer", "flag"] },
            topic: { type: "string", description: "Categoria curta, ex: 'trabalho-horario', 'identidade-nome'." },
            summary: { type: "string", description: "Resumo curto do fato, em poucas palavras." },
          },
          required: ["type", "topic", "summary"],
        },
      },
    },
    required: ["reply", "axes_delta", "new_memories"],
  },
};

// Converte o histórico salvo (turnos em texto puro) no formato da API.
function toApiMessages(history, userText) {
  const messages = history.map((turn) => ({ role: turn.role, content: turn.content }));
  if (userText !== null) {
    messages.push({ role: "user", content: userText });
  }
  return messages;
}

// userText === null é usado só para a primeira fala do dia (o bicho abre a conversa).
export async function requestTurn(state, userText) {
  const system = buildSystemPrompt(state);
  const messages = toApiMessages(
    state.history,
    userText === null ? "(o jogador acabou de abrir o app — inicie a conversa de hoje)" : userText
  );

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages,
    tools: [SEAMAN_TURN_TOOL],
    tool_choice: { type: "tool", name: "seaman_turn" },
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse) {
    throw new Error("A API não retornou uma chamada de ferramenta — resposta inesperada.");
  }

  const result = toolUse.input;

  // Guarda o turno em texto puro simples para o histórico (não os blocos de tool_use).
  if (userText !== null) {
    state.history.push({ role: "user", content: userText });
  }
  state.history.push({ role: "assistant", content: result.reply });

  return result;
}
