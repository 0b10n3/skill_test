# ÉPICO 33 — `check-brand-sync.mjs`: o gate que o Épico 24 já citava, mas nunca existiu

**Depende de:** Épico 24 (sincronização com `brand/DESIGN.md` v3.0). Independente da rodada 4
do `/marca-zero` (`Syntaxis/brand/revisao-2026/`, amplitude estreita) — este épico fecha uma
dívida que já era anterior a ela.

**Origem:** o próprio `epico-24-sincronizacao-marca-v3.md` (linha 9) já citava
`check-brand-sync.mjs` como se existisse: *"check-brand-sync.mjs reprovaria hoje se brand/
estivesse acessível no build (hoje só avisa e sai verde, porque o script sai verde quando
brand/ não está no disco do ambiente de build da Vercel)"*. Busca no histórico de git dos dois
repositórios (`apps/skill_test` e o monorepo raiz) confirma: **o script nunca foi escrito**.
`brand/CHECKLIST-PR.md`, `PROJECT_MAP.md` e mais três documentos do monorepo citavam o nome
como se fosse um gate real.

## Objetivo

Escrever o gate que faltava, com o contrato exato que a Fase 4 do prompt mestre de marca já
havia especificado: compara `DESIGN.md` e `design/tokens.json` deste app contra
`brand/DESIGN.md` e `brand/tokens/syntaxis.tokens.json` do monorepo; sai verde sem comparar
nada quando `brand/` não está em disco (build de produção na Vercel, que clona só este
repositório); reprova com diagnóstico (primeira linha divergente) quando os dois estão
presentes e diferem.

## Escopo

- `scripts/check-brand-sync.mjs` — segue a convenção de `check-tokens-breaking.mjs`
  (`__dirname`-relative, sem dependência nova, `console.error`/`console.log` + `process.exitCode`,
  nunca `process.exit(1)` direto em erro para não perder o log).
- `__tests__/check-brand-sync.test.ts` — mesmo padrão de `check-tokens-breaking.test.ts`:
  `execFileSync` do script real, não uma reimplementação.
- Entrada nova em `package.json`: `"check:brand-sync"`, inserida em `prebuild` logo depois de
  `check:tokens-breaking`.
- Trazer `DESIGN.md` e `design/tokens.json` para o estado atual de `brand/` (v3.1 / tokens
  v2.7.0 — rodada 4 do `/marca-zero`, amplitude estreita: só `$description` de token e prosa de
  `DESIGN.md`, nenhum `$value` mudou) — pré-requisito para o gate nascer verde.
- Rodar `npm run format` nos dois arquivos recém-copiados e propagar a formatação de volta para
  `brand/` no monorepo — mesma lição do achado 5 do Épico 24: Prettier muda largura de coluna
  de tabela markdown mesmo com conteúdo idêntico, e "cópia byte a byte" precisa sobreviver a
  isso nos dois lados.

**Fora de escopo, deliberadamente:**

- Qualquer mudança de `$value` de token, cor, tipografia ou geometria — a rodada 4 do
  `/marca-zero` que motivou esta sincronização não tocou nenhum invariante.
- Rodar o gate em CI/Vercel de fato comparando contra `brand/` — arquitetonicamente impossível
  enquanto os dois repositórios forem clonados separadamente. Se um dia isso mudar (monorepo
  único, ou `brand/` publicado como pacote), o contrato de soft-pass deste script muda junto.

## Critérios de aceite

- `node scripts/check-brand-sync.mjs`, rodado com o monorepo presente em `../../brand`, sai 0 e
  reporta os dois arquivos idênticos.
- O mesmo script, rodado sem `../../brand` em disco, sai 0 com aviso — nunca falha por ausência
  do monorepo.
- `npm run check:tokens-breaking` continua verde depois da sincronização (nenhum `$value` novo
  fora da allowlist já existente).
- `npm test`, `npm run typecheck` limpos.

## Achados durante a implementação

1. **A "cópia byte a byte" tem uma dependência escondida em Prettier.** Copiar
   `brand/DESIGN.md` cru para cá e rodar `npm run format` mudou a largura das colunas de duas
   tabelas markdown (histórico de versões, regras binárias de camada) — conteúdo idêntico,
   forma diferente. Resolvido copiando o resultado formatado de volta para `brand/DESIGN.md` no
   monorepo, na mesma sessão — sem isso, este gate nasceria vermelho no primeiro `npm run
   format` de rotina.
2. **`design/tokens.json` não precisou de reformatação** — já estava na forma que o Prettier
   deste app produz, apesar de ter sido editado diretamente no monorepo (edições cirúrgicas de
   `$description`, sem reindentação).
