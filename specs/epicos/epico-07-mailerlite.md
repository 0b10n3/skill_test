# ÉPICO 7 — Captura de Lead e Integração MailerLite

**Depende de:** Épico 6 (API de submissão) concluído
**Referência técnica:** https://developers.mailerlite.com/ (Subscribers, Fields, Groups)

## Objetivo

Capturar nome, e-mail e opt-in, e sincronizar o lead com o MailerLite antes de liberar o resultado ao usuário.

## Contexto técnico da API (confirmado na documentação oficial)

- Base URL: `https://connect.mailerlite.com/api`.
- Autenticação: header `Authorization: Bearer <API_KEY>` (gerado no painel MailerLite em Integrations → MailerLite API).
- `POST /subscribers` cria ou atualiza (upsert) um subscriber por e-mail — operação não-destrutiva: campos/grupos omitidos não são removidos de quem já existe.
- Corpo aceita `email`, `fields` (objeto — chaves precisam corresponder a campos padrão ou customizados já existentes na conta), `groups` (array de IDs de grupos já existentes).
- Campos customizados são criados previamente via `POST /fields` (ou manualmente no painel) — não são criados "on the fly" ao enviar o subscriber.
- Rate limit geral: 120 requisições/minuto; endpoints de import têm limite separado de 5/minuto (não se aplica aqui, já que é upsert unitário, não import em lote).
- Existe SDK oficial em Node.js (`mailerlite-nodejs`) — preferir o SDK a `fetch` manual.

## Escopo

- Rota `/lead` com formulário (nome, e-mail, opt-in obrigatório, cargo/senioridade já pré-preenchido a partir da resposta de `q00`), validado com Zod no client e revalidado no servidor.
- **Setup prévio no painel MailerLite** (fora do código-fonte, documentar passo a passo no `README.md`):
  - Criar os Grupos que representam a classificação final: `Baixo`, `Médio`, `Alto`.
  - Criar os Campos customizados: `seniority`, `score_geral`, `classificacao`, `perfil_tecnico` (via painel ou via `POST /fields`, tipo `text`/`number` conforme o dado).
- `lib/mailerlite.ts`, usando o SDK oficial, chamando `subscribers.createOrUpdate()` (ou equivalente) com `email`, `fields` (nome, senioridade, score, classificação, tag de perfil técnico) e `groups` (o grupo correspondente à classificação calculada no Épico 6).
- Variável de ambiente `MAILERLITE_API_KEY`, usada apenas em Route Handler — nunca exposta ao client.
- Falha no envio ao MailerLite **não pode bloquear** a exibição do resultado ao usuário — logar o erro no servidor e prosseguir (requisito já definido no prompt de construção original).
- Conformidade com os Termos da MailerLite: como o lead é coletado via formulário próprio (não um formulário nativo da MailerLite), a aplicação é responsável por só inscrever quem marcou o opt-in explícito — nada de opt-in pré-marcado.

## Critérios de aceite

- Dado que preencho o formulário com e-mail válido e opt-in marcado, quando submeto, então um subscriber é criado (ou atualizado) na conta MailerLite real, no grupo correspondente à minha classificação.
- Dado que a chamada à API do MailerLite falha (ex: erro de rede simulado), quando submeto o formulário, então ainda assim sou redirecionado para `/resultado` com o score correto — o erro é apenas logado no servidor.
- Dado que não marco o checkbox de opt-in, quando tento submeter, então o formulário não avança e exibe erro de validação.

## Testes obrigatórios

- Teste de integração contra um workspace de teste do MailerLite (ou mock do SDK, se preferir não depender de dados reais em CI): confirmar que o payload enviado tem o formato esperado (`email`, `fields`, `groups`).
- Teste simulando falha da chamada ao MailerLite (mock retornando erro) e confirmando que o fluxo do usuário não é interrompido.
- Teste de validação: submissão sem opt-in é bloqueada tanto no client quanto revalidada no servidor.

## Gate — não avance para o Épico 8 até que:

- [ ] Um subscriber de teste real aparece no painel MailerLite após uma submissão de ponta a ponta, no grupo correto.
- [ ] Falha simulada na chamada ao MailerLite não impede a navegação para `/resultado`.
- [ ] `MAILERLITE_API_KEY` não aparece em nenhum bundle client (verificar no código-fonte servido ao navegador).

## Boas práticas aplicadas

Chamada à API de terceiros sempre no servidor, nunca no client; falha de integração externa tratada como não-bloqueante; opt-in validado nos dois lados; uso do SDK oficial em vez de `fetch` manual, herdando tratamento de erros e tipagem já mantidos pela MailerLite.
