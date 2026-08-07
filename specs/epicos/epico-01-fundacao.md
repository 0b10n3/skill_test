# ÉPICO 1 — Fundação do Projeto: Repositório, Scaffold e Pipeline de Deploy

**Depende de:** nada (ponto de partida)
**Entrada:** `prompt-syntaxis-skill-check.md` (seções 2 e 9)

## Objetivo

Ter um projeto Next.js rodando localmente e em produção, hospedado no GitHub, com CI mínimo — antes de qualquer feature de produto ser construída.

## Escopo

- Criar repositório no GitHub (sugestão: `syntaxis-skill-check`), branch `main` protegida (PR obrigatório + status checks antes de merge).
- Scaffold Next.js 15 (App Router) + TypeScript estrito + Tailwind CSS v4 + ESLint + Prettier.
- GitHub Actions: workflow que roda lint, typecheck (`tsc --noEmit`) e testes em todo PR.
- Conectar o repositório à Vercel (preview deployment automático por PR, deploy de produção a partir de `main`).
- `.env.example` documentando todas as variáveis previstas nos próximos épicos (incluindo `MAILERLITE_API_KEY`, mesmo vazia por ora).
- `README.md` inicial: setup local, scripts disponíveis, link do deploy.

## Fora de escopo

Qualquer componente visual, tokens de marca ou lógica de negócio — isso começa no Épico 2.

## Critérios de aceite

- Dado o repositório clonado localmente, quando rodo `npm install && npm run dev`, então a aplicação sobe sem erros em `localhost`.
- Dado um PR aberto contra `main`, quando o workflow de CI roda, então lint + typecheck + testes executam automaticamente e bloqueiam o merge se falharem.
- Dado um push para `main`, quando o deploy da Vercel roda, então a URL de produção fica publicamente acessível.

## Testes obrigatórios

- Smoke test: `npm run build` completa sem erros.
- CI: workflow do GitHub Actions passa verde em um PR de teste.
- Deploy: preview URL da Vercel abre e mostra a página padrão do Next.js sem erro 500.

## Gate — não avance para o Épico 2 até que:

- [ ] Repositório no GitHub existe, com `main` protegida (PR obrigatório).
- [ ] `npm run build` roda sem erros localmente e no CI.
- [ ] Deploy de produção na Vercel está acessível via URL pública.
- [ ] `.env.example` existe e documenta todas as variáveis previstas.

## Boas práticas aplicadas

Conventional Commits; branch protection; CI antes de qualquer merge; segredos nunca commitados (`.env.local` no `.gitignore`); preview deployments por PR para revisão visual antes de merge.
