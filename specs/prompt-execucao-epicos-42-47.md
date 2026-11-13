# Prompt de execução — Épicos 42 a 47 (revisão de UI/UX, conversão e medição)

> Cole este prompt numa sessão do Claude Code aberta em `apps/skill_test/`.

## 0. Papel

Você é o engenheiro e designer de produto responsável por executar a revisão de novembro de 2026
do **Syntaxis Skill Check**. O produto e as mudanças já estão especificados. Sua função é
executar com fidelidade, épico por épico, e provar cada etapa com teste e captura de tela antes
de avançar.

Trabalhe como um designer de UI/UX sênior que também escreve o código: cada tela precisa
funcionar no celular e no desktop, nos dois temas, dentro da marca Syntaxis, com o botão
principal sempre óbvio.

## 1. Leia antes de escrever código, nesta ordem

1. `CLAUDE.MD` — regras do repositório (um épico por vez, relatório, gate).
2. `specs/epicos/revisao-2026-11-ui-ux.md` — os achados e o plano.
3. `DESIGN.md` — manual de marca v4.1. Atenção a §3 (voz), §4 (paleta, tipografia, geometria,
   anti-padrões), §5.1 (imagem), §6 (padrões), §8 (acessibilidade) e §11 (checklist).
4. `docs/design-system.md` e `app/dev/ui/page.tsx` — os componentes que já existem.
5. O arquivo do épico da vez em `specs/epicos/`. Só o da vez; os outros, quando chegar a hora.

Se `../../brand/APLICACAO.md` e `../../strategy/` existirem em disco, leia `APLICACAO.md` §1–1.2
(padrões H e C citados nos épicos), `strategy/FUNIL.md` e `strategy/AUDIENCES.md`. São só para
leitura: ficam em outros repositórios git.

Depois de ler, responda com um resumo curto do que entendeu e da ordem dos épicos, e aponte
qualquer contradição entre a especificação e o código. Só então comece.

## 2. Ordem

| Ordem | Arquivo | Branch |
| --- | --- | --- |
| 1 | `epico-42-medicao-ga4-pixel.md` | `epico-42-medicao-ga4-pixel` |
| 2 | `epico-43-relatorio-hierarquia-e-ponte.md` | `epico-43-relatorio-hierarquia-e-ponte` |
| 3 | `epico-44-pagina-newsletter.md` | `epico-44-pagina-newsletter` |
| 4 | `epico-45-chassi-do-funil.md` | `epico-45-chassi-do-funil` |
| 5 | `epico-46-landing-conversao.md` | `epico-46-landing-conversao` |
| 6 | `epico-47-qa-golive.md` | `epico-47-qa-golive` |

Um branch e um Pull Request por épico, nunca commit direto em `main`. Conventional Commits. A
descrição do PR traz o checklist do gate já marcado e as capturas de antes e depois.

Ao terminar um épico, rode os testes obrigatórios, avalie o gate item por item, entregue o
relatório no formato do `CLAUDE.MD` §5 e **espere a confirmação** antes do próximo.

## 3. Antes do Épico 42: linha de base

Em `main`, sem alterar nada:

1. Rode `npm run prebuild`, `npm run lint`, `npm run typecheck`, `npm test` e
   `MAILERLITE_API_KEY=e2e-invalid npm run test:e2e`. Anote o que já falha: é dívida anterior,
   não regressão sua.
2. Capture o funil inteiro (`/`, `/quiz` na senioridade e na `q27`, `/lead` vazio e com erros,
   `/resultado` com nota baixa e com nota alta) em 375×667 e 1440×900, claro e escuro. São as
   imagens de "antes" dos PRs.
3. Rode o Lighthouse do fluxo e anote LCP e CLS da landing.

## 4. Regras que atravessam todos os épicos

**Segurança e dados**

- **Toda execução local que envia o formulário usa `MAILERLITE_API_KEY=e2e-invalid` no
  comando.** A `.env.local` tem a chave real; a variável do shell vence a do arquivo, e a falha
  do MailerLite não bloqueia o fluxo. Sem isso você grava leads de teste na conta de produção.
- **MailerLite é intocável:** `lib/mailerlite.ts`, `app/api/submit`, `app/api/resend-report`,
  `leadSchema` e o texto do opt-in não mudam em nenhum épico.
- **GA4 e Meta Pixel só mudam no Épico 42**, como especificado. Nos demais, os componentes só
  chamam `track()`.
- Nunca dispare evento real para GA4 ou Meta a partir de teste: a verificação com IDs reais do
  Épico 42 aborta as requisições antes de saírem.
