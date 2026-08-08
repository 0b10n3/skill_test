import { ImageResponse } from 'next/og';
import tokens from '@/content/tokens.json';

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
  const [spaceGroteskBold, interRegular] = await Promise.all([
    loadGoogleFont('Space Grotesk', 700),
    loadGoogleFont('Inter', 400),
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
        backgroundColor: tokens.neutrals.obsidian.hex,
        backgroundImage: `radial-gradient(circle at 15% 15%, ${tokens.neutrals.pine.hex} 0%, transparent 45%)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Inter',
          fontSize: 28,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: tokens.text.volt.hex,
        }}
      >
        Syntaxis Skill Check
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Space Grotesk',
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.15,
          color: tokens.text.high.hex,
          maxWidth: 900,
        }}
      >
        Descubra seu nível técnico em finanças em alguns minutos
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: 'Inter',
          fontSize: 30,
          color: tokens.text.medium.hex,
        }}
      >
        10–15 min · 14 perguntas · múltipla escolha
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Space Grotesk', data: spaceGroteskBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      ],
    },
  );
}
