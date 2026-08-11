// Lógica pura de geração de app/tokens.generated.css a partir de um objeto de
// tokens DTCG (design/tokens.json) — separada do script CLI
// (scripts/generate-tokens-css.mjs) para ser testável sem tocar disco.

const ALIAS_PATTERN = /^\{(.+)\}$/;

/** Resolve `{color.forest.500}` navegando pela árvore de tokens até achar um nó com $value. */
export function resolveValue(tokens, value) {
  if (typeof value !== 'string') return value;
  const match = value.match(ALIAS_PATTERN);
  if (!match) return value;

  const path = match[1].split('.');
  let node = tokens;
  for (const segment of path) {
    node = node?.[segment];
  }
  if (!node || typeof node !== 'object' || !('$value' in node)) {
    throw new Error(`Alias não resolvido: ${value}`);
  }
  return resolveValue(tokens, node.$value);
}

export function kebabCase(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function shadowToCss(tokens, shadowValue) {
  const offsetX = resolveValue(tokens, shadowValue.offsetX);
  const offsetY = resolveValue(tokens, shadowValue.offsetY);
  const blur = resolveValue(tokens, shadowValue.blur);
  const spread = resolveValue(tokens, shadowValue.spread);
  const color = resolveValue(tokens, shadowValue.color);
  return `${offsetX} ${offsetY} ${blur} ${spread} ${color}`;
}

/** Gera o conteúdo completo de app/tokens.generated.css a partir do objeto de tokens. */
export function generateCss(tokens) {
  const lines = [];
  lines.push('/* ARQUIVO GERADO — não editar à mão.');
  lines.push(' * Fonte: design/tokens.json — rodar `npm run generate:tokens` para regenerar. */');
  lines.push('');

  lines.push('@theme {');
  for (const scaleName of ['forest', 'grove', 'amber']) {
    for (const [step, def] of Object.entries(tokens.color[scaleName])) {
      if (step.startsWith('$')) continue;
      lines.push(`  --color-${scaleName}-${step}: ${resolveValue(tokens, def.$value)};`);
    }
  }
  for (const [name, def] of Object.entries(tokens.color.neutral)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --color-neutral-${kebabCase(name)}: ${resolveValue(tokens, def.$value)};`);
  }
  for (const [name, def] of Object.entries(tokens.color.semantic)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --color-semantic-${kebabCase(name)}: ${resolveValue(tokens, def.$value)};`);
  }
  for (const [name, def] of Object.entries(tokens.radius)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --radius-${kebabCase(name)}: ${resolveValue(tokens, def.$value)};`);
  }
  for (const [familyName, family] of Object.entries(tokens.pattern)) {
    if (familyName.startsWith('$')) continue;
    for (const [propName, def] of Object.entries(family)) {
      if (propName.startsWith('$')) continue;
      lines.push(
        `  --pattern-${kebabCase(familyName)}-${kebabCase(propName)}: ${resolveValue(tokens, def.$value)};`,
      );
    }
  }
  lines.push('}');
  lines.push('');

  lines.push(':root {');
  lines.push('  color-scheme: light;');
  for (const [name, def] of Object.entries(tokens.color.theme.light)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --${kebabCase(name)}: ${resolveValue(tokens, def.$value)};`);
  }
  for (const [name, def] of Object.entries(tokens.shadow)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --shadow-${kebabCase(name)}: ${shadowToCss(tokens, def.$value)};`);
  }
  lines.push('}');
  lines.push('');

  lines.push('.dark {');
  lines.push('  color-scheme: dark;');
  for (const [name, def] of Object.entries(tokens.color.theme.dark)) {
    if (name.startsWith('$')) continue;
    lines.push(`  --${kebabCase(name)}: ${resolveValue(tokens, def.$value)};`);
  }
  lines.push('}');
  lines.push('');

  lines.push('/* Escala tipográfica composta (design/tokens.json → typography.scale). */');
  for (const [scaleName, scale] of Object.entries(tokens.typography.scale)) {
    if (scaleName.startsWith('$')) continue;
    const value = scale.$value;
    const fontFamily = resolveValue(tokens, value.fontFamily)
      .map((f) => (f.includes(' ') ? `"${f}"` : f))
      .join(', ');
    const declarations = [
      `font-family: ${fontFamily}`,
      `font-weight: ${resolveValue(tokens, value.fontWeight)}`,
      `font-size: ${value.fontSize}`,
      `line-height: ${value.lineHeight}`,
    ];
    if (value.fontStyle) declarations.push(`font-style: ${value.fontStyle}`);
    if (value.letterSpacing) declarations.push(`letter-spacing: ${value.letterSpacing}`);
    if (value.textCase === 'uppercase') declarations.push('text-transform: uppercase');

    lines.push(`.text-${kebabCase(scaleName)} {`);
    for (const declaration of declarations) {
      lines.push(`  ${declaration};`);
    }
    lines.push('}');
  }
  lines.push('');

  return lines.join('\n');
}
