import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { METODOLOGIA_LIMITACOES, METODOLOGIA_RESUMO } from '@/content/relatorio';

export function MethodFooter() {
  return (
    <footer className="flex w-full max-w-md flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
      <p>{METODOLOGIA_LIMITACOES}</p>
      <Dialog>
        <DialogTrigger className="self-start text-muted-foreground underline underline-offset-2 hover:text-foreground">
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
