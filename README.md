# Syntaxis Skill Check

[![CI](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml/badge.svg)](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml)

Quiz adaptativo de diagnóstico de conhecimento técnico em finanças/matemática financeira, com seleção de perguntas por senioridade, scoring no servidor e captura de lead via MailerLite.

Especificação completa do produto em [`/specs`](./specs).

## Stack

- Next.js 15 (App Router) + TypeScript estrito
- Tailwind CSS v4 + shadcn/ui (`@base-ui/react`)
- Zod (validação client + server)
- MailerLite (`@mailerlite/mailerlite-nodejs`, captura de lead)
- ESLint + Prettier
- Vitest + Testing Library (unitário/integração) + Playwright + axe-core (E2E, acessibilidade, visual)
- Deploy: Vercel (preview por PR, produção a partir de `main`)

## Setup local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha as variáveis necessárias (ver seção abaixo).

## Scripts disponíveis

| Script                              | Descrição                                                         |
| ----------------------------------- | ----------------------------------------------------------------- |
| `npm run dev`                       | Servidor de desenvolvimento (Turbopack)                           |
| `npm run build`                     | Build de produção                                                 |
| `npm run start`                     | Roda o build de produção localmente                               |
| `npm run lint`                      | ESLint                                                            |
| `npm run typecheck`                 | `tsc --noEmit`                                                    |
| `npm run format`                    | Formata o código com Prettier                                     |
| `npm run format:check`              | Verifica formatação sem alterar arquivos                          |
| `npm run test`                      | Suíte de testes unitários/integração (Vitest)                     |
| `npm run test:e2e`                  | Suíte E2E (Playwright) contra um build de produção                |
| `npm run test:e2e:update-snapshots` | Regenera os snapshots visuais do Playwright                       |
| `npm run test:lighthouse`           | Auditoria Lighthouse (Performance/A11y/SEO) contra `/`            |
| `npm run generate:tokens`           | Gera `app/tokens.generated.css` a partir de `content/tokens.json` |

## Variáveis de ambiente

Ver [`.env.example`](./.env.example) para a lista completa e documentada. Nenhuma chave sensível é commitada — `.env.local` está no `.gitignore`.

## Setup do MailerLite

A captura de lead (rota `/lead`) sincroniza cada submissão com uma conta MailerLite via API. Antes de rodar qualquer teste de integração real (ou de configurar `MAILERLITE_API_KEY` em produção), é preciso preparar a conta no painel:

1. **Gerar a API key**: painel MailerLite → _Integrations_ → _MailerLite API_ → gerar uma chave. Colar em `MAILERLITE_API_KEY` (`.env.local` local, e nas variáveis de ambiente do projeto na Vercel para produção). Essa chave é usada **somente em código server-side** — nunca em componente client, nunca em variável `NEXT_PUBLIC_*`.
2. **Criar (ou reaproveitar) um Grupo** para onde todos os leads do quiz vão — na conta em uso, esse grupo é o `SYNTAXIS_SKILL_APP`. Colar o **ID numérico** do grupo em `MAILERLITE_GROUP_ID` (`.env.local`). O ID aparece na URL do grupo no painel (`.../groups/<ID>`) ou via `GET /api/groups` com a API key.
   - A classificação final (`baixo`/`medio`/`alto`), a senioridade e o score **não** segmentam por grupo — ficam gravados como Campos customizados no próprio subscriber (item 3).
3. **Criar os Campos customizados** (painel → _Subscribers_ → _Custom fields_, ou via `POST /fields`) com exatamente estas chaves (o código em `lib/mailerlite.ts` envia esses nomes):
   - `seniority` (texto) — a senioridade declarada em q00
   - `score_geral` (número) — percentual geral do quiz
   - `classificacao` (texto) — `baixo` / `medio` / `alto`
   - `perfil_tecnico` (texto) — `profileTag` da pergunta de autoavaliação

Sem o grupo/campos criados, o `POST /subscribers` ainda funciona (grupo/campos ausentes são apenas ignorados pela API), mas o subscriber não fica no lugar certo — **confirme que o grupo e os 4 campos existem antes de considerar a integração validada**.

A chamada à MailerLite é sempre **não-bloqueante**: se falhar (rede, credencial inválida, etc.), o erro é logado no servidor e o resultado do quiz é exibido normalmente ao usuário.

## Deploy

- Preview: gerado automaticamente pela Vercel a cada Pull Request.
- Produção: https://skill-test-mocha.vercel.app/

## Fluxo de contribuição

- Um branch e um Pull Request por épico (ver `/specs/epicos`), nunca commit direto em `main`.
- `main` é protegida: PR obrigatório + CI (lint, format, typecheck, testes, build) verde antes de merge.
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
