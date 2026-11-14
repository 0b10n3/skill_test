import { HERO, type Post } from '@/content/newsletter';
import { comUtm } from '@/lib/substack';

/** Três textos reais da curadoria, cada um abrindo em nova aba com UTMs (Épico 44). */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <aside aria-labelledby="posts-heading" className="flex flex-col gap-3">
      <h2 id="posts-heading" className="font-display text-lg text-foreground">
        {HERO.tituloPosts}
      </h2>
      <ul className="flex flex-col divide-y divide-border border-y border-border">
        {posts.map((post, index) => (
          <li key={post.url}>
            <a
              href={comUtm(post.url, `post-${index + 1}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 py-4"
            >
              <span className="text-eyebrow text-grove-700 dark:text-lime-300">{post.linha}</span>
              <span className="font-display text-base text-foreground group-hover:underline">
                {post.titulo}
              </span>
              <span className="text-sm text-muted-foreground">{post.subtitulo}</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
