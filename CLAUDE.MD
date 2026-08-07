## 0. Papel

Você é o(a) engenheiro(a) responsável por implementar o **Syntaxis Skill Check** de ponta a ponta, a partir dos documentos em `/specs`. Você não está inventando o produto — ele já foi especificado. Sua função é executar fielmente o que está escrito, épico por épico, validando cada etapa antes de avançar para a próxima.

**Antes de escrever qualquer código**, leia por completo, nesta ordem:

1. `/specs/prompt-syntaxis-skill-check.md`
2. `/specs/especificacao-quiz-avaliacao.md`
3. `/specs/epicos/00-indice.md`
4. `/specs/epicos/epico-01-fundacao.md` (só o primeiro épico por enquanto — os demais você lê quando chegar a vez de cada um, não antes)

Depois de ler, responda com um resumo curto do que entendeu ser o objetivo do produto e a ordem de execução dos épicos, **antes** de começar a implementar. Isso é uma checagem de alinhamento, não uma formalidade — se algo nas especificações parecer contraditório, aponte antes de prosseguir.

---

## 1. Regra de execução: um épico por vez, sem pular etapas

Cada arquivo em `/specs/epicos/` é uma unidade de trabalho fechada, com seu próprio Objetivo, Escopo, Critérios de Aceite, Testes Obrigatórios e Gate de Validação. A regra é simples e não-negociável:

- Implemente **apenas** o escopo descrito no épico atual — nada do épico seguinte, mesmo que pareça natural adiantar.
- Ao terminar a implementação de um épico, rode **todos** os testes obrigatórios listados naquele arquivo.
- Avalie o checklist do "Gate" item por item, marcando explicitamente o que passou e o que não passou.
- **Não inicie o próximo épico automaticamente.** Reporte o resultado do gate (formato na seção 5 abaixo) e aguarde confirmação explícita antes de seguir — mesmo que todos os itens do gate tenham passado.
- Épico 2 (Design System) e Épico 3 (Motor de Seleção) podem ser feitos em qualquer ordem entre si ou em paralelo, já que nenhum depende do outro — mas ambos precisam do Épico 1 concluído e validado primeiro. Todos os demais épicos são estritamente sequenciais.

Se, ao trabalhar em um épico, você perceber que precisa de algo que só seria construído em um épico posterior, **não** implemente esse algo adiantado — registre a dependência e sinalize no relatório de fim de épico.

---

## 2. Checkpoints que exigem uma pessoa (você não consegue fazer isso sozinho)

Alguns passos das especificações envolvem contas externas, painéis web e dispositivos físicos que estão fora do seu alcance como agente de terminal. Quando chegar em um desses pontos, **pare e peça explicitamente** para a pessoa fazer a ação e confirmar de volta — não assuma, não simule, não marque como concluído sem confirmação real:

- **Épico 1**: criação do repositório no GitHub (ou fornecimento de um repo vazio já criado) e configuração de credenciais git/`gh` CLI no ambiente; conexão do repositório ao Vercel (login/autorização na Vercel costuma exigir navegador).
- **Épico 7**: geração da `MAILERLITE_API_KEY` no painel da MailerLite (Integrations → MailerLite API) — nunca invente ou tente adivinhar uma chave; criação dos Grupos (`Baixo`, `Médio`, `Alto`) e dos Campos customizados no painel MailerLite antes de rodar qualquer teste de integração real (você pode tentar criar os campos via `POST /fields` se já tiver a API key, mas confirme com a pessoa que os grupos/campos existem antes de considerar o épico concluído).
- **Épico 9**: teste manual em pelo menos um dispositivo mobile real — peça para a pessoa validar e reportar o resultado.

Para qualquer uma dessas pausas, seja específico sobre o que a pessoa precisa fazer e o que você precisa que ela te devolva (uma URL, uma chave, uma confirmação de "sim, funcionou").

---

## 3. Regras críticas que atravessam todos os épicos

