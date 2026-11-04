import { useRef } from "react";
import { SERVICOS } from "@/content/site";
import { MEDIA, gsap, ScrollTrigger, useGSAP } from "@/lib/motion";

// Os quatro serviços como uma corrente: o fio se desenha quando a seção chega e,
// enquanto ela está na tela, um pulso percorre o fio e acende cada nó por onde passa.
export const Chain = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const list = q(".chain__list")[0] as HTMLElement;
      const nodes = q(".node") as HTMLElement[];
      const pulse = q(".rail__pulse")[0];
      const track = q(".rail__track")[0];
      const rail = q(".rail")[0] as HTMLElement;

      const mm = gsap.matchMedia(el);
      mm.add(MEDIA, (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) return;
        const axis = desktop ? "scaleX" : "scaleY";

        gsap
          .timeline({ scrollTrigger: { trigger: list, start: "top 78%", once: true } })
          .fromTo(".rail__fill", { [axis]: 0 }, { [axis]: 1, duration: 1.3, ease: "power2.inOut" })
          .from(nodes, { scale: 0, duration: 0.5, ease: "back.out(2.2)", stagger: 0.18 }, 0.2)
          .from(".link__verb, .link__name, .link__does, .link__facts", { autoAlpha: 0, y: 14, duration: 0.7, ease: "power3.out", stagger: 0.04 }, 0.35);

        // posição de cada nó no fio, de 0 a 1, para acender na hora em que o pulso passa
        const at = () => {
          const r = rail.getBoundingClientRect();
          return nodes.map((n) => {
            const b = n.getBoundingClientRect();
            return desktop ? (b.left + b.width / 2 - r.left) / r.width : (b.top + b.height / 2 - r.top) / r.height;
          });
        };
        const prop = desktop ? "xPercent" : "yPercent";
        const flash = (n: HTMLElement) => {
          n.classList.add("is-flash");
          gsap.delayedCall(0.35, () => n.classList.remove("is-flash"));
        };
        const DUR = 3.2;
        const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.9, paused: true });
        const build = () => {
          loop.clear();
          gsap.set(track, { [prop]: 0 });
          loop
            .set(pulse, { autoAlpha: 1 })
            .fromTo(track, { [prop]: 0 }, { [prop]: 100, duration: DUR, ease: "none" }, 0)
            .to(pulse, { autoAlpha: 0, duration: 0.25 }, DUR - 0.25);
          at().forEach((p, i) => loop.call(() => flash(nodes[i]), [], Math.max(0, p) * DUR));
        };
        build();
        ScrollTrigger.create({
          trigger: list,
          start: "top 80%",
          end: "bottom 10%",
          onToggle: (s) => (s.isActive ? loop.play() : loop.pause()),
          onRefresh: () => {
            const playing = loop.isActive();
            build();
            if (playing) loop.play(0);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="sec chain" id="servicos" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <h2 className="sec__title">Quatro peças que conversam entre si.</h2>
          <p className="sec__lede">
            Dá para começar por uma e ligar as outras depois. Como eu construo a corrente inteira, o lead que chega pelo site é o
            mesmo que o agente atende e que aparece no CRM.
          </p>
        </header>

        <div className="chain__body">
          <div className="rail" aria-hidden="true">
            <span className="rail__fill" />
            <span className="rail__track">
              <i className="rail__pulse" />
            </span>
          </div>
          <ol className="chain__list">
          {SERVICOS.map((s) => (
            <li className="link" key={s.id}>
              <span className="node" aria-hidden="true" />
              <p className="link__verb">{s.verbo}</p>
              <h3 className="link__name">{s.nome}</h3>
              <p className="link__does">{s.faz}</p>
              <dl className="link__facts">
                <div>
                  <dt>Resolve</dt>
                  <dd>{s.resolve}</dd>
                </div>
                <div className="link__not">
                  <dt>Não faz</dt>
                  <dd>{s.naoFaz}</dd>
                </div>
              </dl>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
