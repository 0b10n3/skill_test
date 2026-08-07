# ÉPICO 9 — QA Final, Acessibilidade, Performance e Go-Live

**Depende de:** Épicos 1–8 concluídos

## Objetivo

Última validação de ponta a ponta antes de considerar o produto pronto para tráfego real.

## Escopo

- Auditoria completa de Lighthouse em todas as rotas públicas (`/`, `/quiz`, `/lead`, `/resultado`).
- Auditoria de acessibilidade completa: axe-core + navegação manual por teclado + leitor de tela em pelo menos uma rota crítica.
- Teste cross-device: mobile (375px), tablet (768px), desktop (1440px).
- Revisão de variáveis de ambiente em produção na Vercel (todas presentes; nenhuma exposta incorretamente ao client).
- Revisão final do `README.md`: instruções de deploy, variáveis de ambiente e setup do MailerLite (grupos e campos).

## Critérios de aceite

- Dado o app em produção, quando rodo Lighthouse em qualquer rota pública, então Performance/Acessibilidade/Boas práticas/SEO ≥ 90.
- Dado o fluxo completo (Landing → Quiz → Lead → Resultado) executado manualmente em mobile real, quando concluído, então nenhuma tela quebra o single-viewport definido no design system.

## Testes obrigatórios

- Suíte completa de testes E2E (cobrindo todos os épicos anteriores) rodando verde em CI contra o ambiente de preview.
- Lighthouse (CI ou execução manual documentada) para as 4 rotas públicas.

## Gate — critério de Go-Live (produto pronto para tráfego real)

- [ ] Todos os gates dos Épicos 1–8 seguem válidos (sem regressão).
- [ ] Lighthouse ≥ 90 nas 4 categorias, nas 4 rotas públicas.
- [ ] Zero violações críticas de acessibilidade (axe-core).
- [ ] Fluxo completo validado manualmente em pelo menos 1 dispositivo mobile real.
- [ ] MailerLite configurado em produção (grupos e campos reais, não os de teste do Épico 7).

## Boas práticas aplicadas

Checklist de go-live documentado no repositório (`GOLIVE.md` ou seção do README), não apenas de conhecimento tácito de quem construiu; nenhuma regressão nos gates anteriores é aceitável só porque "já passou uma vez" — a suíte de testes de todos os épicos deve rodar de novo, não só a do épico atual.
