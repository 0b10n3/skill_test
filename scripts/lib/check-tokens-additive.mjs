// Lógica pura de comparação de aditividade entre duas árvores de tokens DTCG
// — separada do script CLI (scripts/check-tokens-additive.mjs) para ser
// testável sem tocar disco. Ver design/tokens.json meta.changelog "1.2.0".

/**
 * Achata um objeto de tokens DTCG em um mapa `path -> $value serializado`,
 * usando apenas nós folha que tenham `$value` (ignora `$description`/`$type`
 * e qualquer outra chave de metadado).
 */
export function flattenTokens(node, prefix = '', out = new Map()) {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    if ('$value' in node) {
      out.set(prefix, JSON.stringify(node.$value));
      return out;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) continue; // metadado (meta, $description etc.)
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenTokens(value, nextPrefix, out);
    }
  }
  return out;
}

/**
 * Compara duas árvores de tokens DTCG (old → new) e reporta:
 * - `changed`: paths presentes em ambas com valor diferente (proibido).
 * - `removed`: paths presentes só na antiga (proibido).
 * - `added`: paths presentes só na nova (esperado — é o que a v1.2.0 faz).
 * - `ok`: true quando não há `changed` nem `removed`.
 */
export function diffTokens(oldTokens, newTokens) {
  const oldFlat = flattenTokens(oldTokens);
  const newFlat = flattenTokens(newTokens);

  const changed = [];
  const removed = [];
  const added = [];

  for (const [tokenPath, oldValue] of oldFlat) {
    if (!newFlat.has(tokenPath)) {
      removed.push(tokenPath);
      continue;
    }
    const newValue = newFlat.get(tokenPath);
    if (newValue !== oldValue) {
      changed.push({ path: tokenPath, old: oldValue, new: newValue });
    }
  }

  for (const tokenPath of newFlat.keys()) {
    if (!oldFlat.has(tokenPath)) added.push(tokenPath);
  }

  return { changed, removed, added, ok: changed.length === 0 && removed.length === 0 };
}
