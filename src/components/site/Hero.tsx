import { useRef, type CSSProperties, type ReactNode } from "react";
import { HERO_EXECUCOES, HERO_FIOS, HERO_NOS, HERO_PERGUNTA, PREMIO, waLink } from "@/content/site";
import { Draggable, FINE_POINTER, gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { CheckIcon, NodeMark, TrophyIcon, WhatsIcon } from "./NodeMark";

// O hero é um fluxo de automação rodando de verdade na tela: o título chega como
// resposta de IA em streaming, e ao lado um canvas monta os nós, liga os fios e
// executa atendimentos em loop (mensagem, roteador, agente, CRM), com o log
// escrevendo cada passo. Com mouse dá para arrastar os nós e os fios acompanham.

const TITULO = [
  ["Aten", "de."],
  ["Ven", "de."],
  ["Organ", "iza."],
];
// momento em que cada pedaço do título aparece, com o ritmo irregular de um streaming
const TOKEN_AT = [0, 0.07, 0.19, 0.25, 0.38, 0.47];

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONES: Record<string, ReactNode> = {
  whatsapp: <WhatsIcon />,
  roteador: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="5" cy="12" r="2" />
      <path d="M7 12h4M11 12c2.5 0 3-6 6-6h2M11 12h8M11 12c2.5 0 3 6 6 6h2" />
    </svg>
  ),
  agenda: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h3" />
    </svg>
  ),
  duvidas: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M5 4.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
      <path d="M12 8l.9 1.9 1.9.9-1.9.9L12 13.6l-.9-1.9-1.9-.9 1.9-.9Z" />
    </svg>
  ),
  equipe: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </svg>
  ),
  crm: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="4" height="7" rx="1.5" />
    </svg>
  ),
};
const nomeDo = (id: string) => (HERO_NOS.find((n) => n.id === id)?.nome ?? id).toLowerCase();

type Fio = { from: string; to: string; base: SVGPathElement; lit: SVGPathElement };