- O gabarito nunca vai ao cliente; a nota é sempre calculada no servidor; nenhuma resposta em
  `localStorage` ou `sessionStorage`.
- `content/questions.json` e `lib/diagnostico/` não mudam. Problema de conteúdo se relata, não
  se corrige.
- Nenhum parâmetro de evento e nenhuma URL carrega nome ou e-mail.

**Marca**

- `DESIGN.md` e `design/tokens.json` são cópias verificadas da marca: **não edite**. Se uma
  mudança parecer exigir token novo, pare e pergunte.
- Só cores de token; Montserrat, Source Sans 3 e IBM Plex Mono; radius 0–2 px; nenhuma sombra;
  gradiente só na camada de ambiente; um pattern por bloco; Truchet nunca atrás de texto.
- Lime é o acento de ação e conquista. Não crie ocorrência nova além das que o épico nomeia.
- Texto sempre sobre fundo sólido de token. Tema claro e escuro em tudo que entrar.
- Nada de bio, retrato, depoimento, número de assinantes ou estatística inventados. Onde falta
  dado real, o bloco não aparece.
- Reaproveite os componentes de `components/ui`, `components/patterns` e `components/landing`
  antes de criar outro. Nenhuma dependência nova.

**Copy**

- Voz de marca (`DESIGN.md` §3): "você", sem emoji, sem promessa de salário ou promoção, sem
  urgência falsa, sem contagem regressiva.
- Toda copy em `content/`; componente só seleciona.
- A copy dos épicos é a aprovada para implementar. Se precisar ajustar uma frase para caber,
  mantenha o sentido e liste a mudança no relatório. Não escreva afirmação nova sobre o produto,
  a newsletter ou o mercado.

**Interface**

- Projete primeiro para 375×667; depois 768 e 1440. Confira também 360×640 e 390×844.
- Texto de leitura a partir de 14 px no celular; 12 px só em rótulo, eyebrow, legenda e nota
  legal. Alvos de toque de 44 px nas ações principais.
- Um botão principal por tela, visível sem rolar onde o épico exige.
- Sem rolagem horizontal em nenhuma largura. Nada atrás do cabeçalho fixo.
- Acessibilidade: AA mais SC 2.4.13 (`DESIGN.md` §8). axe limpo em toda rota nova ou alterada.

## 5. Como provar cada épico

1. Testes obrigatórios do arquivo do épico.
2. `npm run prebuild && npm run lint && npm run typecheck && npm run format:check && npm test`.
3. `MAILERLITE_API_KEY=e2e-invalid npm run test:e2e`. Snapshot visual só é atualizado depois de
   você abrir o diff e confirmar que a mudança é a esperada; diga no relatório quais mudaram e
   por quê.
4. `npm run build`.
5. Capturas de "depois" nas mesmas telas e tamanhos da linha de base, **abertas e olhadas por
   você**: confira hierarquia, alinhamento, espaçamento, quebra de linha e contraste. Um teste
   verde não prova que a tela está boa.

## 6. Onde você para e pede uma pessoa

Não simule, não assuma, não marque como feito sem resposta:

- **Épico 42:** variáveis na Vercel; Testar eventos do Meta; DebugView do GA4; eventos-chave;
  Pixel e GA4 nas configurações do Substack.
- **Épico 44:** aprovação da copy de `content/newsletter.ts`; confirmação da curadoria de posts
  por dimensão; bio e foto de quem escreve (sem elas, o bloco fica desligado e o épico segue).
- **Épico 47:** conferência em produção, inscrição de teste no Substack, aparelho real, leitor
  de tela.

Diga exatamente o que a pessoa precisa fazer e o que você precisa receber de volta.

## 7. Ambiguidade

- Detalhe de implementação pequeno e reversível: decida pelo que o épico e a marca indicam,
  registre no relatório e siga.
- Regra de negócio, copy com afirmação nova, token de marca, qualquer coisa que toque MailerLite
  ou que mude o que é enviado a GA4 e Meta além do Épico 42: **pare e pergunte**.
- Se uma tarefa do épico não se sustentar diante do código (por exemplo, a linha de base de
  contagem do Épico 42 não mostrar duplicidade), não force a mudança: relate a evidência e siga
  a regra de decisão do próprio épico.

## 8. Comece

Leia os arquivos da seção 1, entregue o resumo de alinhamento e espere a confirmação. Depois,
faça a linha de base da seção 3 e comece o Épico 42.
