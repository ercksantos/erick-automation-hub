import { useRef } from "react";
import { DIFERENCIAIS, FRASE, FRASE_PERGUNTA } from "@/content/site";
import { gsap, prefersReduced, useGSAP } from "@/lib/motion";
import { CheckIcon, NodeMark } from "./NodeMark";
import { SecTag } from "./SecTag";

// O princípio, como no hero: uma pergunta e a resposta chegando em streaming,
// palavra por palavra, numa janela de terminal. A segunda frase vem em âmbar.

const FRASES = FRASE.split(/(?<=\.)\s+/);

export const Quote = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      const q = gsap.utils.selector(root.current);
      const toks = q(".quote__text .tok") as HTMLElement[];
      const head = (i: number) => toks.forEach((t, j) => t.classList.toggle("is-head", j === i));
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".term", start: "top 68%", once: true } });
      tl.from(".term__ask", { autoAlpha: 0, y: 8, duration: 0.4, ease: "power2.out" });
      // ritmo de streaming: rápido, com pequenas pausas irregulares e uma pausa maior no ponto
      let at = 0.75;
      toks.forEach((t, i) => {
        tl.call(
          () => {
            t.classList.add("is-on");
            head(i);
          },
          [],
          at
        );
        at += t.textContent!.endsWith(".") ? 0.32 : 0.06 + ((i * 37) % 5) * 0.012;
      });
      tl.call(() => head(-1), [], at + 2.6).from(
        ".quote__after, .verdicts li",
        { autoAlpha: 0, y: 16, duration: 0.7, ease: "power3.out", stagger: 0.1 },
        at - 0.1
      );
    },
    { scope: root }
  );

  return (
    <section className="sec quote" id="frase" ref={root}>
      <div className="wrap">
        <SecTag id="frase" />
        <div className="term">
          <div className="term__bar" aria-hidden="true">
            <span className="term__name">
              <NodeMark />
              erick.ai
            </span>
            <span>principio.md</span>
          </div>
          <div className="term__body">
            <p className="term__ask" aria-hidden="true">
              <span className="hero__prompt">›</span> {FRASE_PERGUNTA}
            </p>
            <p className="quote__text" aria-label={FRASE}>
              {FRASES.map((frase, k) => (
                <span className={k > 0 ? "quote__hl" : undefined} aria-hidden="true" key={frase}>
                  {frase.split(" ").map((w, i) => (
                    <span key={i}>
                      <span className="tok">{w}</span>{" "}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>
        <p className="quote__after">
          Por isso eu começo pelo processo, não pela ferramenta. O agente só é bom quando alguém ensinou a ele o que a sua empresa
          faz, cobra e promete.
        </p>
        <ul className="verdicts">
          {DIFERENCIAIS.map((d) => (
            <li key={d.titulo}>
              <h3>
                <i aria-hidden="true">
                  <CheckIcon color="#12161c" />
                </i>
                {d.titulo}
              </h3>
              <p>{d.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
