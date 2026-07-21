# 09 — Direção de Arte

Volta para [PLANNING.md](../PLANNING.md). Storyboard das cutscenes em [03-storyboard-cutscenes.md](03-storyboard-cutscenes.md).

## 1. Pilares visuais

- **Simples de produzir:** dado que é um projeto solo, o visual precisa ser factível sem equipe de arte — poucas poses, pouca geometria, foco de investimento no personagem, não no ambiente.
- **Atualizado, não redesenhado do zero:** a ideia central do visual original (rosto humano realista sobre corpo de peixe) é o que faz o conceito funcionar e **deve ser preservado como referência conceitual** — mas o design específico (modelo 3D, texturas, proporções exatas) precisa ser **nosso próprio**, não uma cópia do personagem de Vivarium/SEGA. Tratar como "mesma ideia, execução própria", nunca como referência de decalque.
- **Grotesco continua sendo o ponto forte** (ver [PLANNING.md](../PLANNING.md#1-o-que-fazia-o-seaman-original-especial-e-por-que-está-datado)) — não suavizar o estranhamento inicial só porque o visual é simples.

## 2. Nível de fidelidade por fase

| Fase | Visual necessário |
|---|---|
| Fase 1 (texto) | Nenhum — só texto |
| Fase 2 (voz) | Nenhum ou um placeholder estático (uma imagem 2D fixa) só pra dar contexto durante o teste de voz |
| Fase 3 (vertical slice) | Modelo 3D simples do estágio Larval (poucos polígonos, sem animação facial complexa — ver seção 4) |
| Fase 4–5 (campanha completa) | Modelos dos 3 estágios + as transições + os 4 finais |

## 3. Ambiente (decisão: simplificar drasticamente)

Como o MVP **não inclui a simulação de aquário** (temperatura/oxigênio/alimentação — decisão já registrada em [PLANNING.md](../PLANNING.md#3-escopo-do-mvp)), o ambiente visual também deve ser simplificado:

- **Cena fixa, câmera fixa:** o jogador sempre vê o bicho da mesma posição, como uma "chamada de vídeo" com ele — sem navegação livre pela cena.
- **Fundo ambiente, não interativo:** água, luz, bolhas como pano de fundo atmosférico (reforça a identidade visual), mas **sem nenhum controle de jogador sobre o ambiente** — é cenografia, não mecânica.
- Isso reduz drasticamente o escopo de produção comparado ao aquário simulado do original, e mantém o foco de desenvolvimento onde ele importa: no personagem e na conversa.

## 4. O personagem

- **Poses/estados necessários (mínimo viável):** repouso/ouvindo, falando, reação positiva, reação neutra, reação de preocupação/tristeza. Cinco estados cobrem toda a gama emocional necessária sem exigir animação facial completa.
- **Sem números na UI:** consistente com a diretriz de não expor os eixos de cuidado como régua (já definida em [01-narrative-design.md](01-narrative-design.md#2-os-três-eixos-de-cuidado)) — o estado do bicho se comunica só por postura/cor/expressão, nunca por barra de progresso ou porcentagem.
- **Silhueta e proporção mudam por estágio** (Larval → Juvenil → Quase-adulto → Final), mas de forma sutil — ver descrição das transições em [03-storyboard-cutscenes.md](03-storyboard-cutscenes.md), que já cobre isso quadro a quadro.

## 5. Paleta de cores

| Contexto | Direção de cor |
|---|---|
| Estágio Larval | Tons frios, pouco saturados — criatura ainda "formando-se" |
| Estágio Juvenil | Levemente mais quente, mais definição de cor na pele/escamas |
| Estágio Quase-adulto | Cores mais estáveis e "resolvidas", postura mais ereta |
| Final Florescimento | Quente, luminoso, alta saturação |
| Final Equilíbrio | Neutro, equilibrado, sem extremos |
| Final Alerta | Frio, dessaturado, água ligeiramente turva |
| Final Reencontro (secreto) | Como Equilíbrio + um elemento visual fora do lugar (gancho de continuidade) |

(Tabela consolidada a partir de [03-storyboard-cutscenes.md](03-storyboard-cutscenes.md#cena-5--finais-dia-21).)

## 6. UI/UX (wireframe conceitual)

- **Tela principal:** o bicho em destaque (60–70% da tela), campo de texto/microfone na parte inferior (texto sempre visível, nunca escondido atrás da opção de voz — diretriz de acessibilidade já registrada em [04-arquitetura-tecnica.md](04-arquitetura-tecnica.md#6-voz)).
- **Indicador de dia/ato:** discreto, textual ("Semana 2, Dia 3" ou similar), sem números de eixo.
- **Notificação push:** ícone/preview curto no estilo "[Nome do bicho] quer te perguntar uma coisa", nunca revelando o conteúdo da pergunta na notificação (preserva a espontaneidade da conversa).
- **Tela de epílogo (Dia 21):** texto não-numérico resumindo a jornada, conforme já definido em [03-storyboard-cutscenes.md](03-storyboard-cutscenes.md#tela-de-epílogo-todos-os-finais).

## 7. Ferramentas de produção sugeridas

- Modelagem/animação simples: qualquer ferramenta compatível com import Unity (Blender é gratuito e suficiente para a fidelidade proposta).
- Protótipo de UI: pode ser feito direto no Unity UI Toolkit/uGUI sem precisar de ferramenta de design externa, dado o minimalismo da interface.
