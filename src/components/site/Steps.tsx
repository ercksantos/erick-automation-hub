import { useRef } from "react";
import { PASSOS } from "@/content/site";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/motion";
import { CheckIcon, NodeMark } from "./NodeMark";
import { SecTag } from "./SecTag";

// Como eu trabalho, como uma execução de pipeline: cada etapa está esperando,
// começa a rodar quando chega na tela e termina com check. O cabeçalho conta.

export const Steps = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const steps = q(".pstep") as HTMLElement[];
      const count = q("[data-count]")[0] as HTMLElement;
      const pipe = q(".pipe")[0] as HTMLElement;
      let done = 0;
      const ok = (s: HTMLElement) => {
        s.dataset.state = "ok";
        done += 1;
        count.textContent = String(done);
        if (done === steps.length) pipe.classList.add("is-done");
      };

      if (prefersReduced()) {
        steps.forEach(ok);
        return;
      }
      // uma etapa só começa depois que a anterior termina: com rolagem rápida, elas rodam em fila
      let fila = Promise.resolve();
      const roda = (s: HTMLElement) =>
        new Promise<void>((res) => {
          s.dataset.state = "run";
          gsap.delayedCall(0.9, () => {
            ok(s);
            res();
          });
        });
      steps.forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top 74%",
          once: true,
          onEnter: () => {
            fila = fila.then(() => roda(s));
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="sec steps-sec" id="como-trabalho" ref={root}>
      <div className="wrap steps__grid">
        <header className="sec__head steps__head">
          <SecTag id="como-trabalho" />
          <h2 className="sec__title">Primeiro o processo. Depois a ferramenta.</h2>
          <p className="sec__lede">Você vê funcionando antes de decidir, e eu continuo por perto depois que tudo está no ar.</p>
        </header>

        <div className="pipe">
          <div className="pipe__bar" aria-hidden="true">
            <span className="pipe__name">
              <NodeMark />
              seu-projeto / do diagnóstico ao ar
            </span>
            <span className="pipe__state">
              <b data-count>0</b> de {PASSOS.length} etapas
            </span>
          </div>
          <ol className="pipe__list">
            {PASSOS.map((p, i) => (
              <li className="pstep" data-state="wait" key={p.titulo}>
                <span className="pstep__icon" aria-hidden="true">
                  <CheckIcon color="#12161c" />
                </span>
                <div className="pstep__txt">
                  <h3>
                    <span className="pstep__n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="visually-hidden">Passo {i + 1}: </span>
                    {p.titulo}
                  </h3>
                  <p>{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
