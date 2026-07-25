# Protótipo Fase 2 — Voz (STT/TTS via navegador)

Implementa a Fase 2 do [roadmap](../docs/05-roadmap-producao.md): adicionar voz a um protótipo desktop/web simples e medir latência. Desde a última versão, **não depende mais de API nenhuma** — reaproveita o motor roteirizado do [prototype-fase1](../prototype-fase1/) (ver o porquê no [README de lá](../prototype-fase1/README.md#por-que-sem-api)), só troca o transporte: em vez de terminal, um servidor Express + página web com reconhecimento de voz e síntese de fala nativos do navegador.

## Como rodar

```bash
cd prototype-fase2
npm install
npm start
```

Não precisa de `.env`, não precisa de chave de API. Abra `http://localhost:3000` no **Chrome ou Edge** (Web Speech API não tem suporte confiável no Firefox/Safari).

## Como usar

- **Segurar o botão "🎙️ Segurar para falar"** enquanto fala, soltar quando terminar — reconhecimento por push-to-talk.
- O campo de texto **sempre funciona** também — fallback de acessibilidade obrigatório já definido no plano.
- A resposta do bicho aparece em texto **e** é falada em voz alta (timbre alterado: pitch mais grave, ritmo levemente mais lento).
- "Avançar dia" continua sendo o modo de teste acelerado, igual à Fase 1.
- O texto abaixo do botão de voz mostra a latência **local** (motor + rede local) — como não há mais chamada de rede externa, isso costuma ficar na casa de poucos milissegundos, o que já demonstra que a meta de latência de [docs/12](../docs/12-pipeline-de-voz.md#5-latência-e-custo) deixa de ser um problema nesta versão. A pergunta que sobra não é mais "isso responde rápido o suficiente?", e sim "o roteiro fixo continua interessante depois de algumas repetições?".

## O que este protótipo NÃO faz (de propósito)

- Não clona sua voz (isso é a Rota B do pipeline de voz, decisão adiada).
- Não tem detecção automática de fim de fala (push-to-talk é suficiente pro protótipo).
- Não tem visual do personagem — isso é Fase 3.
- Não gera diálogo dinâmico — segue o roteiro fixo de [docs/14](../docs/14-roteiro-ato1-completo.md), igual ao [prototype-fase1](../prototype-fase1/).
