# ÉPICO 4 — Landing Page ("Hello")

**Depende de:** Épico 2 (design system) concluído
**Entrada:** `prompt-syntaxis-skill-check.md` (seção 4.1)

## Objetivo

Primeira tela pública do produto — headline, proposta de valor e CTA único para iniciar o quiz.

## Escopo

- Rota `/` com headline, sub-texto (tempo estimado, nº de perguntas, formato), CTA único "Iniciar avaliação".
- Metadata de SEO/OG via `generateMetadata` (title, description, imagem OG com a identidade "Sinal no Escuro").
- Responsivo mobile-first, respeitando a regra de single-viewport (sem scroll vertical).

## Critérios de aceite

- Dado que acesso `/` em um viewport mobile (375px), quando a página carrega, então todo o conteúdo cabe sem scroll vertical.
- Dado que clico em "Iniciar avaliação", quando navego, então sou levado para `/quiz` com a pergunta de senioridade (`q00`) já carregada.

## Testes obrigatórios

- Teste E2E (Playwright): carregar `/`, clicar no CTA, confirmar navegação para `/quiz`.
- Lighthouse contra `/` em build de produção: Performance, Acessibilidade e SEO ≥ 90.

## Gate — não avance para o Épico 5 até que:

- [ ] Lighthouse ≥ 90 em Performance, Acessibilidade e SEO para `/`.
- [ ] Teste E2E do fluxo Landing → CTA → Quiz passa.
- [ ] Nenhum scroll vertical necessário em viewport de 375×667px.

## Boas práticas aplicadas

Server Component por padrão (sem JS client-side desnecessário na landing); `next/image` para qualquer imagem; metadata gerada via API do Next.js, não hardcoded em cada página.
