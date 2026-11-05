import { useRef, useState } from "react";
import { PROJETOS, waLink, type Projeto } from "@/content/site";
import { gsap, ScrollTrigger, prefersReduced, useGSAP } from "@/lib/motion";
import { WhatsIcon } from "./NodeMark";
import { SecTag } from "./SecTag";

// Lista de projetos: um aberto por vez, a altura anima em resposta ao clique.
export const Work = () => {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const toggle = contextSafe((slug: string) => {
    const next = open === slug ? null : slug;
    const reduce = prefersReduced();
    const panels = root.current!.querySelectorAll<HTMLElement>(".job__panel");
    panels.forEach((p) => {
      const isNext = p.dataset.slug === next;
      const isOpen = p.dataset.slug === open;
      if (!isNext && !isOpen) return;
      gsap.killTweensOf(p);
      if (isNext) {
        gsap.fromTo(
          p,
          { height: p.offsetHeight },
          { height: "auto", duration: reduce ? 0 : 0.6, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() }
        );
        if (!reduce) gsap.fromTo(p.querySelector(".job__in"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" });
      } else {
        p.querySelectorAll("video").forEach((v) => v.pause());
        gsap.to(p, { height: 0, duration: reduce ? 0 : 0.5, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
      }
    });
    setOpen(next);
  });

  return (
    <section className="sec work" id="projetos" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <SecTag id="projetos" />
          <h2 className="sec__title">O que já está rodando.</h2>
          <p className="sec__lede">Três projetos feitos para empresas e três produtos meus. Abra cada um para ver o que ele faz.</p>
        </header>
        <ul className="work__list">
          {PROJETOS.map((p) => (
            <Job key={p.slug} p={p} isOpen={open === p.slug} onToggle={() => toggle(p.slug)} />
          ))}
        </ul>
        <p className="work__note">Os vídeos mostram as telas de demonstração de cada projeto.</p>
      </div>
    </section>
  );
};

const Job = ({ p, isOpen, onToggle }: { p: Projeto; isOpen: boolean; onToggle: () => void }) => {
  const [vid, setVid] = useState(0);
  const panelId = `projeto-${p.slug}`;
  return (
    <li className={`job${isOpen ? " is-open" : ""}`}>
      <button type="button" className="job__row" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}>
        <span>
          <span className="job__kind">{p.tipo}</span>
          <span className="job__title">{p.titulo}</span>
        </span>
        {p.status ? (
          <span className="job__status" data-s={p.status}>
            {p.status}
          </span>
        ) : (
          <span />
        )}
        <span className="job__toggle" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="job__panel" id={panelId} data-slug={p.slug} role="region" aria-label={p.titulo}>
        <div className={`job__in${p.videos ? "" : " job__in--text"}`}>
          {p.videos && (
            <div className="job__media">
              {isOpen && (
                <video
                  key={p.videos[vid].src}
                  src={p.videos[vid].src}
                  poster={p.thumb}
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
              {!isOpen && p.thumb && <img src={p.thumb} alt="" loading="lazy" />}
              {p.videos.length > 1 && (
                <div className="job__tabs">
                  {p.videos.map((v, i) => (
                    <button key={v.src} type="button" className={`chip${i === vid ? " is-on" : ""}`} onClick={() => setVid(i)}>
                      {v.rotulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <p className="job__summary">{p.resumo}</p>
            <ul className="job__items">
              {p.itens.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            {p.ferramentas && (
              <p className="job__tools">
                <b>Ferramentas:</b> {p.ferramentas.join(", ")}
              </p>
            )}
            {p.link ? (
              <a className="btn btn--ghost" href={p.link.url} target="_blank" rel="noopener noreferrer">
                {p.link.rotulo}
              </a>
            ) : (
              <a
                className="btn btn--amber"
                href={waLink(`Olá, Erick! Vi o projeto "${p.titulo}" no seu site e quero algo parecido na minha empresa.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsIcon />
                Quero algo parecido
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
