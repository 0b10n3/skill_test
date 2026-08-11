'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CATEGORY_LABEL_SHORT, CLASSIFICATION_LABEL } from '@/content/relatorio';
import type { DimensaoDiagnostico } from '@/lib/diagnostico';
import type { Classification } from '@/lib/types';

const CANVAS_SIZE = 600;
const CENTER = CANVAS_SIZE / 2;
const RADAR_RADIUS = 190;

interface ShareRadarButtonProps {
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

/**
 * Gera o card compartilhável (S7): radar + classificação + wordmark, sem
 * nenhum dado de contato do lead. Render client-side via Canvas 2D, para
 * download — a textura de logo real chega no Épico 16; até lá, um wordmark
 * textual basta.
 */
function drawShareCard(
  canvas: HTMLCanvasElement,
  dimensoes: DimensaoDiagnostico[],
  classificacao: Classification,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const styles = getComputedStyle(document.documentElement);
  const background = styles.getPropertyValue('--color-obsidian').trim() || '#0A0F0D';
  const line = styles.getPropertyValue('--color-line').trim() || '#1E2C27';
  const volt = styles.getPropertyValue('--color-volt-500').trim() || '#1FE07A';
  const textHigh = styles.getPropertyValue('--color-text-high').trim() || '#EAF3EE';
  const textMedium = styles.getPropertyValue('--color-text-medium').trim() || '#9DB0A8';

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Grade do radar (3 anéis de referência)
  ctx.strokeStyle = line;
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

  // Área "Seu perfil"
  ctx.beginPath();
  dimensoes.forEach((dimensao, index) => {
    const point = radarPoint(index, dimensoes.length, dimensao.score);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = `${volt}59`; // ~35% de opacidade
  ctx.fill();
  ctx.strokeStyle = volt;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Rótulos das dimensões
  ctx.fillStyle = textMedium;
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  dimensoes.forEach((dimensao, index) => {
    const point = radarPoint(index, dimensoes.length, 1.18);
    ctx.fillText(CATEGORY_LABEL_SHORT[dimensao.category], point.x, point.y);
  });

  // Wordmark + classificação
  ctx.fillStyle = textHigh;
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Syntaxis Skill Check', 32, 48);

  ctx.fillStyle = volt;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Classificação: ${CLASSIFICATION_LABEL[classificacao]}`, 32, CANVAS_SIZE - 32);
}

export function ShareRadarButton({ dimensoes, classificacao }: ShareRadarButtonProps) {
  const [status, setStatus] = useState<'idle' | 'gerando' | 'pronto'>('idle');

  function handleShare() {
    setStatus('gerando');
    const canvas = document.createElement('canvas');
    drawShareCard(canvas, dimensoes, classificacao);

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
      setTimeout(() => setStatus('idle'), 2000);
    }, 'image/png');
  }

  return (
    <Button variant="outline" onClick={handleShare} disabled={status === 'gerando'}>
      {status === 'pronto' ? 'Imagem baixada!' : 'Compartilhar meu radar'}
    </Button>
  );
}
