/**
 * Quem escreve (Épico 44; reaproveitado pela landing no Épico 46). Bio a partir
 * do perfil profissional enviado pelo founder em 13/11/2026; o empregador atual
 * não é citado, por decisão dele.
 *
 * `foto` é `null` até o retrato real chegar: o bloco usa o símbolo da marca no
 * lugar. Nunca foto de outra pessoa (DESIGN.md §5.1, regra 8). Quando chegar,
 * o arquivo entra em `public/img/autor/` e `foto` passa a `{ src, alt }`.
 */
export interface Author {
  nome: string;
  papel: string;
  bio: string[];
  nota: string;
  foto: { src: string; alt: string } | null;
}

export const author: Author | null = {
  nome: 'Silvano Junior',
  papel: 'Matemático e analista quantitativo',
  bio: [
    'Bacharel e mestre em matemática, deu aulas de cálculo, álgebra linear e estatística na UFES, na USF e na PUC-Campinas antes de ir para o mercado financeiro como analista quantitativo.',
    'Desenvolveu estratégias quantitativas e backtests, precificou títulos públicos e crédito privado na plataforma de consolidação de carteiras do Modal e da XP, validou modelos de risco de mercado e de precificação no Bradesco e hoje trabalha com precificação e índices de renda fixa.',
    'Escreve a Syntaxis para entregar o material que gostaria de ter lido quando era júnior.',
  ],
  nota: 'As opiniões publicadas são pessoais e não representam a posição de empregadores atuais ou anteriores.',
  foto: null,
};
