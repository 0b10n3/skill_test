# Syntaxis Skill Check

[![CI](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml/badge.svg)](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml)

Quiz adaptativo de diagnóstico de conhecimento técnico em finanças/matemática financeira, com seleção de perguntas por senioridade, scoring no servidor e captura de lead via MailerLite.

Especificação completa do produto em [`/specs`](./specs).

## Stack

- Next.js 15 (App Router) + TypeScript estrito
- Tailwind CSS v4
- ESLint + Prettier
- Vitest + Testing Library
- Deploy: Vercel (preview por PR, produção a partir de `main`)

## Setup local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha as variáveis necessárias (ver seção abaixo).

## Scripts disponíveis

| Script                 | Descrição                                |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento (Turbopack)  |
| `npm run build`        | Build de produção                        |
| `npm run start`        | Roda o build de produção localmente      |
| `npm run lint`         | ESLint                                   |
| `npm run typecheck`    | `tsc --noEmit`                           |
| `npm run format`       | Formata o código com Prettier            |
| `npm run format:check` | Verifica formatação sem alterar arquivos |
| `npm run test`         | Suíte de testes (Vitest)                 |

## Variáveis de ambiente

Ver [`.env.example`](./.env.example) para a lista completa e documentada. Nenhuma chave sensível é commitada — `.env.local` está no `.gitignore`.

## Deploy

- Preview: gerado automaticamente pela Vercel a cada Pull Request.
- Produção: https://skill-test-mocha.vercel.app/

## Fluxo de contribuição

- Um branch e um Pull Request por épico (ver `/specs/epicos`), nunca commit direto em `main`.
- `main` é protegida: PR obrigatório + CI (lint, format, typecheck, testes, build) verde antes de merge.
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
