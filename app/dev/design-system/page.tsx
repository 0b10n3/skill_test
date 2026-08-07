import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

// Rota interna de QA visual — não linkada em nenhuma navegação pública.
export const metadata: Metadata = {
  title: 'Design System — Syntaxis Skill Check',
  robots: { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xl font-medium text-foreground">{title}</h2>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

const neutrals = [
  ['obsidian', 'bg-obsidian'],
  ['graphite', 'bg-graphite'],
  ['carbon', 'bg-carbon'],
  ['carbon-hi', 'bg-carbon-hi'],
  ['pine', 'bg-pine'],
  ['line', 'bg-line'],
  ['line-hi', 'bg-line-hi'],
] as const;

const voltScale = [
  ['volt-300', 'bg-volt-300'],
  ['volt-400', 'bg-volt-400'],
  ['volt-500', 'bg-volt-500'],
  ['volt-600', 'bg-volt-600'],
  ['volt-700', 'bg-volt-700'],
  ['volt-800', 'bg-volt-800'],
] as const;

const functional = [
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
  ['error', 'bg-error'],
  ['info', 'bg-info'],
] as const;

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-foreground">
          O Sinal no Escuro — Design System
        </h1>
        <p className="text-text-medium">
          QA visual interna dos tokens e componentes-base. Não linkada publicamente.
        </p>
      </header>

      <Section title="Tipografia">
        <div className="flex flex-col gap-3">
          <p className="font-display text-2xl font-bold text-foreground">
            Space Grotesk — títulos e números grandes
          </p>
          <p className="text-base text-foreground">
            Inter — parágrafos, UI e tabelas explicativas. Este é um texto de corpo padrão sobre o
            fundo escuro principal.
          </p>
          <p className="font-mono text-sm text-foreground">
            JetBrains Mono — dados numéricos: score 87.50% · pergunta 07 de 14
          </p>
          <p className="text-sm text-text-medium">Texto secundário (text-medium)</p>
          <Input
            disabled
            placeholder="Texto terciário / desabilitado (text-low) — só em contexto exempt de AA"
            className="max-w-md text-text-low placeholder:text-text-low"
          />
          <p className="text-sm font-medium text-text-volt">
            Texto de destaque verde sobre fundo escuro — use text-volt (#3DE889), não volt-700/800
            (ambos calibrados para AA sobre fundo claro, não sobre o obsidian).
          </p>
        </div>
      </Section>

      <Section title="Paleta — neutros">
        {neutrals.map(([name, bgClass]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className={`size-16 rounded-lg border border-line ${bgClass}`} />
            <span className="font-mono text-xs text-text-medium">{name}</span>
          </div>
        ))}
      </Section>

      <Section title="Paleta — volt (marca)">
        {voltScale.map(([name, bgClass]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className={`size-16 rounded-lg border border-line ${bgClass}`} />
            <span className="font-mono text-xs text-text-medium">{name}</span>
          </div>
        ))}
      </Section>

      <Section title="Paleta — funcional">
        {functional.map(([name, bgClass]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className={`size-16 rounded-lg border border-line ${bgClass}`} />
            <span className="font-mono text-xs text-text-medium">{name}</span>
          </div>
        ))}
      </Section>

      <Section title="Button">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="default" disabled>
          Disabled
        </Button>
      </Section>

      <Section title="Badge">
        <Badge variant="default">Baixo</Badge>
        <Badge variant="secondary">Médio</Badge>
        <Badge variant="outline">Alto</Badge>
        <Badge variant="destructive">Erro</Badge>
      </Section>

      <Section title="Card">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Score geral</CardTitle>
            <CardDescription>Resultado da avaliação de conhecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-4xl font-bold text-volt-500">72%</p>
          </CardContent>
          <CardFooter>
            <Badge>Alto</Badge>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Progress">
        <div className="w-full max-w-md">
          <Progress value={57} aria-label="Progresso do quiz" />
          <p className="mt-2 font-mono text-sm text-text-medium">Pergunta 08 de 14</p>
        </div>
      </Section>

      <Section title="RadioGroup">
        <RadioGroup defaultValue="b" className="max-w-sm">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <RadioGroupItem value="a" /> Analista Júnior
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <RadioGroupItem value="b" /> Analista Pleno
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <RadioGroupItem value="c" /> Analista Sênior
          </label>
        </RadioGroup>
      </Section>

      <Section title="Checkbox">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox defaultChecked /> Aceito receber comunicações da Syntaxis
        </label>
      </Section>

      <Section title="Input">
        <Input placeholder="seu@email.com" className="max-w-sm" />
      </Section>

      <Section title="Separator">
        <div className="w-full max-w-sm">
          <p className="text-sm text-foreground">Acima</p>
          <Separator className="my-3" />
          <p className="text-sm text-foreground">Abaixo</p>
        </div>
      </Section>

      <Section title="Dialog">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Abrir dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar envio</DialogTitle>
              <DialogDescription>
                Seu resultado será calculado no servidor após a confirmação.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="default">Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </main>
  );
}
