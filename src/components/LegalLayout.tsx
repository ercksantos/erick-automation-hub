import { useEffect, type ReactNode } from "react";
import { Bar } from "@/components/site/Bar";
import { Foot } from "@/components/site/Foot";

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export const LegalLayout = ({ title, updatedAt, children }: LegalLayoutProps) => {
  // Ao chegar pelo link do rodapé (ou pelo app da Meta), a página abre no topo ou na âncora pedida
  useEffect(() => {
    document.title = `${title} | Erick.AI`;
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [title]);

  return (
    <>
      <Bar />
      <main className="page" id="conteudo">
        <article className="page__in">
          <h1 className="page__title">{title}</h1>
          <p className="page__date">Última atualização: {updatedAt}</p>
          <div className="prose">{children}</div>
        </article>
      </main>
      <Foot />
    </>
  );
};

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export const LegalSection = ({ id, title, children }: LegalSectionProps) => (
  <section id={id}>
    <h2>{title}</h2>
    {children}
  </section>
);
