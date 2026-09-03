import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { PatternReticula, PatternGrowthLine, PatternNodeBranch } from '@/components/patterns';

/**
 * Catálogo vivo (Épico 15) — todos os componentes restylizados e os três
 * padrões geométricos, num único lugar, nos dois temas (use o botão de
 * tema). Base do teste visual (screenshots em light/dark, 375px/1440px) e
 * do axe-core do PR — não é uma rota de produto, não fica linkada em
 * nenhum lugar do app.
 */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-border pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`size-12 rounded-sm border border-border ${className}`} />
      <span className="font-mono text-xs text-muted-foreground">{name}</span>
    </div>
  );
}

const PATTERN_USAGE_MATRIX = [
  {
    context: 'Capa de módulo / slide de título',
    pattern: 'Nó-e-galho, canto inferior',
    opacity: '25–35%',
  },
  {
    context: 'Slide divisor de seção',
    pattern: 'Nó-e-galho, campo completo atrás do painel de cor sólida',
    opacity: '30–40%',
  },
  {
    context: 'Fundo de slide de conteúdo técnico (SQL/Python)',
    pattern: 'Grade de dados, apenas nas margens',
    opacity: '15–20%',
  },
  {
    context: 'Certificado de conclusão',
    pattern: 'Linha de conquista + nó-e-galho como moldura',
    opacity: '100% (elementos são o design, não fundo)',
  },
  {
    context: 'Post de rede social — anúncio de módulo',
    pattern: 'Nó-e-galho como moldura de canto',
    opacity: '40–60%',
  },
  {
    context: 'Página de vendas — seção de prova social',
    pattern: 'Nenhum padrão — priorizar depoimento e clareza',
    opacity: '—',
  },
];

