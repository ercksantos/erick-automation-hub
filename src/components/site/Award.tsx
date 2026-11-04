import { useRef } from "react";
import { PREMIO } from "@/content/site";
import { gsap, useGSAP } from "@/lib/motion";

// 1º lugar na Crazy AI Talents. A placa "AI Builder" chega com o troféu se
// desenhando, as faíscas acendem e um brilho atravessa a placa uma vez; com o
// mouse por cima ela inclina de leve. O boletim do júri sobe barra por barra.

const fmt = (n: number, dec: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// faísca de quatro pontas centrada em (x, y)
const spark = (x: number, y: number, r: number) =>
  `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`;

export const Award = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia(el);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = q(".trophy [data-draw]") as unknown as SVGPathElement[];
        lines.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(".plaque__sheen", { xPercent: -260, skewX: -14 });

        gsap
          .timeline({ scrollTrigger: { trigger: ".plaque", start: "top 78%", once: true } })
          .from(".plaque", { y: 36, autoAlpha: 0, duration: 0.8, ease: "power3.out" })
          .to(lines, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.07 }, 0.2)
          .from(".trophy__star", { scale: 0, transformOrigin: "50% 50%", duration: 0.55, ease: "back.out(2.6)" }, 0.95)
          .from(".spark", { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)", stagger: 0.08 }, 1.1)
          .from(".plaque__text > *", { y: 10, autoAlpha: 0, duration: 0.5, ease: "power2.out", stagger: 0.07 }, 0.85)
          .to(".plaque__sheen", { xPercent: 320, duration: 1.2, ease: "power2.inOut" }, 1.35);

        // boletim: as barras crescem e as notas contam até o valor
        const score = { trigger: ".score", start: "top 82%", once: true };
        gsap.from(".score__bar span", { scaleX: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, scrollTrigger: score });
        q("[data-to]").forEach((n: HTMLElement, i: number) => {
          const to = Number(n.dataset.to);
          const dec = Number(n.dataset.dec || 1);
          const v = { n: 0 };
          n.textContent = fmt(0, dec);
          gsap.to(v, {
            n: to,
            duration: 1.1,
            delay: i === 0 ? 0 : 0.12 * (i - 1),
            ease: "power2.out",
            scrollTrigger: score,
            onUpdate: () => (n.textContent = fmt(v.n, dec)),
            onComplete: () => (n.textContent = fmt(to, dec)),
          });
        });
      });

      // inclinação da placa: só com mouse de verdade
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const plaque = q(".plaque")[0] as HTMLElement;
        gsap.set(plaque, { transformPerspective: 900 });
        const rx = gsap.quickTo(plaque, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(plaque, "rotationY", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = plaque.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        plaque.addEventListener("pointermove", move);
        plaque.addEventListener("pointerleave", leave);
        return () => {
          plaque.removeEventListener("pointermove", move);
          plaque.removeEventListener("pointerleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="sec award" id="premio" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <h2 className="sec__title">
            {PREMIO.colocacao} na {PREMIO.evento}.
          </h2>
          <p className="sec__lede">
            A {PREMIO.evento}, competição de agentes de IA do {PREMIO.organizador}, procurou na primeira edição quem constrói os
            melhores agentes de vendas do Brasil. Eu construí os agentes e as automações da estrutura que ficou em primeiro lugar.
          </p>
        </header>

        <div className="award__grid">
          <figure className="plaque" aria-label={`Placa ${PREMIO.placa}, ${PREMIO.colocacao} na ${PREMIO.evento}`}>
            <span className="plaque__sheen" aria-hidden="true" />
            <svg className="trophy" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
              <path data-draw d="M50 30H110V66C110 92 96 108 80 108C64 108 50 92 50 66Z" />
              <path data-draw d="M50 40H38C33 40 30 43 30 48C30 66 40 78 54 82" />
              <path data-draw d="M110 40H122C127 40 130 43 130 48C130 66 120 78 106 82" />
              <path data-draw d="M74 108V124M86 108V124" />
              <path data-draw d="M66 124H94V132H66Z" />
              <path data-draw d="M56 132H104C106 132 108 134 108 136V146H52V136C52 134 54 132 56 132Z" />
              <path
                className="trophy__star"
                d="M80 51L83.23 59.55L92.36 59.98L85.23 65.7L87.64 74.52L80 69.5L72.36 74.52L74.77 65.7L67.64 59.98L76.77 59.55Z"
              />
              <path className="spark" d={spark(22, 24, 7)} />
              <path className="spark" d={spark(140, 18, 5)} />
              <path className="spark" d={spark(146, 92, 6)} />
              <path className="spark" d={spark(16, 100, 4.5)} />
            </svg>
            <figcaption className="plaque__text">
              <span className="plaque__title">{PREMIO.placa}</span>
              <span className="plaque__place">{PREMIO.colocacao}</span>
              <span className="plaque__event">
                {PREMIO.evento}, {PREMIO.edicao}
              </span>
            </figcaption>
          </figure>

          <div className="award__body">
            <p className="award__lead">
              Os agentes atenderam clientes reais por 20 dias. O júri avaliou complexidade, prompt e base de conhecimento,
              criatividade e eficiência de tokens, e cada alucinação tirava ponto.
            </p>
            <ul className="job__items award__built">
              {PREMIO.feito.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <div className="score">
              <div className="score__head">
                <b className="score__avg">
                  <span data-to={PREMIO.media} data-dec="1">
                    {fmt(PREMIO.media, 1)}
                  </span>
                  <small>de 3</small>
                </b>
                <span>média do júri na fase de construção</span>
              </div>
              <ul className="score__list">
                {PREMIO.criterios.map((c) => {
                  const dec = Number.isInteger(c.nota * 10) ? 1 : 2;
                  return (
                    <li key={c.nome}>
                      <div className="score__row">
                        <span>
                          {c.nome}
                          <small>peso {c.peso}</small>
                        </span>
                        <b data-to={c.nota} data-dec={dec}>
                          {fmt(c.nota, dec)}
                        </b>
                      </div>
                      <i className="score__bar" aria-hidden="true">
                        <span style={{ transform: `scaleX(${c.nota / 3})` }} />
                      </i>
                    </li>
                  );
                })}
              </ul>
              <p className="score__note">
                Escala de 0 a 3, resultado oficial da{" "}
                <a href={PREMIO.url} target="_blank" rel="noopener noreferrer">
                  {PREMIO.evento}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
