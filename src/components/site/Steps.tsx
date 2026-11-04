import { useRef } from "react";
import { PASSOS } from "@/content/site";
import { MEDIA, gsap, useGSAP } from "@/lib/motion";

// Como eu trabalho: é uma sequência de verdade, então tem número. O fio acompanha
// a leitura (scrub) e cada passo acende quando o fio chega nele.
export const Steps = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const steps = q(".step") as HTMLElement[];
      const mm = gsap.matchMedia(el);
      mm.add(MEDIA, (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) {
          steps.forEach((s) => s.classList.add("is-on"));
          return;
        }
        const axis = desktop ? "scaleX" : "scaleY";
        const rail = q(".rail")[0] as HTMLElement;
        // fração do fio em que cada número fica
        const marks = () => {
          const r = rail.getBoundingClientRect();
          return steps.map((s) => {
            const b = s.querySelector(".step__num")!.getBoundingClientRect();
            return desktop ? (b.left + b.width / 2 - r.left) / r.width : (b.top + b.height / 2 - r.top) / r.height;
          });
        };
        let at = marks();
        gsap.fromTo(
          ".rail__fill",
          { [axis]: 0 },
          {
            [axis]: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".steps",
              start: desktop ? "top 70%" : "top 75%",
              end: desktop ? "bottom 55%" : "bottom 60%",
              scrub: 0.6,
              onRefresh: () => (at = marks()),
              onUpdate: (s) => steps.forEach((st, i) => st.classList.toggle("is-on", s.progress >= at[i] - 0.01)),
            },
          }
        );
        gsap.from(".step h3, .step p", {
          autoAlpha: 0,
          y: 14,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".steps", start: "top 80%", once: true },
        });
        return () => steps.forEach((s) => s.classList.remove("is-on"));
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="sec" id="como-trabalho" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <h2 className="sec__title">Primeiro o processo. Depois a ferramenta.</h2>
          <p className="sec__lede">
            Você vê funcionando antes de decidir, e eu continuo por perto depois que tudo está no ar.
          </p>
        </header>
        <div className="steps__body">
          <div className="rail" aria-hidden="true">
            <span className="rail__fill" />
          </div>
          <ol className="steps">
            {PASSOS.map((p, i) => (
              <li className="step" key={p.titulo}>
                <span className="step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>
                  <span className="visually-hidden">Passo {i + 1}: </span>
                  {p.titulo}
                </h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
