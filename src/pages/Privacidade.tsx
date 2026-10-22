import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { EMPRESA } from "@/lib/empresa";

const Privacidade = () => {
  return (
    <LegalLayout title="Política de Privacidade" updatedAt="22 de outubro de 2026">
      <p>
        Esta política explica como a Erick.AI trata os dados pessoais de quem visita este site,
        preenche nossos formulários, testa nossas demonstrações ou conversa conosco pelo WhatsApp,
        em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
      </p>

      <LegalSection title="1. Quem é o controlador dos dados">
        <p>
          {EMPRESA.razaoSocial}, inscrita no CNPJ sob o nº {EMPRESA.cnpj}, com sede em{" "}
          {EMPRESA.endereco} ("Erick.AI", "nós").
        </p>
        <p>
          Contato para assuntos de privacidade e proteção de dados (encarregado):{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-primary hover:underline">
            {EMPRESA.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Quais dados coletamos">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Formulário de contato:</strong> nome, empresa,
            número de WhatsApp, e-mail e a mensagem que você escrever.
          </li>
          <li>
            <strong className="text-foreground">Teste grátis:</strong> nome, e-mail e telefone
            informados para liberar a demonstração, e as mensagens trocadas com o assistente de
            demonstração.
          </li>
          <li>
            <strong className="text-foreground">WhatsApp:</strong> quando você conversa com nosso
            número, recebemos seu número de telefone, o nome do seu perfil, o conteúdo das mensagens
            (texto, áudio, imagens e arquivos que você enviar) e informações de entrega e leitura.
          </li>
          <li>
            <strong className="text-foreground">Dados técnicos:</strong> o site guarda no seu
            navegador (armazenamento local) os dados do cadastro do teste grátis, para você não
            precisar preenchê-los de novo. Não usamos cookies de publicidade nem de rastreamento.
          </li>
        </ul>
        <p>
          Pedimos que você não envie dados sensíveis (saúde, religião, biometria, por exemplo) nem
          dados de terceiros pelos nossos canais.
        </p>
      </LegalSection>

      <LegalSection title="3. Para que usamos os dados e com qual base legal">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Responder seu contato, entender sua necessidade e enviar propostas (procedimentos
            preliminares a contrato, art. 7º, V, da LGPD).
          </li>
          <li>
            Liberar e operar as demonstrações de automação (consentimento, art. 7º, I).
          </li>
          <li>
            Atender você pelo WhatsApp, inclusive por meio de um assistente de inteligência
            artificial, com possibilidade de atendimento humano (execução de contrato ou
            procedimentos preliminares, art. 7º, V, e legítimo interesse, art. 7º, IX).
          </li>
          <li>
            Prestar os serviços contratados e cumprir obrigações legais e fiscais (art. 7º, II e V).
          </li>
          <li>
            Melhorar nossos serviços e a qualidade do atendimento (legítimo interesse, art. 7º, IX).
          </li>
        </ul>
        <p>Não vendemos nem alugamos dados pessoais.</p>
      </LegalSection>

      <LegalSection title="4. Com quem compartilhamos">
        <p>
          Usamos fornecedores que tratam os dados em nosso nome, apenas para as finalidades acima:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-foreground">Meta Platforms</strong> (WhatsApp Business
            Platform), para envio e recebimento das mensagens do WhatsApp;
          </li>
          <li>
            <strong className="text-foreground">provedores de hospedagem e automação</strong>{" "}
            (como Vercel e servidores onde rodam nossos fluxos de automação), para manter o site e
            processar formulários e mensagens;
          </li>
          <li>
            <strong className="text-foreground">provedores de inteligência artificial</strong>,
            que processam o conteúdo das mensagens para gerar as respostas do assistente.
          </li>
        </ul>
        <p>
          Alguns desses fornecedores ficam fora do Brasil. Nesses casos, a transferência
          internacional segue o art. 33 da LGPD, com fornecedores que adotam garantias adequadas de
          proteção de dados. Também podemos compartilhar dados quando exigido por lei ou por ordem
          de autoridade competente.
        </p>
      </LegalSection>

      <LegalSection title="5. Por quanto tempo guardamos">
        <p>
          Guardamos os dados pelo tempo necessário para as finalidades desta política. Dados de
          contatos que não viraram contratação são eliminados quando deixam de ser necessários.
          Dados de clientes são mantidos durante o contrato e pelo prazo exigido por obrigações
          legais, fiscais ou para defesa em processos.
        </p>
      </LegalSection>

      <LegalSection title="6. Mensagens pelo WhatsApp">
        <p>
          Só enviamos mensagens pelo WhatsApp para quem entrou em contato conosco ou autorizou o
          contato. Você pode parar de receber mensagens a qualquer momento respondendo{" "}
          <strong className="text-foreground">SAIR</strong> ou pedindo pelo e-mail acima. O uso do
          WhatsApp também está sujeito aos termos e à política de privacidade do próprio WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="7. Seus direitos">
        <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>confirmar se tratamos seus dados e acessá-los;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem compartilhamos seus dados;</li>
          <li>revogar o consentimento e pedir a eliminação dos dados tratados com base nele;</li>
          <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
      </LegalSection>

      <LegalSection id="exclusao-de-dados" title="8. Como pedir a exclusão dos seus dados">
        <p>Para pedir a exclusão dos seus dados, incluindo o histórico de conversas do WhatsApp:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            envie um e-mail para{" "}
            <a href={`mailto:${EMPRESA.email}`} className="text-primary hover:underline">
              {EMPRESA.email}
            </a>{" "}
            com o assunto "Exclusão de dados", ou envie "EXCLUIR MEUS DADOS" no nosso WhatsApp;
          </li>
          <li>informe o número de telefone e/ou e-mail usados no contato;</li>
          <li>
            vamos confirmar o pedido e excluir os dados em até 15 dias, mantendo apenas o que a lei
            nos obriga a guardar.
          </li>
        </ol>
      </LegalSection>

      <LegalSection title="9. Segurança">
        <p>
          Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não
          autorizados, perda ou alteração, como conexões criptografadas (HTTPS), controle de acesso e
          autenticação em duas etapas nas contas que usamos.
        </p>
      </LegalSection>

      <LegalSection title="10. Alterações desta política">
        <p>
          Podemos atualizar esta política. A versão vigente fica sempre nesta página, com a data da
          última atualização no topo.
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default Privacidade;
