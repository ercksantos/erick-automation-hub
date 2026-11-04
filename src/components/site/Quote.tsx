import { useRef } from "react";
import { DIFERENCIAIS, FRASE } from "@/content/site";
import { gsap, SplitText, useGSAP } from "@/lib/motion";

// O palco âmbar abre enquanto a seção chega e a frase acende palavra por palavra.
export const Quote = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(root.current!);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".quote__bg",
          { clipPath: "inset(7% 4% 7% 4% round 40px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
          }
        );
        const split = SplitText.create(".quote__text", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ".quote__text", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );
        gsap.from(".verdicts li", {
          y: 18,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".verdicts", start: "top 85%", once: true },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="quote" id="frase" ref={root}>
      <div className="quote__bg" aria-hidden="true" />
      <div className="wrap">
        <p className="quote__text">{FRASE}</p>
        <p className="quote__after">
          Por isso eu começo pelo processo, não pela ferramenta. O agente só é bom quando alguém ensinou a ele o que a sua empresa
          faz, cobra e promete.
        </p>
        <ul className="verdicts">
          {DIFERENCIAIS.map((d) => (
            <li key={d.titulo}>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
