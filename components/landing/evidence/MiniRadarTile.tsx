import { CATEGORY_LABEL_SHORT } from '@/content/relatorio';
import type { KnowledgeCategory } from '@/lib/types';

const AXES: KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];

/** Forma ilustrativa (não é o resultado de ninguém) — só para mostrar o formato do radar real do relatório. */
const ILLUSTRATIVE_SHAPE: Record<KnowledgeCategory, number> = {
  'mercados-produtos': 0.78,
  'matematica-quant': 0.55,
  'dados-programacao': 0.68,
  'ia-aplicada': 0.82,
  'risco-regulacao': 0.6,
};

const CENTER = 100;
const RADIUS = 68;
const RINGS = [0.33, 0.66, 1];

function pointAt(index: number, fraction: number): [number, number] {
  const angle = (-90 + index * (360 / AXES.length)) * (Math.PI / 180);
  const r = RADIUS * fraction;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

/**
 * Mini-radar renderizado (não screenshot) para o tile de evidência de
 * "mercados-produtos" na landing (DESIGN.md v1.1 §4.4.6) — SVG puro (sem
 * Recharts) para não pesar o orçamento de performance da landing (GOLIVE.md,
 * achado do Épico 13). Mostra o mesmo formato/eixos do radar real de
 * `/resultado` (RadarSection.tsx), com forma ilustrativa explicitamente
 * rotulada — nunca dado real de um usuário.
 */
export function MiniRadarTile({ highlight }: { highlight: KnowledgeCategory }) {
  const dataPoints = AXES.map((category, i) => pointAt(i, ILLUSTRATIVE_SHAPE[category]));
  const dataPath = dataPoints.map((p) => p.join(',')).join(' ');

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Radar ilustrativo de competências, com cinco eixos: mercados e produtos, matemática quantitativa, dados e programação, IA aplicada, risco e regulação."
      className="h-full w-full max-w-[220px]"
    >
      {RINGS.map((fraction) => {
        const ringPoints = AXES.map((_, i) => pointAt(i, fraction).join(',')).join(' ');
        return (
          <polygon
            key={fraction}
            points={ringPoints}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}
      {AXES.map((category, i) => {
        const [x, y] = pointAt(i, 1);
        return (
          <line
            key={category}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={dataPath}
        fill="var(--color-grove-500)"
        fillOpacity={0.3}
        stroke="var(--color-grove-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {dataPoints.map(([x, y], i) => {
        const isHighlight = AXES[i] === highlight;
        return (
          <circle
            key={AXES[i]}
            cx={x}
            cy={y}
            r={isHighlight ? 5 : 3}
            fill={isHighlight ? 'var(--color-amber-500)' : 'var(--color-grove-500)'}
          />
        );
      })}
      {AXES.map((category, i) => {
        const [x, y] = pointAt(i, 1.28);
        return (
          <text
            key={category}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground font-data"
            style={{ fontSize: '9px', fontWeight: category === highlight ? 700 : 400 }}
          >
            {CATEGORY_LABEL_SHORT[category]}
          </text>
        );
      })}
    </svg>
  );
}
