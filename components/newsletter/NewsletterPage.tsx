'use client';

import Link from 'next/link';
import { AuthorBlock } from '@/components/newsletter/AuthorBlock';
import { PostList } from '@/components/newsletter/PostList';
import { SubscribeButton } from '@/components/newsletter/SubscribeButton';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PatternTruchet } from '@/components/patterns';
import { author } from '@/content/author';
import {
  DO_DIAGNOSTICO_AO_HABITO,
  FECHAMENTO,
  HERO,
  MICROCOPY_INSCRICAO,
  O_QUE_CHEGA,
  PERGUNTAS,
  postsDaCuradoria,
} from '@/content/newsletter';
import { CATEGORY_LABEL, SENIORITY_LABEL } from '@/content/relatorio';
import type { TrackParams } from '@/lib/analytics/track';
import { segmentoDe, temDiagnostico, type PerfilNewsletter } from '@/lib/newsletter-perfil';
import { useQuizAnswers } from '@/lib/quiz-context';
import { comUtm } from '@/lib/substack';

/**
 * Página final /newsletter (Épico 44). Personalização: diagnóstico em memória
 * (vindo de /resultado) > query `?n&d&c` (links de e-mail) > genérica.
 */
export function NewsletterPage({ perfilQuery }: { perfilQuery: PerfilNewsletter }) {
  const { result } = useQuizAnswers();
  const perfil: PerfilNewsletter = result
    ? {
        nivel: result.seniority,
        classificacao: result.diagnostico.classificacao,
        dimensao: result.diagnostico.prioridades[0].category,
        origem: 'resultado',
      }
    : perfilQuery;

  const comDiagnostico = temDiagnostico(perfil);
  const hero = comDiagnostico ? HERO.comDiagnostico : HERO.generico;
  const bloco2 = DO_DIAGNOSTICO_AO_HABITO[segmentoDe(perfil)];
  const posts = postsDaCuradoria(perfil.dimensao);
  const params: TrackParams = { origem: perfil.origem };
  if (perfil.nivel) params.nivel = perfil.nivel;
  if (perfil.classificacao) params.classificacao = perfil.classificacao;

  return (
    <main className="flex flex-col">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pt-20 pb-14 sm:px-10 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:pb-20">
        <div className="flex flex-col gap-5">
          {comDiagnostico && perfil.nivel && perfil.dimensao && (
            <p className="font-mono text-sm text-muted-foreground">
              Seu diagnóstico · {SENIORITY_LABEL[perfil.nivel]} · prioridade:{' '}
              {CATEGORY_LABEL[perfil.dimensao]}
            </p>
          )}
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1 className="font-display text-[30px] leading-[1.1] text-balance text-foreground sm:text-5xl">
            {hero.titulo}
          </h1>
          <p className="max-w-xl text-base text-pretty text-foreground sm:text-lg">{hero.apoio}</p>
          <div className="flex flex-col gap-2">
            <SubscribeButton posicao="newsletter-hero" params={params} />
            <p className="font-mono text-sm text-muted-foreground">{MICROCOPY_INSCRICAO}</p>
          </div>
          {!comDiagnostico && (
            <Link href="/" className="text-base text-link-foreground underline underline-offset-2">
              {HERO.linkSkillCheck}
            </Link>
          )}
        </div>
        <PostList posts={posts} />
      </section>

      <section className="w-full px-6 py-14 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <h2 className="font-display text-2xl text-balance text-foreground sm:text-3xl">
            {bloco2.titulo}
          </h2>
          {bloco2.paragrafos.map((p) => (
            <p key={p.slice(0, 32)} className="text-base text-pretty text-foreground sm:text-lg">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="w-full bg-muted px-6 py-14 sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <Eyebrow>{O_QUE_CHEGA.eyebrow}</Eyebrow>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {O_QUE_CHEGA.itens.map((item) => (
              <li key={item.titulo} className="flex flex-col gap-2 border-t border-border pt-4">
                <h3 className="font-display text-lg text-foreground">{item.titulo}</h3>
                <p className="text-base text-pretty text-muted-foreground">{item.texto}</p>
              </li>
            ))}
          </ul>
          <SubscribeButton posicao="newsletter-meio" params={params} variant="outline" />
        </div>
      </section>

      {author && <AuthorBlock author={author} />}

      <section aria-labelledby="perguntas-heading" className="w-full px-6 pb-14 sm:px-10 sm:pb-20">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <Eyebrow>Perguntas</Eyebrow>
          <h2 id="perguntas-heading" className="sr-only">
            Perguntas frequentes
          </h2>
          {PERGUNTAS.map((item) => (
            <details key={item.pergunta} className="border-b border-border">
              <summary className="cursor-pointer py-4 font-display text-base text-foreground">
                {item.pergunta}
              </summary>
              <p className="pb-4 text-base text-muted-foreground">{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid w-full bg-neutral-ink lg:grid-cols-[1fr_600px]">
        <div className="flex flex-col gap-6 px-6 py-16 sm:px-10 lg:py-24 lg:pl-30">
          <h2 className="font-display text-3xl font-bold text-balance text-neutral-chalk sm:text-4xl">
            {FECHAMENTO.titulo}
          </h2>
          <SubscribeButton posicao="newsletter-final" params={params} />
          <p className="text-base text-neutral-chalk/80">
            {FECHAMENTO.psAntes}
            <a
              href={comUtm(posts[0].url, 'post-ps')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-chalk underline underline-offset-2"
            >
              {posts[0].titulo}
            </a>
            {FECHAMENTO.psDepois}
          </p>
          <p className="text-xs text-neutral-chalk/70">{FECHAMENTO.notaLegal}</p>
        </div>
        <PatternTruchet cols={5} rows={3} className="hidden h-full w-full lg:block" />
        <PatternTruchet cols={6} rows={2} className="block h-32 w-full lg:hidden" />
      </section>
    </main>
  );
}