export default function UiCatalogPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            /dev/ui — não indexado, não linkado
          </p>
          <h1 className="font-display text-2xl text-foreground">
            Catálogo de componentes e padrões Syntaxis
          </h1>
          <p className="text-sm text-muted-foreground">
            Épico 15 — biblioteca restylizada com os tokens de{' '}
            <code className="font-mono text-xs">design/tokens.json</code>. Use o botão ao lado para
            alternar entre os temas claro e escuro.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section
        title="Paleta"
        description="Primitivos consumidos pela camada semântica (nunca usados diretamente na UI, exceto nos padrões geométricos)."
      >
        <div className="flex flex-wrap gap-6">
          <Swatch name="forest-500" className="bg-forest-500" />
          <Swatch name="grove-500" className="bg-grove-500" />
          <Swatch name="grove-700" className="bg-grove-700" />
          <Swatch name="lime-500" className="bg-lime-500" />
          <Swatch name="lime-700" className="bg-lime-700" />
          <Swatch name="neutral-mist" className="bg-neutral-mist" />
        </div>
      </Section>

      <Section
        title="Padrões geométricos"
        description="DESIGN.md §5 — três famílias, um padrão por peça (verificado por lint em CI)."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Nó-e-galho — decorativo (campo)</p>
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-sm border border-border bg-card">
              <PatternNodeBranch context="decorative" anchor="field" density="default" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Nó-e-galho — atrás de texto</p>
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-sm border border-border bg-card">
              <PatternNodeBranch
                context="onText"
                anchor="corner"
                density="dense"
                className="absolute inset-0"
              />
              <p className="z-10 max-w-[80%] text-center text-sm text-foreground">
                Opacidade travada em 0.12 — nunca compete com o texto.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">
              Linha de conquista — habitat preferencial (sobre escuro, lime-500)
            </p>
            {/* bg-neutral-deep-forest (não bg-card): o padrão usa
                pattern.growthLine.color (lime-500) por padrão, calibrado
                para contraste sobre fundo escuro (DESIGN.md v2.0 §5.2) —
                mostrar sobre um card claro esconderia a cor real de uso. */}
            <div className="flex h-40 items-center justify-center rounded-sm border border-border bg-neutral-deep-forest p-4">
              <PatternGrowthLine steps={4} className="h-full w-full" />
            </div>
          </div>
        </div>
        <div className="relative flex h-24 items-center overflow-hidden rounded-sm border border-border bg-card px-6">
          <PatternReticula slot="margin-left" />
          <PatternReticula slot="margin-right" />
          <p className="z-10 mx-auto text-sm text-muted-foreground">
            Grade de dados — só nas margens (slot fixo), nunca atrás do conteúdo central.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="mb-2 text-left text-xs text-muted-foreground">
              Matriz de uso — DESIGN.md §5.3
            </caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Contexto</th>
                <th className="py-2 pr-4 font-medium">Padrão recomendado</th>
                <th className="py-2 font-medium">Opacidade</th>
              </tr>
            </thead>
            <tbody>
              {PATTERN_USAGE_MATRIX.map((row) => (
                <tr key={row.context} className="border-b border-border/60 text-foreground">
                  <td className="py-2 pr-4">{row.context}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{row.pattern}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">{row.opacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Button"
        description="Variantes × estado disabled (hover/focus via interação real no teste visual)."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default" disabled>
            Default disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary disabled
          </Button>
        </div>
      </Section>

      <Section
        title="Badge"
        description="Lime (achievement) é exclusivo da classificação ALTO — nunca decoração neutra."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Baixo</Badge>
          <Badge variant="secondary">Médio</Badge>
          <Badge variant="achievement">Alto</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Section>

      <Section
        title="Card"
        description="Hairline (borda 1px), canto reto — sem sombra por padrão no sistema v2.0 (DESIGN.md §4.6)."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card padrão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">hairline, canto reto (radius-none).</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Card sm</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">hairline, espaçamento reduzido.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        title="Hairlines estruturais"
        description="Assinatura nova na v2.0 (DESIGN.md §4.4.3) — linhas de 1px delimitando colunas/seções, o grid visível que os cantos retos pedem."
      >
        <div className="grid grid-cols-1 divide-y divide-border border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {['Coluna A', 'Coluna B', 'Coluna C'].map((label) => (
            <div key={label} className="p-4 text-sm text-foreground">
              {label}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Input"
        description="border/ring dos tokens — default, com valor, disabled, inválido."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Placeholder" />
          <Input defaultValue="Com valor" />
          <Input defaultValue="Desabilitado" disabled />
          <Input defaultValue="Inválido" aria-invalid />
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox /> Não marcado
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox defaultChecked /> Marcado
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground opacity-50">
            <Checkbox disabled /> Desabilitado
          </label>
        </div>
      </Section>

      <Section
        title="Radio — alternativas do quiz"
        description="Estados: default, selecionada, correta/incorreta (gabarito)."
      >
        <RadioGroup defaultValue="b" className="max-w-sm gap-1.5">
          <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-border px-3 py-1.5 text-sm text-foreground transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10">
            <RadioGroupItem value="a" />
            Alternativa não selecionada
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-border px-3 py-1.5 text-sm text-foreground transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/10">
            <RadioGroupItem value="b" />
            Alternativa selecionada
          </label>
        </RadioGroup>
        <div className="flex max-w-sm flex-col gap-2 text-sm text-foreground">
          {/* semantic-success/warning ficam só no ícone (não-texto, limiar
              de contraste 3:1) — mesmo padrão de AnswerReview.tsx; o texto
              em si usa --foreground, que já é AA. */}
          <p className="flex items-center gap-2">
            <span aria-hidden className="text-semantic-success">
              ✓
            </span>{' '}
            Resposta correta (gabarito)
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="text-semantic-warning">
              ✕
            </span>{' '}
            Resposta incorreta (gabarito)
          </p>
        </div>
      </Section>

      <Section
        title="Progress"
        description="Barra sempre Grove, trilha sempre Mist, valor em Space Mono."
      >
        <div className="flex max-w-sm flex-col gap-4">
          <Progress value={30}>
            <ProgressLabel>Progresso</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={80}>
            <ProgressLabel>Progresso</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      </Section>

      <Section title="Accordion">
        <Accordion className="max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Pergunta de exemplo</AccordionTrigger>
            <AccordionContent>Conteúdo do painel, expansível.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Dialog">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Abrir dialog</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Título do dialog</DialogTitle>
              <DialogDescription>Superfície popover + tokens de foco.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Separator">
        <Separator />
      </Section>
    </main>
  );
}