export const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const canvas = q(".flow__canvas")[0] as HTMLElement;
      const nodeEls = q(".fnode") as HTMLElement[];
      const nodes = new Map(nodeEls.map((n) => [n.dataset.node!, n]));
      const fios: Fio[] = (q(".flow__wires [data-from]") as unknown as SVGGElement[]).map((g) => ({
        from: g.dataset.from!,
        to: g.dataset.to!,
        base: g.querySelector(".wire") as SVGPathElement,
        lit: g.querySelector(".wire__lit") as SVGPathElement,
      }));
      const fio = (a: string, b: string) => fios.find((f) => f.from === a && f.to === b)!;
      const packet = q(".packet")[0] as unknown as SVGGElement;
      const msg = q(".flow__msg")[0] as HTMLElement;
      const msgText = msg.querySelector("p")!;
      const msgTime = msg.querySelector("time")!;
      const lines = q(".flow__lines")[0] as HTMLOListElement;
      const reduce = prefersReduced();

      /* ---------- geometria: fios saem da porta direita e entram pela esquerda ---------- */
      const center = (n: HTMLElement) => {
        const s = n.offsetWidth;
        return {
          x: n.offsetLeft + s / 2 + Number(gsap.getProperty(n, "x")),
          y: n.offsetTop + s / 2 + Number(gsap.getProperty(n, "y")),
          s,
        };
      };
      const draw = () => {
        fios.forEach((f) => {
          const a = center(nodes.get(f.from)!);
          const b = center(nodes.get(f.to)!);
          const x1 = a.x + a.s / 2 + 4;
          const x2 = b.x - b.s / 2 - 4;
          const dx = Math.max(28, Math.abs(x2 - x1) * 0.55);
          const d = `M${x1} ${a.y} C${x1 + dx} ${a.y} ${x2 - dx} ${b.y} ${x2} ${b.y}`;
          f.base.setAttribute("d", d);
          f.lit.setAttribute("d", d);
        });
        // o balão da mensagem fica preso em cima do gatilho
        const t = center(nodes.get("whatsapp")!);
        msg.style.left = `${Math.max(8, t.x - t.s / 2 - 6)}px`;
        msg.style.bottom = `${canvas.clientHeight - (t.y - t.s / 2 - 14)}px`;
      };

      /* ---------- log de execução ---------- */
      const log = (hora: string, quem: string, texto: string, tipo = "") => {
        const li = document.createElement("li");
        if (tipo) li.className = `is-${tipo}`;
        const t = document.createElement("time");
        t.textContent = hora;
        const b = document.createElement("b");
        b.textContent = quem;
        const s = document.createElement("span");
        s.textContent = texto;
        li.append(t, b, s);
        lines.append(li);
        while (lines.children.length > 8) lines.firstElementChild!.remove();
        return s;
      };

      const setNode = (id: string, estado: "run" | "ok") => {
        const n = nodes.get(id)!;
        n.classList.toggle("is-run", estado === "run");
        n.classList.toggle("is-ok", estado === "ok");
      };
      const limpa = () => {
        nodeEls.forEach((n) => n.classList.remove("is-run", "is-ok", "is-off"));
        fios.forEach((f) => gsap.set(f.lit, { strokeDashoffset: 1, autoAlpha: 1 }));
      };

      draw();
      const ro = new ResizeObserver(() => {
        gsap.set(nodeEls, { x: 0, y: 0 });
        syncBounds();
        draw();
      });

      /* ---------- arrastar os nós (só com mouse) ---------- */
      let drags: Draggable[] = [];
      const syncBounds = () => {
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        drags.forEach((d) => {
          const n = d.target as HTMLElement;
          const s = n.offsetWidth;
          const label = (n.querySelector(".fnode__label") as HTMLElement).offsetHeight + 12;
          d.applyBounds({
            minX: 10 - n.offsetLeft,
            maxX: W - n.offsetLeft - s - 10,
            minY: 10 - n.offsetTop,
            maxY: H - n.offsetTop - s - label,
          });
        });
      };
      const mm = gsap.matchMedia(el);
      mm.add(FINE_POINTER, () => {
        drags = nodeEls.map(
          (n) =>
            Draggable.create(n, {
              type: "x,y",
              inertia: true,
              edgeResistance: 0.8,
              zIndexBoost: false,
              onPress: () => n.classList.add("is-grab"),
              onRelease: () => n.classList.remove("is-grab"),
              onDrag: draw,
              onThrowUpdate: draw,
            })[0]
        );
        syncBounds();
        return () => {
          drags.forEach((d) => d.kill());
          drags = [];
        };
      });
      ro.observe(canvas);

      /* ---------- movimento reduzido: o fluxo já aparece executado ---------- */
      if (reduce) {
        const r = HERO_EXECUCOES[0];
        ["whatsapp", "roteador", r.rota, "crm"].forEach((id) => setNode(id, "ok"));
        ["agenda", "duvidas", "equipe"].filter((id) => id !== r.rota).forEach((id) => nodes.get(id)!.classList.add("is-off"));
        [fio("whatsapp", "roteador"), fio("roteador", r.rota), fio(r.rota, "crm")].forEach((f) => gsap.set(f.lit, { strokeDashoffset: 0 }));
        msgText.textContent = r.mensagem;
        msgTime.textContent = r.hora;
        gsap.set(msg, { autoAlpha: 1 });
        log(`${r.hora}:01`, "whatsapp", `"${r.mensagem}"`, "msg");
        log(`${r.hora}:02`, "roteador", `rota → ${nomeDo(r.rota)}`);
        log(`${r.hora}:04`, nomeDo(r.rota), r.saida, r.ia ? "ia" : "");
        log(`${r.hora}:05`, "crm", r.crm);
        return () => {
          ro.disconnect();
          mm.revert();
          lines.replaceChildren();
        };
      }

      /* ---------- uma execução: o pacote corre fio a fio e cada nó acende ---------- */
      const viagem = (f: Fio, dur: number) => {
        const p = { t: 0 };
        return gsap.fromTo(
          p,
          { t: 0 },
          {
            t: 1,
            duration: dur,
            ease: "power1.inOut",
            onStart: () => gsap.set(packet, { autoAlpha: 1 }),
            onUpdate: () => {
              const pt = f.base.getPointAtLength(p.t * f.base.getTotalLength());
              packet.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
              f.lit.style.strokeDashoffset = String(1 - p.t);
            },
          }
        );
      };

      const execucao = (r: (typeof HERO_EXECUCOES)[number]) => {
        const seg = (s: number) => `${r.hora}:0${s}`;
        const palavras = r.saida.split(" ");
        const fala = { n: 0 };
        let atual: HTMLSpanElement | null = null;
        const outras = ["agenda", "duvidas", "equipe"].filter((id) => id !== r.rota);
        const acesos = () => [fio("whatsapp", "roteador"), fio("roteador", r.rota), fio(r.rota, "crm")].map((f) => f.lit);

        return gsap
          .timeline()
          .call(() => {
            limpa();
            msgText.textContent = r.mensagem;
            msgTime.textContent = r.hora;
            setNode("whatsapp", "run");
          })
          .fromTo(msg, { autoAlpha: 0, scale: 0.85, y: 8 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(2)" }, 0)
          .call(() => void log(seg(1), "whatsapp", `"${r.mensagem}"`, "msg"), [], 0.35)
          .call(() => setNode("whatsapp", "ok"), [], 0.65)
          .add(viagem(fio("whatsapp", "roteador"), 0.6), 0.65)
          .call(() => setNode("roteador", "run"), [], 1.25)
          .call(
            () => {
              setNode("roteador", "ok");
              outras.forEach((id) => nodes.get(id)!.classList.add("is-off"));
              log(seg(2), "roteador", `rota → ${nomeDo(r.rota)}`);
            },
            [],
            1.85
          )
          .add(viagem(fio("roteador", r.rota), 0.6), 1.85)
          .call(() => setNode(r.rota, "run"), [], 2.45)
          .call(() => (atual = log(seg(4), nomeDo(r.rota), "", r.ia ? "ia" : "")), [], 2.6)
          // a resposta do agente sai em pedaços, como o streaming de um modelo
          .fromTo(
            fala,
            { n: 0 },
            {
              n: palavras.length,
              duration: r.ia ? 0.85 : 0.35,
              ease: "none",
              onUpdate: () => {
                if (atual) atual.textContent = palavras.slice(0, Math.ceil(fala.n)).join(" ");
              },
            },
            2.6
          )
          .call(() => setNode(r.rota, "ok"), [], 3.55)
          .add(viagem(fio(r.rota, "crm"), 0.6), 3.55)
          .call(() => setNode("crm", "run"), [], 4.15)
          .to(packet, { autoAlpha: 0, duration: 0.2 }, 4.15)
          .call(
            () => {
              setNode("crm", "ok");
              log(seg(5), "crm", r.crm);
            },
            [],
            4.55
          )
          .to([msg, ...acesos()], { autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 6.2)
          .to({}, { duration: 0.35 });
      };

      const loop = gsap.timeline({ paused: true, repeat: -1 });
      HERO_EXECUCOES.forEach((r) => loop.add(execucao(r)));

      /* ---------- o canvas se monta: nós aparecem e os fios se desenham ---------- */
      const col = [0, 0.16, 0.32, 0.36, 0.4, 0.56];
      let rodando = false;
      const monta = gsap.timeline({
        paused: true,
        onComplete: () => {
          rodando = true;
          loop.play(0);
        },
      });
      monta
        .call(() => void log("22:46:58", "n8n", "fluxo ativo, esperando mensagens"), [], 0)
        .fromTo(
          nodeEls,
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", stagger: (i: number) => col[i] ?? 0 },
          0
        );
      fios.forEach((f) => {
        const at = f.from === "whatsapp" ? 0.18 : f.from === "roteador" ? 0.38 : 0.58;
        monta.fromTo(
          f.base,
          { strokeDasharray: "0 2000" },
          {
            strokeDasharray: () => `${f.base.getTotalLength()} 2000`,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => gsap.set(f.base, { clearProps: "strokeDasharray" }),
          },
          at
        );
      });
      monta.to({}, { duration: 0.4 });

      let pronto = false;
      let visto = false;
      const comeca = () => {
        if (pronto && visto && !monta.progress()) monta.play();
      };
      ScrollTrigger.create({
        trigger: canvas,
        start: "top 88%",
        once: true,
        onEnter: () => {
          visto = true;
          comeca();
        },
      });
      // fora da tela o loop para, e volta de onde estava
      ScrollTrigger.create({
        trigger: canvas,
        start: "top bottom",
        end: "bottom top",
        onToggle: (s) => {
          if (!rodando) return;
          if (s.isActive) loop.resume();
          else loop.pause();
        },
      });

      /* ---------- entrada: a pergunta é digitada e o título responde em streaming ---------- */
      const typed = q(".hero__typed")[0] as HTMLElement;
      const rest = q(".hero__rest")[0] as HTMLElement;
      const ask = q(".hero__ask")[0] as HTMLElement;
      const toks = q(".tok") as HTMLElement[];
      const letras = { n: 0 };
      const escreve = () => {
        const k = Math.round(letras.n);
        typed.textContent = HERO_PERGUNTA.slice(0, k);
        rest.textContent = HERO_PERGUNTA.slice(k);
      };
      const cabeca = (i: number) => toks.forEach((t, j) => t.classList.toggle("is-head", j === i));

      const intro = gsap.timeline({ paused: true });
      intro
        .call(() => ask.classList.add("is-typing"), [], 0)
        .fromTo(letras, { n: 0 }, { n: HERO_PERGUNTA.length, duration: 0.5, ease: "none", onUpdate: escreve }, 0.05)
        .call(() => ask.classList.remove("is-typing"), [], 0.62);
      const t0 = 0.72;
      toks.forEach((t, i) =>
        intro.call(
          () => {
            t.classList.add("is-on");
            cabeca(i);
          },
          [],
          t0 + TOKEN_AT[i]
        )
      );
      intro
        .call(() => cabeca(-1), [], t0 + 3.2)
        .fromTo(
          ".hero__lede, .hero__ctas, .award-chip",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          t0 + 0.25
        )
        .call(
          () => {
            pronto = true;
            comeca();
          },
          [],
          t0 + 0.2
        )
        // um brilho atravessa o selo do prêmio uma vez, depois que a entrada assenta
        .call(() => q(".award-chip")[0]?.classList.add("is-shine"), [], t0 + 1.2);

      const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
      const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      Promise.race([fonts, wait(700)]).then(() => intro.play(0));

      return () => {
        ro.disconnect();
        mm.revert();
        loop.kill();
        lines.replaceChildren();
      };
    },
    { scope: root }
  );

  return (
    <section className="hero" id="inicio" ref={root}>
      <div className="hero__in">
        <div className="hero__copy">
          <p className="hero__ask" aria-hidden="true">
            <span className="hero__prompt">›</span>
            <span>
              <span className="hero__typed" />
              <span className="hero__caret" />
              <span className="hero__rest">{HERO_PERGUNTA}</span>
            </span>
          </p>
          <h1 className="hero__title" aria-label="Atende. Vende. Organiza.">
            {TITULO.map((linha) => (
              <span className="hero__line" aria-hidden="true" key={linha.join("")}>
                {linha.map((tok) => (
                  <span className="tok" key={tok}>
                    {tok.endsWith(".") ? (
                      <>
                        {tok.slice(0, -1)}
                        <span className="hero__dot">.</span>
                      </>
                    ) : (
                      tok
                    )}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero__lede">
            Eu construo os sistemas que fazem isso pela sua empresa: agentes de IA no WhatsApp, CRM e software sob medida.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--amber" href={waLink()} target="_blank" rel="noopener noreferrer">
              <WhatsIcon />
              Conversar no WhatsApp
            </a>
            <a
              className="btn btn--ghost"
              href="#por-dentro"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("por-dentro");
              }}
            >
              Ver um agente por dentro
            </a>
          </div>
          <a
            className="award-chip"
            href="#premio"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("premio");
            }}
          >
            <TrophyIcon />
            <span>
              <b>1º lugar</b> na {PREMIO.evento}
            </span>
          </a>
        </div>

        <div className="hero__stage" aria-hidden="true">
          <div className="flow">
            <div className="flow__bar">
              <span className="flow__name">
                <NodeMark />
                atendimento-whatsapp
              </span>
              <span className="flow__drag">arraste os nós</span>
              <span className="flow__live">
                <i />
                ao vivo
              </span>
            </div>
            <div className="flow__canvas">
              <svg className="flow__wires">
                {HERO_FIOS.map(([a, b]) => (
                  <g key={a + b} data-from={a} data-to={b}>
                    <path className="wire" />
                    <path className="wire__lit" pathLength={1} />
                  </g>
                ))}
                <g className="packet">
                  <circle className="packet__halo" r="9" />
                  <circle className="packet__core" r="4" />
                </g>
              </svg>
              <div className="flow__msg">
                <p />
                <time />
              </div>
              {HERO_NOS.map((n) => (
                <div
                  className={`fnode fnode--${n.id}${n.ia ? " fnode--ia" : ""}`}
                  data-node={n.id}
                  key={n.id}
                  style={{ "--x": n.x, "--y": n.y } as CSSProperties}
                >
                  <span className="fnode__tile">
                    {ICONES[n.id]}
                    <i className="fnode__badge">
                      <CheckIcon color="#12161c" />
                    </i>
                  </span>
                  <span className="fnode__label">
                    <b>{n.nome}</b>
                    <small>{n.tipo}</small>
                  </span>
                </div>
              ))}
            </div>
            <div className="flow__log">
              <span className="flow__loghead">log de execução</span>
              <ol className="flow__lines" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
