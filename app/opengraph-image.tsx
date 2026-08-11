import { ImageResponse } from 'next/og';
import tokens from '@/design/tokens.json';

export const runtime = 'nodejs';
export const alt = 'Syntaxis Skill Check — Descubra seu nível técnico em finanças';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
        backgroundImage: `radial-gradient(circle at 15% 15%, ${tokens.color.forest[900].$value} 0%, transparent 45%)`,
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
          color: tokens.color.neutral.slate.$value,
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
