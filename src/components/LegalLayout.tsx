import { useEffect, type ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export const LegalLayout = ({ title, updatedAt, children }: LegalLayoutProps) => {
  // Ao chegar pelo link do rodapé, a página abre no topo (ou na âncora pedida)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = hash ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 md:pt-32 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-10">Última atualização: {updatedAt}</p>
          <div className="space-y-8 text-muted-foreground leading-relaxed">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

interface LegalSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export const LegalSection = ({ id, title, children }: LegalSectionProps) => (
  <section id={id} className="space-y-3 scroll-mt-28">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    {children}
  </section>
);
