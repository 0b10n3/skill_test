export interface TextSegment {
  text: string;
  isCode: boolean;
}

/**
 * Termos técnicos, fórmulas e trechos de código embutidos em prosa
 * (Épico 18, S6) — o banco de questões (content/questions.json) não tem
 * nenhuma convenção de marcação (backtick, markdown) para isso, então a
 * detecção é por heurística: chamada de função (`AVG(taxa)`), palavras-
 * chave SQL usuais, e identificadores snake_case (`id_emissor`). Não
 * pretende ser exaustiva — é para o caso comum das explicações de
 * dados-programacao, sem risco de falso positivo em prosa financeira
 * comum (LCI, CDB, IPCA não batem em nenhum destes padrões).
 */
const KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'INSERT',
  'UPDATE',
  'DELETE',
  'SQL',
  'Python',
  'pandas',
  'NumPy',
  'scikit-learn',
  'matplotlib',
];

const CODE_TERM_PATTERN = new RegExp(
  `\\b[A-Za-z_]\\w*\\([^()]*\\)` + // chamada de função: AVG(taxa)
    `|\\b(?:${KEYWORDS.join('|')})\\b` + // palavras-chave/nomes de ferramenta
    `|\\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\\b`, // snake_case: id_emissor
  'g',
);

export function splitCodeTerms(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CODE_TERM_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, index), isCode: false });
    }
    segments.push({ text: match[0], isCode: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isCode: false });
  }

  return segments;
}
