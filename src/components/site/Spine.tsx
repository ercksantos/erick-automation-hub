import { useRef } from "react";
import { SECOES } from "@/content/site";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/motion";

// O fio da página: desce pela lateral, do primeiro ao último selo de seção. Um pacote
// anda com a rolagem na altura do meio da tela e cada seção vira um nó que passa de
// "aguardando" para "rodando" e depois "ok" quando o pacote chega nela.
// Abaixo de 1200 px o fio some e ficam só os selos, que mudam de estado do mesmo jeito.

const TXT = { wait: "aguardando", run: "rodando", ok: "ok" } as const;
type Estado = keyof typeof TXT;

export const Spine = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current!;
    const main = el.parentElement!;
    const tags = gsap.utils.toArray<HTMLElement>("[data-tag]", main);
    const dots = gsap.utils.toArray<HTMLElement>(".spine__node", el);
    const fill = el.querySelector(".spine__fill") as HTMLElement;
    const packet = el.querySelector(".spine__packet") as HTMLElement;
    if (!tags.length) return;

    const set = (i: number, st: Estado) => {
      const t = tags[i];
      if (t.dataset.state === "ok") return;
      t.dataset.state = st;
      t.querySelector(".tag__txt")!.textContent = TXT[st];
      dots[i]?.setAttribute("data-state", st);
    };

    // posição de cada selo dentro do main, medida a cada refresh
    let ys: number[] = [];
    let top = 0;
    const measure = () => {
      top = main.getBoundingClientRect().top + window.scrollY;
      ys = tags.map((t) => {
        const r = t.getBoundingClientRect();
        return r.top + window.scrollY - top + r.height / 2;
      });
      const y0 = ys[0];
      gsap.set(el, { top: y0, height: ys[ys.length - 1] - y0 });
      dots.forEach((d, i) => gsap.set(d, { y: (ys[i] ?? y0) - y0 }));
    };

    if (prefersReduced()) {
      measure();
      tags.forEach((_, i) => set(i, "ok"));
      gsap.set(fill, { scaleY: 1 });
      ScrollTrigger.addEventListener("refresh", measure);
      return () => ScrollTrigger.removeEventListener("refresh", measure);
    }

    const fillTo = gsap.quickTo(fill, "scaleY", { duration: 0.35, ease: "power3" });
    const packetTo = gsap.quickTo(packet, "y", { duration: 0.35, ease: "power3" });
    ScrollTrigger.create({
      start: () => {
        measure();
        return top + ys[0] - window.innerHeight * 0.5;
      },
      end: () => top + ys[ys.length - 1] - window.innerHeight * 0.5,
      onUpdate: (s) => {
        fillTo(s.progress);
        packetTo(s.progress * (ys[ys.length - 1] - ys[0]));
      },
      onToggle: (s) => gsap.to(packet, { autoAlpha: s.isActive ? 1 : 0, duration: 0.25 }),
    });

    // cada seção: entra na tela e começa a rodar; o meio da tela é o pacote chegando
    tags.forEach((t, i) => {
      ScrollTrigger.create({ trigger: t, start: "top 95%", once: true, onEnter: () => set(i, "run") });
      ScrollTrigger.create({ trigger: t, start: "center 52%", once: true, onEnter: () => set(i, "ok") });
    });
  });

  return (
    <div className="spine" ref={root} aria-hidden="true">
      <span className="spine__fill" />
      {SECOES.map((s) => (
        <i className="spine__node" key={s.id} />
      ))}
      <span className="spine__packet" />
    </div>
  );
};
