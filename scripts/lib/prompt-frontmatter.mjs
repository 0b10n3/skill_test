/**
 * Leitura do frontmatter YAML dos arquivos assets/prompts/*.md (Épico 16).
 */
import { parse } from 'yaml';

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

export function parsePromptFile(source) {
  const match = source.match(FRONTMATTER_PATTERN);
  if (!match) {
    throw new Error('Arquivo de prompt sem frontmatter YAML válido (--- ... ---).');
  }
  const frontmatter = parse(match[1]) ?? {};
  const body = match[2];
  return { frontmatter, body };
}
