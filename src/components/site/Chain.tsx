import { useRef } from "react";
import { SERVICOS } from "@/content/site";
import { MEDIA, gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { FLOW_ICONS } from "./FlowIcons";
import { SecTag } from "./SecTag";

// Os quatro serviços como nós de um fluxo: cartões ligados por um fio que passa
// por trás deles. Quando a seção chega, o fio se desenha e os nós aparecem; enquanto
// ela está na tela, um pacote corre o fio e cada nó acende quando o pacote o atravessa.
export const Chain = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const list = q(".chain__list")[0] as HTMLElement;
      const cards = q(".link") as HTMLElement[];
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
          .fromTo(".rail__fill", { [axis]: 0 }, { [axis]: 1, duration: 1.2, ease: "power2.inOut" })
          .from(cards, { autoAlpha: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.1);

        // trecho do fio que cada cartão cobre, de 0 a 1: o nó acende enquanto o pacote está dentro dele
        const spans = () => {
          const r = rail.getBoundingClientRect();
          const len = desktop ? r.width : r.height;
          return cards.map((c) => {
            const b = c.getBoundingClientRect();
            const a = desktop ? b.left - r.left : b.top - r.top;
            const z = desktop ? b.right - r.left : b.bottom - r.top;
            return [Math.max(0, a / len), Math.min(1, z / len)];
          });
        };
        const prop = desktop ? "xPercent" : "yPercent";
        const DUR = 3.6;
        const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.8, paused: true });
        const build = () => {
          loop.clear();
          gsap.set(track, { [prop]: 0 });
          loop
            .set(pulse, { autoAlpha: 1 })
            .fromTo(track, { [prop]: 0 }, { [prop]: 100, duration: DUR, ease: "none" }, 0)
            .to(pulse, { autoAlpha: 0, duration: 0.25 }, DUR - 0.25);
          spans().forEach(([a, z], i) => {
            loop.call(() => cards[i].classList.add("is-flash"), [], a * DUR);
            loop.call(() => cards[i].classList.remove("is-flash"), [], Math.min(DUR, z * DUR + 0.25));
          });
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
        return () => cards.forEach((c) => c.classList.remove("is-flash"));
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="sec chain" id="servicos" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <SecTag id="servicos" />
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
                <div className="link__head">
                  <span className="link__icon" aria-hidden="true">
                    {FLOW_ICONS[s.id]}
                  </span>
                  <span className="link__ids">
                    <span className="link__verb">{s.verbo}</span>
                    <h3 className="link__name">{s.nome}</h3>
                  </span>
                </div>
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
