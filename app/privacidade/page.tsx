import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Syntaxis Skill Check',
  description: 'Como o Syntaxis Skill Check trata dados pessoais, cookies e consentimento.',
  alternates: { canonical: '/privacidade' },
};

/**
 * Política de privacidade (Épico 21 — link exigido pelo banner de
 * consentimento, components/analytics/ConsentBanner.tsx). Conteúdo restrito
 * ao que é verificável neste repositório: o que a aplicação de fato coleta
 * e por quê, e como o consentimento funciona. Dados de identificação legal
 * da Syntaxis (razão social, CNPJ, canal formal de contato/DPO) e prazos de
 * retenção definitivos são decisão do founder — documentado como pendência
 * manual em GOLIVE.md, não inventados aqui.
 */
export default function PrivacidadePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-14 sm:px-10">
      <div className="flex flex-col gap-2">
        <p className="text-eyebrow text-grove-700 dark:text-lime-300">Política de privacidade</p>
        <h1 className="font-display text-3xl text-foreground">
          Como tratamos os seus dados no Syntaxis Skill Check
        </h1>
      </div>

      <div className="flex flex-col gap-4 text-sm text-foreground">
        <p>
          Esta página descreve o que o Syntaxis Skill Check coleta durante a avaliação (
          <code className="font-data">/</code>, <code className="font-data">/quiz</code>,{' '}
          <code className="font-data">/lead</code> e <code className="font-data">/resultado</code>)
          e como o seu consentimento controla essa coleta.
        </p>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-foreground">
            O que coletamos, e só depois do seu aceite
          </h2>
          <p className="text-muted-foreground">
            Antes de você aceitar o banner de cookies, nenhuma requisição sai para Google Analytics
            ou Meta (Facebook) — os scripts dessas duas ferramentas só carregam depois do aceite
            explícito. Uma vez aceito, usamos:
          </p>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Google Analytics 4</strong> — páginas visitadas e
              eventos de uso do diagnóstico (início do quiz, pergunta respondida, conclusão, envio
              de lead, visualização do resultado). Os parâmetros desses eventos nunca incluem seu
              nome, e-mail ou telefone.
            </li>
            <li>
              <strong className="text-foreground">Meta Pixel</strong> — os mesmos eventos de funil,
              para medir a eficácia de campanhas de anúncio. Mesma regra: nenhum parâmetro de evento
              carrega dado pessoal identificável.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-foreground">
            Nome e e-mail (formulário de <code className="font-data">/lead</code>)
          </h2>
          <p className="text-muted-foreground">
            Se você preenche o formulário para ver seu resultado, seu nome e e-mail são processados
            pelo nosso provedor de e-mail transacional (MailerLite) para gerar o seu relatório e,
            caso você opte por isso explicitamente no formulário, para receber conteúdo da Syntaxis.
            Esse envio é independente do consentimento de analytics acima — é necessário para a
            própria entrega do resultado que você pediu.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-foreground">
            Seu controle sobre o consentimento
          </h2>
          <p className="text-muted-foreground">
            A escolha feita no banner fica salva no seu navegador (armazenamento local) e vale até
            você limpar os dados do site ou trocar de dispositivo. Recusar não impede o uso do
            diagnóstico — apenas desativa a medição de analytics/anúncios.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg text-foreground">Contato</h2>
          <p className="text-muted-foreground">
            Canal de contato para questões de privacidade e exercício de direitos sob a LGPD: a
            definir pelo founder antes do lançamento em produção (ver GOLIVE.md).
          </p>
        </div>
      </div>
    </main>
  );
}
