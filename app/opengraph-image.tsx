import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import tokens from '@/design/tokens.json';

export const runtime = 'nodejs';
export const alt = 'Syntaxis Skill Check — Descubra seu nível técnico em finanças';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Fundo do OG card (Épico 16/17): asset gerado do lote inicial, já no
 * tamanho exato do OG (1200×630) — ver assets/prompts/og-social-background.md.
 * Satori (next/og) não lê arquivo do disco por URL relativa, só data URI
 * ou buffer — lido direto do filesystem (runtime nodejs) e embutido.
 */
function loadOgBackground(): string {
  const filePath = path.join(process.cwd(), 'public/img/og-social-background/1200.png');
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);

  if (!match) {
    throw new Error(`Não foi possível localizar o arquivo da fonte "${family}" ${weight}`);
  }

  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

export default async function OpengraphImage() {
  const [dmSerifDisplayRegular, dmSansRegular] = await Promise.all([
    loadGoogleFont('DM Serif Display', 400),
    loadGoogleFont('DM Sans', 400),
  ]);
  const backgroundDataUri = loadOgBackground();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
        padding: 96,
        backgroundColor: tokens.color.neutral.ink.$value,
        backgroundImage: `url(${backgroundDataUri})`,
        backgroundSize: '100% 100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'DM Sans',
          fontSize: 28,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: tokens.color.grove[500].$value,
        }}
      >
        Syntaxis Skill Check
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'DM Serif Display',
          fontSize: 64,
          lineHeight: 1.15,
          color: tokens.color.neutral.chalk.$value,
          maxWidth: 900,
        }}
      >
        Descubra seu nível técnico em finanças em alguns minutos
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'DM Sans',
          fontSize: 30,
          color: tokens.color.neutral.mint.$value,
        }}
      >
        10–15 min · 15 perguntas · múltipla escolha
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'DM Serif Display', data: dmSerifDisplayRegular, weight: 400, style: 'italic' },
        { name: 'DM Sans', data: dmSansRegular, weight: 400, style: 'normal' },
      ],
    },
  );
}
