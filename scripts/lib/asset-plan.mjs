/**
 * Planejamento puro dos arquivos de saída de um asset publicado (Épico
 * 16) — dado um slug/variante e as larguras/formatos configurados,
 * calcula os caminhos esperados em public/img/. Separado da execução
 * real (sharp, I/O) para ser testável sem gerar imagens de verdade.
 */

export function planAssetOutputs({ slug, variant, widths, formats }) {
  const outputs = [];
  for (const width of widths) {
    for (const format of formats) {
      const suffix = variant ? `${variant}-${width}` : `${width}`;
      outputs.push({
        path: `public/img/${slug}/${suffix}.${format}`,
        width,
        format,
      });
    }
  }
  return outputs;
}

/** true se o tamanho real (bytes) do asset respeita o orçamento (KB) do manifest. */
export function withinBudget(actualSizeBytes, weightBudgetKb) {
  return actualSizeBytes <= weightBudgetKb * 1024;
}

/**
 * Formatos que não entram no cálculo de orçamento de peso: PNG é o
 * fallback legado (REDESIGN.md §4 item 5, "AVIF/WebP + fallback") para
 * navegadores sem suporte a WebP — hoje uma fração residual do tráfego.
 * O orçamento existe para o que o Lighthouse mede e o usuário real baixa
 * (AVIF/WebP), não para o peso do caminho de compatibilidade que quase
 * ninguém percorre.
 */
export const BUDGET_EXEMPT_FORMATS = ['png'];

/** Maior arquivo entre os publishedFiles que efetivamente conta para o orçamento (ignora formatos isentos). */
export function largestBudgetedFileSize(publishedFiles) {
  const budgeted = publishedFiles.filter((file) => !BUDGET_EXEMPT_FORMATS.includes(file.format));
  if (budgeted.length === 0) return 0;
  return Math.max(...budgeted.map((file) => file.sizeBytes));
}
