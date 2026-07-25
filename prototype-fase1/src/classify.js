// Classificação simples por palavra-chave — sem IA, sem API.
// Mesma filosofia do Seaman original (ver docs/00-pesquisa-referencia.md):
// reconhecimento de algumas palavras-chave, não compreensão real da frase.

export function classifySimNao(text) {
  const t = (text || "").toLowerCase();
  if (/\bn[aã]o\b|nunca|jamais/.test(t)) return "nao";
  if (/\bsim\b|claro|sempre|às vezes|as vezes|com certeza|óbvio|obvio|com certeza/.test(t)) return "sim";
  return "default";
}

export function classifyIdade(text) {
  const match = (text || "").match(/\d{1,3}/);
  if (!match) return "default";
  const idade = parseInt(match[0], 10);
  if (idade > 0 && idade < 30) return "jovem";
  if (idade >= 30) return "adulto";
  return "default";
}

const AREA_TECNICA = [
  "tecnologia",
  "programa",
  "desenvolv",
  " dev",
  "ti ",
  "software",
  "dados",
  "engenh",
  "sistema",
  "código",
  "codigo",
];

export function classifyArea(text) {
  const t = ` ${(text || "").toLowerCase()} `;
  if (AREA_TECNICA.some((k) => t.includes(k))) return "tecnica";
  return "generica";
}

const NEGATIVO = [
  "cansad",
  "exaust",
  " mal",
  "ruim",
  "estressa",
  "péssimo",
  "pessimo",
  "não dormi",
  "nao dormi",
  "difícil",
  "dificil",
  "horrível",
  "horrivel",
];

const POSITIVO = [
  " bem",
  "ótimo",
  "otimo",
  "tranquil",
  "descansad",
  "dormi bem",
  "tudo certo",
  "de boa",
];

export function classifySentimento(text) {
  const t = ` ${(text || "").toLowerCase()} `;
  if (NEGATIVO.some((k) => t.includes(k))) return "negativo";
  if (POSITIVO.some((k) => t.includes(k))) return "positivo";
  return "neutro";
}

export function classify(type, text) {
  switch (type) {
    case "simnao":
      return classifySimNao(text);
    case "idade":
      return classifyIdade(text);
    case "area":
      return classifyArea(text);
    case "sentimento":
      return classifySentimento(text);
    default:
      return "default";
  }
}
