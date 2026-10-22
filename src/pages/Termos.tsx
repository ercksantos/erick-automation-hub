import { Link } from "react-router-dom";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { EMPRESA } from "@/lib/empresa";

const Termos = () => {
  return (
    <LegalLayout title="Termos de Uso" updatedAt="22 de outubro de 2026">
      <p>
        Estes termos regulam o uso do site da Erick.AI, das demonstrações de automação e dos nossos
        canais de atendimento, incluindo o WhatsApp. Ao usar qualquer um deles, você concorda com
        estes termos e com a nossa{" "}
        <Link to="/privacidade" className="text-primary hover:underline">
          Política de Privacidade
        </Link>
        .
      </p>

      <LegalSection title="1. Quem somos">
        <p>
          A Erick.AI é a marca de {EMPRESA.razaoSocial}, CNPJ {EMPRESA.cnpj}, com sede em{" "}
          {EMPRESA.endereco}. Contato:{" "}
          <a href={`mailto:${EMPRESA.email}`} className="text-primary hover:underline">
            {EMPRESA.email}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. O que oferecemos">
        <p>
          Desenvolvemos automações, agentes de inteligência artificial para atendimento, integrações
          entre sistemas e software sob encomenda. O site apresenta nossos serviços e permite testar
          demonstrações. A contratação de qualquer serviço depende de proposta e contrato específicos,
          que prevalecem sobre estes termos no que tratarem de forma diferente.
        </p>
      </LegalSection>

      <LegalSection title="3. Demonstrações e respostas geradas por IA">
        <p>
          As demonstrações e o atendimento automatizado usam inteligência artificial. As respostas
          podem conter erros ou imprecisões e não substituem orientação profissional (jurídica,
          médica, contábil ou financeira). As demonstrações são exemplos ilustrativos e podem ser
          alteradas ou retiradas do ar a qualquer momento.
        </p>
      </LegalSection>

      <LegalSection title="4. Atendimento pelo WhatsApp">
        <p>
          Nosso atendimento pelo WhatsApp pode ser feito por um assistente de IA, com possibilidade de
          transferência para atendimento humano. Você pode parar de receber mensagens a qualquer
          momento respondendo <strong className="text-foreground">SAIR</strong>. O uso do WhatsApp
          também está sujeito aos termos do próprio WhatsApp.
        </p>
      </LegalSection>

      <LegalSection title="5. Uso adequado">
        <p>Ao usar o site e os canais, você se compromete a não:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros;</li>
          <li>enviar dados pessoais de terceiros sem autorização, ou dados sensíveis;</li>
          <li>
            tentar sobrecarregar, invadir ou explorar falhas do site, das demonstrações ou dos
            sistemas de automação;
          </li>
          <li>usar as demonstrações para fins automatizados, comerciais ou de spam.</li>
        </ul>
        <p>Podemos bloquear o acesso de quem descumprir estas regras.</p>
      </LegalSection>

      <LegalSection title="6. Propriedade intelectual">
        <p>
          A marca Erick.AI, os textos, o design e o código deste site e das demonstrações pertencem à
          {" "}{EMPRESA.razaoSocial} ou são usados com autorização. Não é permitido copiar ou
          reproduzir esse conteúdo sem autorização prévia por escrito.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitação de responsabilidade">
        <p>
          O site e as demonstrações são oferecidos "no estado em que se encontram". Não garantimos
          funcionamento ininterrupto ou livre de erros, e não respondemos por decisões tomadas apenas
          com base em respostas geradas pelas demonstrações. Também não respondemos pelo conteúdo de
          sites de terceiros acessados por links publicados aqui.
        </p>
      </LegalSection>

      <LegalSection title="8. Alterações">
        <p>
          Podemos atualizar estes termos. A versão vigente fica sempre nesta página, com a data da
          última atualização no topo.
        </p>
      </LegalSection>

      <LegalSection title="9. Lei aplicável e foro">
        <p>
          Estes termos seguem a legislação brasileira. Fica eleito o foro da comarca de Curitiba/PR,
          ressalvado o direito do consumidor de propor ação no foro do seu domicílio.
        </p>
      </LegalSection>
    </LegalLayout>
  );
};

export default Termos;
