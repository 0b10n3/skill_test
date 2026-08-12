import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { METODOLOGIA_LIMITACOES, METODOLOGIA_RESUMO } from '@/content/relatorio';

interface MethodFooterProps {
  /** Sobre banda Deep Forest (component.band) — cores fixas Chalk/Grove-300, independentes do tema ativo. */
  onDark?: boolean;
}

export function MethodFooter({ onDark }: MethodFooterProps) {
  return (
    <footer
      className={cn(
        'flex w-full max-w-md flex-col gap-2 border-t pt-4 text-xs',
        onDark
          ? 'border-neutral-chalk/20 text-neutral-chalk/70'
          : 'border-border text-muted-foreground',
      )}
    >
      <p>{METODOLOGIA_LIMITACOES}</p>
      <Dialog>
        <DialogTrigger
          className={cn(
            'self-start underline underline-offset-2',
            onDark
              ? 'text-neutral-chalk/70 hover:text-neutral-chalk'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Como funciona a metodologia
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Como funciona o Syntaxis Skill Check</DialogTitle>
            <DialogDescription className="sr-only">
              Resumo da metodologia de avaliação, condensado de AVALIACAO.md
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {METODOLOGIA_RESUMO.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
