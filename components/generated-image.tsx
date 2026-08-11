/**
 * Renderiza um asset gerado (Épico 16, publicado em public/img/<slug>/)
 * como <picture> com os três formatos do pipeline (AVIF → WebP → PNG de
 * fallback), nas larguras já pré-otimizadas por scripts/process-asset.mjs
 * — nunca via next/image, que reprocessaria um arquivo já budget-audited.
 */

function srcSet(slug: string, widths: number[], variant: string | undefined, format: string) {
  const prefix = variant ? `${variant}-` : '';
  return widths.map((width) => `/img/${slug}/${prefix}${width}.${format} ${width}w`).join(', ');
}

interface GeneratedImageProps {
  slug: string;
  widths: number[];
  sizes: string;
  alt: string;
  className?: string;
  variant?: string;
}

function GeneratedPicture({ slug, widths, sizes, alt, className, variant }: GeneratedImageProps) {
  const fallbackWidth = widths[widths.length - 1];
  const fallbackPrefix = variant ? `${variant}-` : '';

  return (
    <picture>
      <source srcSet={srcSet(slug, widths, variant, 'avif')} sizes={sizes} type="image/avif" />
      <source srcSet={srcSet(slug, widths, variant, 'webp')} sizes={sizes} type="image/webp" />
      <img
        src={`/img/${slug}/${fallbackPrefix}${fallbackWidth}.png`}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

/** Asset sem variante de tema (ex.: ilustrações de dimensão). */
export function GeneratedImage(props: Omit<GeneratedImageProps, 'variant'>) {
  return <GeneratedPicture {...props} />;
}

/**
 * Asset com variantes light/dark (ex.: hero-landing, radar-card-textura)
 * — troca por CSS (`dark:`), nunca por JS, para não arriscar flash/
 * mismatch de hidratação (mesmo princípio do ThemeToggle/Logo).
 */
export function ThemedGeneratedImage(
  props: Omit<GeneratedImageProps, 'variant' | 'className'> & {
    className?: string;
  },
) {
  return (
    <>
      <GeneratedPicture
        {...props}
        variant="light"
        className={`dark:hidden ${props.className ?? ''}`.trim()}
      />
      <GeneratedPicture
        {...props}
        variant="dark"
        className={`hidden dark:block ${props.className ?? ''}`.trim()}
      />
    </>
  );
}
