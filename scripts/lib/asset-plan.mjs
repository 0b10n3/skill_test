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