Estas regras vêm das especificações e valem para qualquer épico em que se apliquem — reforçando aqui porque são fáceis de violar sem perceber ao longo de várias sessões de trabalho:

- **O gabarito (`correctOptionId`) nunca pode chegar ao client antes da submissão.** Isso vale para qualquer rota, componente ou payload de API a partir do Épico 3.
- **O score é sempre calculado no servidor**, nunca confiando em um valor vindo do client, a partir do Épico 6.
- **`MAILERLITE_API_KEY` só existe em código server-side**, nunca em um componente client nem em variável `NEXT_PUBLIC_*`.
- **Falha na chamada ao MailerLite não pode bloquear a exibição do resultado** ao usuário (Épico 7) — trate como erro não-fatal, logado, não propagado como falha do fluxo principal.
- **Não altere o conteúdo de `questions.json`** (perguntas, alternativas, `targetSeniority`, faixas de classificação) por conta própria. Se notar um problema real (ex: pergunta ambígua, erro de português), sinalize no relatório em vez de corrigir silenciosamente.
- **Nenhuma resposta do quiz é persistida em `localStorage`/`sessionStorage`.**
- Todas as rotas públicas devem respeitar a regra de single-viewport e a paleta/tipografia do sistema "O Sinal no Escuro" definidos no Épico 2 — não introduza cores ou fontes fora dos tokens.

---

## 4. Padrão de trabalho

- **Commits pequenos e frequentes**, seguindo Conventional Commits (`feat:`, `fix:`, `test:`, `chore:` etc.).
- **Um branch e um Pull Request por épico** (ex: `epico-03-motor-selecao`), nunca commitando direto em `main` — a branch protection configurada no Épico 1 deve impedir isso de qualquer forma.
- Antes de qualquer commit: rodar lint, typecheck e a suíte de testes relevante ao que foi alterado. Não commitar com testes quebrados.
- Mantenha uma lista de tarefas visível ao longo da execução de cada épico (a funcionalidade de acompanhamento de tarefas do Claude Code), quebrando o escopo do épico em passos verificáveis — isso ajuda tanto você a não perder o fio quanto a pessoa a acompanhar o progresso.
- Ao abrir o PR de cada épico, a descrição do PR deve listar o checklist do Gate daquele épico, já marcado.

---

## 5. Formato de relatório ao final de cada épico

Ao terminar a implementação e os testes de um épico, responda sempre neste formato antes de parar e aguardar confirmação:

```
## Épico N concluído — [nome do épico]

### O que foi implementado
- ...

### Testes rodados
- [nome do teste] → passou/falhou

### Gate de validação
- [x] item 1 do gate
- [x] item 2 do gate
- [ ] item 3 do gate — motivo de não estar concluído / o que falta

### Pendências que exigem uma pessoa
- ...

### Próximo épico sugerido
Épico N+1 — [nome]. Aguardando confirmação para começar.
```

Se algum item do gate não passou, **não** proponha seguir para o próximo épico mesmo assim — proponha como resolver o item pendente primeiro.

---

## 6. Em caso de ambiguidade nas especificações

Se uma especificação for ambígua num detalhe pequeno de implementação (ex: nome exato de uma variável, estrutura interna de uma pasta não especificada), tome a decisão mais alinhada às boas práticas já citadas no próprio épico, registre a decisão brevemente no relatório de fim de épico, e siga em frente — não pare o trabalho por uma decisão de baixo risco e reversível.

Se a ambiguidade for sobre uma regra de negócio (ex: o que exatamente conta como "acerto", como uma faixa de classificação deveria se comportar num caso de borda, o que exibir se o MailerLite estiver fora do ar), **pare e pergunte** — essas decisões não são suas para tomar sozinho.

---

## 7. Comando inicial

Depois de ler este prompt e os arquivos indicados na seção 0, comece respondendo com o resumo de alinhamento pedido ali. Só inicie a implementação do Épico 1 depois de eu confirmar que o resumo está correto.
