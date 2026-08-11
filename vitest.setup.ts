import '@testing-library/jest-dom/vitest';

// jsdom não implementa matchMedia — vários componentes checam
// prefers-reduced-motion via JS (não só CSS). Mock padrão: "não reduzido".
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
