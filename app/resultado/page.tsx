import type { Metadata } from 'next';
import { ResultadoPageClient } from './ResultadoPageClient';

// Épico 21: resultado individual — dado pessoal do usuário, nunca deve ranquear.
export const metadata: Metadata = {
  title: 'Seu resultado — Syntaxis Skill Check',
  robots: { index: false, follow: false },
};

export default function ResultadoPage() {
  return <ResultadoPageClient />;
}
