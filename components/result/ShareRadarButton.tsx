'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  generateGrowthLineLayout,
  type GrowthLineLayout,
} from '@/components/patterns/lib/growth-line-layout';
import {
  generateNodeBranchLayout,
  type NodeBranchLayout,
} from '@/components/patterns/lib/node-branch-layout';
import { CATEGORY_LABEL_SHORT, CLASSIFICATION_LABEL } from '@/content/relatorio';
import { track } from '@/lib/analytics/track';
import type { DimensaoDiagnostico } from '@/lib/diagnostico';
import type { Classification } from '@/lib/types';

const CANVAS_SIZE = 600;
const CENTER = CANVAS_SIZE / 2;
const RADAR_RADIUS = 160;

// DESIGN.md §6: "Certificado de módulo — linha de conquista + nó-e-galho
// como moldura — o único material onde os padrões geométricos são
// protagonistas, não fundo". Só esta peça combina os dois padrões: uma
// exceção documentada, não uma violação de "um padrão por peça"
// (DESIGN.md §5.4, que fala de composições comuns, não de certificados).
const FRAME_SCALE = 0.42;
const FRAME_INSET = 24;

export interface ShareRadarButtonProps {
  dimensoes: DimensaoDiagnostico[];
  classificacao: Classification;
}

/** Ponto do polígono do radar na posição `index` de `total`, à distância `fraction` (0–1) do centro. */
function radarPoint(index: number, total: number, fraction: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + Math.cos(angle) * RADAR_RADIUS * fraction,
    y: CENTER + Math.sin(angle) * RADAR_RADIUS * fraction,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Um canto da moldura nó-e-galho, espelhado conforme o canto do card. */
function drawNodeBranchCorner(
  ctx: CanvasRenderingContext2D,
  layout: NodeBranchLayout,
  corner: 'tl' | 'tr' | 'bl' | 'br',
  color: string,
) {
  ctx.save();
  const flipX = corner === 'tr' || corner === 'br' ? -1 : 1;
  const flipY = corner === 'bl' || corner === 'br' ? -1 : 1;
  const originX = corner === 'tr' || corner === 'br' ? CANVAS_SIZE - FRAME_INSET : FRAME_INSET;
  const originY = corner === 'bl' || corner === 'br' ? CANVAS_SIZE - FRAME_INSET : FRAME_INSET;

  ctx.translate(originX, originY);
  ctx.scale(flipX * FRAME_SCALE, flipY * FRAME_SCALE);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 / FRAME_SCALE;
  for (const edge of layout.edges) {
    const from = layout.nodes[edge.from];
    const to = layout.nodes[edge.to];
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  ctx.fillStyle = color;
  const nodeRadius = 2.5 / FRAME_SCALE;
  for (const node of layout.nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Linha de conquista — protagonista, nunca decorativa (DESIGN.md §5.4). */
function drawGrowthLine(
  ctx: CanvasRenderingContext2D,
  layout: GrowthLineLayout,
  originX: number,
  originY: number,
  scale: number,
  color: string,
) {
  const points = layout.points.split(' ').map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    return { x: originX + x * scale, y: originY - y * scale };
  });

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();
}

/**
 * Gera o card compartilhável — o "mini-certificado" (S7, DESIGN.md §6):
 * textura de fundo do Épico 16, moldura nó-e-galho + linha de conquista
 * como protagonistas, radar e classificação. Client-side via Canvas 2D
 * para download. Assinatura só recebe dimensoes/classificacao — nenhum
 * dado de contato do lead entra na função por construção (ver
 * __tests__/share-radar-button.test.tsx).
 */
async function drawShareCard(
  canvas: HTMLCanvasElement,
  dimensoes: DimensaoDiagnostico[],
  classificacao: Classification,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const isDark = document.documentElement.classList.contains('dark');
  const styles = getComputedStyle(document.documentElement);
  const textHigh = styles.getPropertyValue('--foreground').trim();
  const textMedium = styles.getPropertyValue('--muted-foreground').trim();
  const grove = styles.getPropertyValue('--color-semantic-progress-bar').trim();
  const nodeBranchColor = styles.getPropertyValue('--pattern-node-branch-color').trim();
  const growthLineColor = styles.getPropertyValue('--pattern-growth-line-color').trim();

  // Fundo: textura do Épico 16 (radar-card-textura), variante por tema.
  const backgroundSrc = `/img/radar-card-textura/${isDark ? 'dark' : 'light'}-1080.png`;
  const background = await loadImage(backgroundSrc);
  ctx.drawImage(background, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Moldura nó-e-galho — mesma geometria determinística dos padrões do
  // Épico 15, nos 4 cantos.
  const cornerLayout = generateNodeBranchLayout('sparse', 'corner');
  for (const corner of ['tl', 'tr', 'bl', 'br'] as const) {
    drawNodeBranchCorner(ctx, cornerLayout, corner, nodeBranchColor);
  }

  // Grade do radar (3 anéis de referência)
  ctx.strokeStyle = textMedium;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1;
  for (const fraction of [0.33, 0.67, 1]) {
    ctx.beginPath();
    dimensoes.forEach((_, index) => {
      const point = radarPoint(index, dimensoes.length, fraction);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Área "Seu perfil" — Grove fixo, mesmo token do RadarSection (S2).
  ctx.beginPath();
  dimensoes.forEach((dimensao, index) => {
    const point = radarPoint(index, dimensoes.length, dimensao.score);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = `${grove}59`; // ~35% de opacidade
  ctx.fill();
  ctx.strokeStyle = grove;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rótulos das dimensões
  ctx.fillStyle = textMedium;
  ctx.font = '13px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  dimensoes.forEach((dimensao, index) => {
    const point = radarPoint(index, dimensoes.length, 1.22);
    ctx.fillText(CATEGORY_LABEL_SHORT[dimensao.category], point.x, point.y);
  });

  // Linha de conquista — protagonista, entre o radar e a classificação.
  const growthLineLayout = generateGrowthLineLayout(3);
  drawGrowthLine(ctx, growthLineLayout, CANVAS_SIZE - 190, CANVAS_SIZE - 96, 1.4, growthLineColor);

  // Wordmark + classificação — sem nenhum dado de contato do lead.
  ctx.fillStyle = textHigh;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 26px "Space Grotesk", Arial, sans-serif';
  ctx.fillText('Syntaxis', 32, 52);

  ctx.fillStyle = grove;
  ctx.font = 'bold 20px "Hanken Grotesk", sans-serif';
  ctx.fillText(`Classificação: ${CLASSIFICATION_LABEL[classificacao]}`, 32, CANVAS_SIZE - 32);
}

export function ShareRadarButton({ dimensoes, classificacao }: ShareRadarButtonProps) {
  const [status, setStatus] = useState<'idle' | 'gerando' | 'pronto'>('idle');

  async function handleShare() {
    setStatus('gerando');
    const canvas = document.createElement('canvas');
    await drawShareCard(canvas, dimensoes, classificacao);

    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus('idle');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'syntaxis-skill-check-radar.png';
      link.click();
      URL.revokeObjectURL(url);
      setStatus('pronto');
      // radar_shared (epico-21): dispara só quando o download de fato
      // conclui (não no clique do botão) — é o sinal real de uso.
      track('radar_shared', { classificacao });
      setTimeout(() => setStatus('idle'), 2000);
    }, 'image/png');
  }

  return (
    <Button variant="outline" onClick={handleShare} disabled={status === 'gerando'}>
      {status === 'pronto' ? 'Imagem baixada!' : 'Compartilhar meu radar'}
    </Button>
  );
}
