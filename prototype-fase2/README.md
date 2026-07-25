# Protótipo Fase 2 — Voz (STT/TTS via navegador)

Implementa a Fase 2 do [roadmap](../docs/05-roadmap-producao.md): adicionar voz a um protótipo desktop/web simples, medir latência, e validar a Rota A (TTS sintético processado) do [pipeline de voz](../docs/12-pipeline-de-voz.md) antes de investir em clonagem de voz (Rota B).

Reaproveita a lógica de jogo (estado, prompt, chamada à API) do [prototype-fase1](../prototype-fase1/), só troca o transporte: em vez de terminal, um servidor Express + página web com reconhecimento de voz e síntese de fala nativos do navegador.

## Por que Web Speech API em vez de um provedor de voz pago

Zero custo, zero setup de conta, roda no Chrome/Edge sem nenhuma chave extra — perfeito para validar **latência** e **se o timbre alterado (pitch/rate) já soa "personagem" o suficiente** antes de decidir se vale a pena investir em clonagem de voz (ver [docs/12](../docs/12-pipeline-de-voz.md#3-saída-de-voz-tts--as-duas-rotas-possíveis)). Se o resultado soar bom demais "genérico", isso já é um dado real para decidir ir pra Rota B depois.

## Como rodar

```bash
cd prototype-fase2
npm install
```

Reaproveita o mesmo `ANTHROPIC_API_KEY` do protótipo da Fase 1 — copie o `.env` de lá ou crie um novo aqui com o mesmo conteúdo (ver [prototype-fase1/.env.example](../prototype-fase1/.env.example)).

```bash
npm start
```

Abra `http://localhost:3000` no **Chrome ou Edge** (Web Speech API não tem suporte confiável no Firefox/Safari).

## Como usar

- **Segurar o botão "🎙️ Segurar para falar"** enquanto fala, soltar quando terminar — é reconhecimento por push-to-talk, mais simples e confiável que detecção automática de silêncio (ver [docs/12](../docs/12-pipeline-de-voz.md#1-entrada-de-voz-stt--fala-do-jogador-virando-texto)).
- O campo de texto **sempre funciona** também — é o fallback de acessibilidade obrigatório já definido no plano.
- A resposta do bicho aparece em texto **e** é falada em voz alta (timbre alterado: pitch mais grave, ritmo levemente mais lento).
- "Avançar dia" continua sendo o modo de teste acelerado, igual à Fase 1.
- O texto abaixo do botão de voz mostra a **latência medida** — o objetivo é observar se o ciclo fica abaixo de ~2–3s, conforme a meta definida em [docs/12](../docs/12-pipeline-de-voz.md#5-latência-e-custo).

## O que este protótipo NÃO faz (de propósito)

- Não clona sua voz (isso é a Rota B, decisão a tomar depois de ouvir a Rota A funcionando).
- Não tem detecção automática de fim de fala (push-to-talk é suficiente pro protótipo).
- Não tem visual do personagem — isso é Fase 3.
