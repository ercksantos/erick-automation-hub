import { Bar } from "@/components/site/Bar";
import { Hero } from "@/components/site/Hero";
import { Chain } from "@/components/site/Chain";
import { Inside } from "@/components/site/Inside";
import { Award } from "@/components/site/Award";
import { Quote } from "@/components/site/Quote";
import { Work } from "@/components/site/Work";
import { Steps } from "@/components/site/Steps";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Foot } from "@/components/site/Foot";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { Spine } from "@/components/site/Spine";

const Index = () => {
  // roda depois dos efeitos das seções: todos os ScrollTriggers já existem aqui
  useGSAP(() => {
    document.title = "Erick Santos | Agentes de IA, CRM e sistemas sob medida";
    const hash = window.location.hash.slice(1);
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    let alive = true;
    Promise.race([fonts, wait(1200)]).then(() => {
      if (!alive) return;
      ScrollTrigger.refresh();
      // chegou de outra página por um link do menu (/#secao)
      if (hash) scrollToId(hash, { instant: true });
    });
    return () => {
      alive = false;
    };
  });

  return (
    <>
      <Bar home />
      <main id="conteudo">
        <Hero />
        <Spine />
        <Chain />
        <Inside />
        <Award />
        <Quote />
        <Work />
        <Steps />
        <About />
        <Contact />
      </main>
      <Foot />
    </>
  );
};

export default Index;
