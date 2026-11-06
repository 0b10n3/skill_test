# ÉPICO 41 — Oferta da tela de resultado aponta para a newsletter

**Depende de:** Épico 40.

**Origem:** decisões do founder de 05/11/2026 (`strategy/DECISOES_2026-11.md`, decisões 11 e 12): o Skill Check é captura gratuita, e os leads são convidados ao Substack. A tela de resultado mostrava placeholders de curso gratuito, curso pago e mentoria.

## Mudanças

| Arquivo | Mudança |
| --- | --- |
| `content/offers.ts` | as três classificações convidam à newsletter (`https://syntaxis.substack.com`), cada uma com título próprio |
| `components/result/OfferBlock.tsx` | o link abre em nova aba, para o lead não perder o resultado |
| `e2e/full-flow-resultado.spec.ts` | expectativas passam para o link da newsletter |

Fora de escopo: GA4, Meta Pixel e MailerLite. O evento `cta_offer_click` continua igual. O convite por e-mail, se houver, é configurado no painel do MailerLite.

## Critérios de aceite

- Nenhuma classificação mostra `[placeholder]` nem botão desativado.
- E2E completo verde; snapshots da tela de resultado atualizados depois de inspecionados; os da landing não mudam.
- `prebuild`, vitest, lint, typecheck, `format:check` e build verdes.
