# ÉPICO 8 — Página de Resultado (Score Cards, Gráficos e Oferta)

**Depende de:** Épico 6 e Épico 7 concluídos (resultado só é exibido depois da submissão do lead)

## Objetivo

Tela final que mostra o resultado calculado no Épico 6 e a oferta comercial personalizada.

## Escopo

- Rota `/resultado`, recebendo o resultado já calculado (via resposta da API/Server Action, nunca recalculado no client).
- Score card principal (score geral + badge de classificação, tipografia mono).
- Radar chart (Recharts) por categoria, com nota textual discreta sobre a natureza indicativa do gráfico (seções 4.2/7 da especificação de avaliação).
- Bloco de oferta condicional à classificação, a partir de `content/offers.ts`.
- Acesso direto à rota sem ter passado pelo fluxo não pode exibir dados fictícios nem quebrar a página.

## Critérios de aceite

- Dado um resultado com classificação "Alto", quando a página carrega, então o bloco de oferta exibido é o de mentoria (seção 7 do prompt de construção).
- Dado que acesso `/resultado` diretamente pela URL, sem ter completado o quiz, quando a página carrega, então sou redirecionado para `/` (não vejo um resultado vazio ou quebrado).
- Dado qualquer texto de score/classificação sobre fundo escuro, quando comparo com WCAG AA, então o contraste está correto (reforça o Épico 2).

## Testes obrigatórios

- Teste E2E do fluxo completo, do zero: Landing → Quiz (14 perguntas) → Lead → Resultado, verificando que o score exibido bate com as respostas dadas.
- Teste de acesso direto a `/resultado` sem sessão válida → confirma redirecionamento.
- Teste axe-core na página de resultado, sem violações de contraste.

## Gate — não avance para o Épico 9 até que:

- [ ] Teste E2E ponta a ponta (Landing → Quiz → Lead → Resultado) passa com pelo menos os 3 cenários de classificação.
- [ ] Acesso direto a `/resultado` sem completar o fluxo redireciona corretamente.
- [ ] Nenhuma violação de contraste no axe-core.

## Boas práticas aplicadas

Resultado tratado como dado vindo do servidor, nunca recalculado no client; fallback explícito para acesso indevido à rota; gráfico com legenda/texto alternativo acessível, não dependente só de cor.
