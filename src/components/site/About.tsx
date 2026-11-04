import { FERRAMENTAS, SEGMENTOS, SITE } from "@/content/site";

export const About = () => (
  <section className="sec about" id="sobre">
    <div className="wrap about__grid">
      <h2 className="about__lead">Sou o Erick. Eu construo, do zero, o que a sua empresa usa para atender e vender.</h2>
      <div className="about__body">
        <p>
          Sou desenvolvedor e trabalho com <strong>agentes de IA no WhatsApp, CRMs e sistemas sob medida</strong> para pequenas e
          médias empresas de serviço.
        </p>
        <p>
          Não revendo plataforma pronta. Antes de falar de tecnologia, eu quero entender quem atende, em que momento o lead esfria e
          onde a planilha trava. O sistema nasce em cima disso, e você sabe o que ele faz e o que ele não faz.
        </p>
        <p>
          Também mostro os bastidores no Instagram: o que estou construindo, o que deu errado e como as coisas funcionam por dentro.
        </p>
        <dl className="about__facts">
          <div>
            <dt>Já construí agentes para</dt>
            <dd>{SEGMENTOS.join(", ").replace(/, ([^,]*)$/, " e $1")}.</dd>
          </div>
          <div>
            <dt>Com o que eu trabalho</dt>
            <dd>{FERRAMENTAS.join(", ")}.</dd>
          </div>
          <div>
            <dt>Empresa</dt>
            <dd>{SITE.marca}, com CNPJ próprio e nota fiscal de serviço.</dd>
          </div>
          <div>
            <dt>Bastidores</dt>
            <dd>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer">
                {SITE.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
);
