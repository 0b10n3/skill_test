# ÉPICO 13 — QA de Regressão, Telemetria de Itens e Go-Live da v2

**Depende de:** Épicos 10–12 concluídos.

## Objetivo

Validar a versão 2 (banco novo + diagnóstico + relatório) de ponta a ponta com o mesmo rigor do Épico 9, ativar a telemetria que alimenta o ciclo de qualidade do instrumento e concluir o go-live — incluindo a limpeza dos arquivos de especificação da raiz do repositório.

## Escopo

- Re-executar integralmente o checklist do Épico 9 sobre a v2: Lighthouse nas 4 rotas públicas (`/`, `/quiz`, `/lead`, `/resultado`), auditoria de acessibilidade (axe-core + teclado + leitor de tela em `/resultado`, a rota mais alterada), cross-device (375/768/1440px), revisão de variáveis de ambiente na Vercel.
- **Telemetria de itens** (`AVALIACAO.md` §6): garantir que cada submissão registre, por item, o id e a alternativa escolhida (persistência criada no Épico 11) e criar um script/consulta de análise (`scripts/item-stats`) que produza, por item e por nível: taxa de acerto e distribuição por alternativa — base para as futuras revisões psicométricas. Nenhum dashboard é necessário neste épico; o script com saída em tabela/CSV basta.
- Atualizar `GOLIVE.md`/README: nova estrutura de dados do banco de questões, matriz de pesos, matriz editorial e o processo de revisão periódica de itens (quando rodar `item-stats`, quais limiares disparam revisão — conforme `AVALIACAO.md` §6).
- Verificar MailerLite em produção: campos/grupos necessários para os novos dados do diagnóstico (classificação, prioridade #1) para segmentação das ofertas por nível × classificação.
- **Limpeza final:** após todos os gates verdes e deploy em produção, remover da raiz do repositório os arquivos de especificação `AVALIACAO.md`*, `QUESTIONS.json` (a cópia da raiz — o banco canônico já vive no diretório de dados desde o Épico 10), `REPORT.md` e os arquivos `epico-10` a `epico-13`. *Antes de remover, incorporar ao repositório o que é referência viva: a seção de metodologia citada no rodapé do relatório (S8) e o processo de revisão de itens devem estar copiados para `docs/metodologia.md` — o commit de limpeza só acontece depois dessa incorporação.

## Critérios de aceite

- Dado o app v2 em produção, quando rodo Lighthouse em qualquer rota pública, então Performance/Acessibilidade/Boas práticas/SEO ≥ 90.
- Dado o fluxo completo executado manualmente em mobile real para uma persona de cada nível (5 execuções), quando concluído, então o relatório correto do nível é exibido e o lead chega ao MailerLite com os campos de segmentação preenchidos.
- Dado um conjunto de submissões de teste em preview, quando rodo `item-stats`, então obtenho taxa de acerto e distribuição por alternativa por item, por nível.
- Dado o commit de limpeza, quando inspeciono a raiz do repositório, então os arquivos de spec não existem mais e `docs/metodologia.md` contém a metodologia de referência.

## Testes obrigatórios

- Suíte completa (unit + componente + E2E) de TODOS os épicos (1–12) rodando verde em CI contra preview — não apenas os testes da v2.
- Lighthouse (CI ou execução manual documentada) para as 4 rotas públicas.
- Teste E2E verificando o payload completo enviado ao MailerLite (com mocks em CI; verificação manual em produção).

## Gate — critério de Go-Live da v2

- [ ] Todos os gates dos Épicos 1–12 seguem válidos (sem regressão).
- [ ] Lighthouse ≥ 90 nas 4 categorias, nas 4 rotas públicas.
- [ ] Zero violações críticas de acessibilidade (axe-core), incluindo `/resultado`.
- [ ] Fluxo completo validado manualmente em mobile real para os 5 níveis.
- [ ] Telemetria de itens ativa e `item-stats` funcional.
- [ ] MailerLite de produção com campos/grupos da segmentação v2.
- [ ] `docs/metodologia.md` criado e arquivos de spec removidos da raiz (último commit do épico).

## Boas práticas aplicadas

Go-live não é o fim do instrumento, é o início do seu ciclo de qualidade: a telemetria e o processo documentado de revisão de itens garantem que o banco de questões melhore com dados reais (dificuldade, discriminação, distratores mortos), em vez de permanecer congelado no lançamento; e specs temporárias saem do repositório apenas depois que seu conteúdo permanente foi incorporado à documentação viva.
