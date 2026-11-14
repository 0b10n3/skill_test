import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/content/author', () => ({ author: null }));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('landing — quem escreve (Épico 46)', () => {
  it('sem dados do autor, a seção não existe', async () => {
    const { default: Home } = await import('@/app/page');
    render(<Home />);
    expect(screen.queryByText('Quem escreve')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Perguntas frequentes' })).toBeTruthy();
  });
});
