import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como os dados pessoais enviados por este site são coletados, utilizados e protegidos (LGPD).",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default async function PrivacyPage() {
  const { profile } = await getSiteContent();
  const contact = profile.email ?? "o e-mail informado na seção de contato";

  return (
    <>
      <PageHero title="Política de privacidade" crumb="Política de privacidade" />
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        <p className="text-sm text-muted">
          Esta política descreve o tratamento de dados pessoais realizado por meio deste site, em conformidade com a Lei
          Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD). Recomenda-se a revisão deste texto por um
          profissional jurídico antes da publicação definitiva.
        </p>

        <h2>1. Controlador dos dados</h2>
        <p>
          O responsável pelo tratamento dos dados é {profile.full_name}
          {profile.crea ? ` (${profile.crea})` : ""}. Para qualquer assunto relacionado a dados pessoais, entre em contato
          por {contact}.
        </p>

        <h2>2. Dados coletados</h2>
        <p>Ao preencher o formulário de contato e orçamento, são coletados:</p>
        <ul>
          <li>nome completo, e-mail e telefone;</li>
          <li>empresa (opcional);</li>
          <li>serviço de interesse e a descrição do projeto informada por você;</li>
          <li>
            um identificador irreversível (hash criptográfico) derivado do endereço IP, usado exclusivamente para impedir
            envios abusivos. O endereço IP em si não é armazenado.
          </li>
        </ul>
        <p>Este site não utiliza cookies de rastreamento ou publicidade. A preferência de tema (claro/escuro) é salva apenas no seu navegador.</p>

        <h2>3. Finalidade e base legal</h2>
        <p>
          Os dados são utilizados somente para responder à sua solicitação, elaborar propostas e manter o histórico do
          atendimento. O tratamento se baseia no seu consentimento e em procedimentos preliminares relacionados a contrato
          (art. 7º, I e V, da LGPD).
        </p>

        <h2>4. Compartilhamento</h2>
        <p>
          Os dados não são vendidos nem compartilhados para fins de marketing. Eles são armazenados em provedores de
          infraestrutura (hospedagem e banco de dados) que atuam como operadores, sob obrigações de segurança e
          confidencialidade.
        </p>

        <h2>5. Armazenamento e segurança</h2>
        <p>
          As informações ficam em banco de dados com acesso restrito ao administrador, protegido por autenticação,
          criptografia em trânsito (HTTPS) e políticas de segurança em nível de linha. Os dados são mantidos pelo tempo
          necessário ao atendimento e às obrigações legais, e então excluídos.
        </p>

        <h2>6. Seus direitos</h2>
        <p>Você pode, a qualquer momento, solicitar:</p>
        <ul>
          <li>confirmação e acesso aos seus dados;</li>
          <li>correção de dados incompletos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação;</li>
          <li>revogação do consentimento.</li>
        </ul>
        <p>Para exercer esses direitos, entre em contato por {contact}.</p>

        <h2>7. Atualizações</h2>
        <p>Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página.</p>
      </div>
    </>
  );
}
