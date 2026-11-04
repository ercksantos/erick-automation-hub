import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import {
  CARDS_CRM,
  CONVERSA_DEMO,
  ETAPAS,
  MENSAGENS_ROTEADOR,
  ROTAS,
  SITE,
  type CardCrm,
} from "@/content/site";
import { Flip, gsap, ScrollTrigger, prefersReduced, useGSAP } from "@/lib/motion";
import { NodeMark } from "./NodeMark";

// "Por dentro": as telas de um agente de IA atendendo uma clínica às 22h47.
// O aparelho vira celular ou navegador conforme a tela (Flip), como os módulos
// da proposta da Central de Suprimentos. Dados de exemplo, conversando entre si:
// a conversa terminada aparece destacada no CRM.

type ViewId = "conversa" | "roteador" | "crm";
const VIEWS: { id: ViewId; kind: "phone" | "browser"; titulo: string; sub: string; url: string }[] = [
  {
    id: "conversa",
    kind: "phone",
    titulo: "A conversa",
    sub: "O agente responde de madrugada, oferece horário e registra o lead, sem ninguém da equipe acordado.",
    url: "",
  },
  {
    id: "roteador",
    kind: "browser",
    titulo: "O roteador",
    sub: "Antes de responder, um roteador decide qual agente cuida da mensagem. Assunto sensível vai para uma pessoa.",
    url: "clinica-exemplo / roteador",
  },
  {
    id: "crm",
    kind: "browser",
    titulo: "O CRM",
    sub: "O lead chega com origem e histórico, e o follow-up não depende da memória de ninguém.",
    url: "clinica-exemplo / crm",
  },
];

export const Inside = () => {
  const root = useRef<HTMLElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewId>("conversa");
  const [seen, setSeen] = useState(false);
  const [chatDone, setChatDone] = useState(false);
  const busy = useRef(false);
  const reduce = prefersReduced();

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: deviceRef.current, start: "top 75%", once: true, onEnter: () => setSeen(true) });
    },
    { scope: root }
  );

  const current = VIEWS.find((v) => v.id === view)!;

  const show = useCallback(
    (id: ViewId) => {
      if (id === view || busy.current) return;
      const next = VIEWS.find((v) => v.id === id)!;
      const device = deviceRef.current!;
      const screen = screenRef.current!;
      if (reduce) {
        setView(id);
        return;
      }
      busy.current = true;
      gsap.to(screen, {
        autoAlpha: 0,
        duration: 0.16,
        ease: "power1.in",
        onComplete: () => {
          const morph = device.dataset.kind !== next.kind;
          const state = morph ? Flip.getState(device, { props: "borderRadius,padding" }) : null;
          flushSync(() => setView(id));
          if (state) Flip.from(state, { duration: 0.6, ease: "power3.inOut" });
          gsap.fromTo(
            screen,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.4,
              delay: state ? 0.42 : 0,
              ease: "power2.out",
              onComplete: () => {
                busy.current = false;
                ScrollTrigger.refresh();
              },
            }
          );
        },
      });
    },
    [view, reduce]
  );

  return (
    <section className="sec inside" id="por-dentro" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <h2 className="sec__title">Um agente de IA, por dentro.</h2>
          <p className="sec__lede">
            O que acontece quando alguém manda mensagem para uma clínica às 22h47. Escolha cada parte para ver como ela funciona.
          </p>
        </header>

        <div className="inside__grid">
          <div>
            <ul className="views" role="tablist" aria-label="Partes do agente">
              {VIEWS.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={view === v.id}
                    aria-controls="demo-tela"
                    className={`view${view === v.id ? " is-active" : ""}`}
                    onClick={() => show(v.id)}
                  >
                    <span className="node" aria-hidden="true" />
                    <span>
                      <strong>{v.titulo}</strong>
                    </span>
                    <span className="view__sub">{v.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="inside__note">Telas de exemplo, com dados inventados.</p>
            {SITE.testeGratisVisivel && (
              <Link className="btn btn--ghost inside__live" to="/teste-gratis">
                Conversar com um agente de verdade
              </Link>
            )}
          </div>

          <div className="stage-wrap">
            <div className="device" data-kind={current.kind} ref={deviceRef}>
              <div className="device__top" aria-hidden="true">
                <span className="device__dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="device__url">{current.url}</span>
              </div>
              <div className="device__screen" id="demo-tela" role="tabpanel" aria-label={current.titulo} ref={screenRef}>
                {view === "conversa" && (
                  <Conversa start={seen} instant={chatDone} onDone={() => setChatDone(true)} onGoto={() => show("crm")} />
                )}
                {view === "roteador" && <Roteador />}
                {view === "crm" && <Crm chatDone={chatDone} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- a conversa ---------- */

const Conversa = ({
  start,
  instant,
  onDone,
  onGoto,
}: {
  start: boolean;
  instant: boolean;
  onDone: () => void;
  onGoto: () => void;
}) => {
  const reduce = prefersReduced();
  const all = CONVERSA_DEMO.length;
  const [shown, setShown] = useState(reduce || instant ? all : 0);
  const [typing, setTyping] = useState(false);
  const [run, setRun] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const prev = useRef(shown);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduce || (instant && run === 0)) {
      doneRef.current();
      return;
    }
    if (!start) return;
    setShown(0);
    setTyping(false);
    prev.current = 0;
    const timers: number[] = [];
    let t = 350;
    CONVERSA_DEMO.forEach((f, i) => {
      if (f.de === "agente") {
        timers.push(window.setTimeout(() => setTyping(true), t));
        t += 1150;
      }
      timers.push(
        window.setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
          if (f.de === "sistema") doneRef.current();
        }, t)
      );
      t += f.de === "dia" ? 300 : f.de === "cliente" ? 1000 : 650;
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, run]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = body.scrollHeight;
    if (shown > prev.current && !reduce) {
      const fresh = body.querySelector(`[data-i="${shown - 1}"]`);
      if (fresh) gsap.from(fresh, { y: 10, autoAlpha: 0, duration: 0.35, ease: "power2.out" });
    }
    prev.current = shown;
  }, [shown, typing, reduce]);

  return (
    <div className="wa">
      <div className="wa__head">
        <span className="wa__ava">
          <NodeMark />
        </span>
        <span className="wa__name">
          Clínica Exemplo
          <small>{typing ? "digitando..." : "agente de IA, online"}</small>
        </span>
      </div>
      <div className="wa__body" ref={bodyRef} data-lenis-prevent aria-live="polite">
        {CONVERSA_DEMO.slice(0, shown).map((f, i) =>
          f.de === "dia" ? (
            <span className="wa__day" key={i} data-i={i}>
              {f.texto}
            </span>
          ) : f.de === "sistema" ? (
            <div className="msg msg--sistema" key={i} data-i={i}>
              {f.texto}
              <button type="button" onClick={onGoto}>
                Abrir no CRM
              </button>
            </div>
          ) : (
            <div className={`msg msg--${f.de}`} key={i} data-i={i}>
              {f.texto}
              <time>{f.hora}</time>
            </div>
          )
        )}
        {typing && (
          <div className="typing" aria-label="Agente digitando">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <div className="wa__foot">
        <button type="button" className="chip" onClick={() => setRun((r) => r + 1)} disabled={!start && !instant}>
          Recomeçar a conversa
        </button>
      </div>
    </div>
  );
};

/* ---------- o roteador ---------- */

type Pt = { x: number; y: number };

const Roteador = () => {
  const reduce = prefersReduced();
  const mapRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const routeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inPath = useRef<SVGPathElement>(null);
  const outPaths = useRef<(SVGPathElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<{ inD: string; outD: string[] }>({ inD: "", outD: [] });
  const [pick, setPick] = useState<number | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // fios medidos na tela: da mensagem ao roteador e do roteador a cada rota
  const measure = useCallback(() => {
    const map = mapRef.current;
    const msg = msgRef.current;
    const hub = hubRef.current;
    if (!map || !msg || !hub) return;
    const m = map.getBoundingClientRect();
    const rel = (r: DOMRect) => ({ l: r.left - m.left, t: r.top - m.top, r: r.right - m.left, b: r.bottom - m.top, w: r.width, h: r.height });
    const a = rel(msg.getBoundingClientRect());
    const h = rel(hub.getBoundingClientRect());
    const routes = routeRefs.current.map((n) => rel(n!.getBoundingClientRect()));
    const curve = (p: Pt, q: Pt) => {
      const my = (p.y + q.y) / 2;
      return `M${p.x} ${p.y} C ${p.x} ${my}, ${q.x} ${my}, ${q.x} ${q.y}`;
    };
    const hubTop = { x: h.l + h.w / 2, y: h.t };
    const hubBottom = { x: h.l + h.w / 2, y: h.b };
    const inD = curve({ x: a.l + a.w / 2, y: a.b }, hubTop);
    const outD = routes.map((r) => curve(hubBottom, { x: r.l + r.w / 2, y: r.t }));
    setBox({ w: m.width, h: m.height });
    setPaths({ inD, outD });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, [measure, pick]);

  const travel = (path: SVGPathElement, duration: number) => {
    const len = path.getTotalLength();
    const o = { t: 0 };
    return gsap.to(o, {
      t: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const p = path.getPointAtLength(o.t * len);
        gsap.set(dotRef.current, { x: p.x, y: p.y });
      },
    });
  };

  const choose = (i: number) => {
    setPick(i);
    const rota = MENSAGENS_ROTEADOR[i].rota;
    const idx = ROTAS.findIndex((r) => r.id === rota);
    tl.current?.kill();
    setLit(null);
    if (reduce) {
      setLit(rota);
      return;
    }
    // espera o React pintar a mensagem nova e os fios remedidos
    requestAnimationFrame(() => {
      const out = outPaths.current[idx];
      if (!inPath.current || !out) return;
      const t = gsap.timeline();
      t.set(dotRef.current, { autoAlpha: 1 })
        .add(travel(inPath.current, 0.55))
        .add(() => {
          hubRef.current?.classList.remove("is-ping");
          void hubRef.current?.offsetWidth;
          hubRef.current?.classList.add("is-ping");
        })
        .to({}, { duration: 0.25 })
        .add(travel(out, 0.6))
        .add(() => setLit(rota))
        .to(dotRef.current, { autoAlpha: 0, duration: 0.25 });
      tl.current = t;
    });
  };

  // a primeira mensagem passa sozinha quando a tela abre
  useEffect(() => {
    const id = window.setTimeout(() => choose(0), reduce ? 0 : 500);
    return () => {
      clearTimeout(id);
      tl.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const atual = pick == null ? null : MENSAGENS_ROTEADOR[pick];

  return (
    <div className="router" data-lenis-prevent>
      <div className="router__pick">
        <p>Escolha uma mensagem que chegou:</p>
        {MENSAGENS_ROTEADOR.map((m, i) => (
          <button key={m.texto} type="button" className={`chip${pick === i ? " is-on" : ""}`} onClick={() => choose(i)}>
            {m.texto}
          </button>
        ))}
      </div>
      <div className="router__map" ref={mapRef}>
        <svg className="router__wires" viewBox={`0 0 ${box.w || 1} ${box.h || 1}`} aria-hidden="true">
          <path ref={inPath} d={paths.inD} className={lit ? "is-on" : ""} />
          {paths.outD.map((d, i) => (
            <path
              key={i}
              d={d}
              ref={(n) => (outPaths.current[i] = n)}
              className={lit === ROTAS[i].id ? "is-on" : ""}
            />
          ))}
        </svg>
        <div className="router__msg" ref={msgRef}>
          <small>Mensagem do cliente</small>
          {atual ? atual.texto : "..."}
        </div>
        <div className="router__hub" ref={hubRef}>
          Roteador
        </div>
        <ul className="router__routes">
          {ROTAS.map((r, i) => (
            <li
              key={r.id}
              ref={(n) => (routeRefs.current[i] = n)}
              className={`route${r.id === "equipe" ? " route--human" : ""}${lit === r.id ? " is-on" : ""}`}
            >
              <b>{r.nome}</b>
              <span>{r.faz}</span>
            </li>
          ))}
        </ul>
        <span className="router__dot" ref={dotRef} aria-hidden="true" />
      </div>
      <p className="router__why" aria-live="polite">
        {lit && atual ? atual.porque : "O roteador não conversa com o cliente: ele só decide o caminho."}
      </p>
    </div>
  );
};

/* ---------- o CRM ---------- */

const Crm = ({ chatDone }: { chatDone: boolean }) => {
  const reduce = prefersReduced();
  const boardRef = useRef<HTMLDivElement>(null);
  const [cards, setCards] = useState<CardCrm[]>(() =>
    CARDS_CRM.map((c) =>
      c.destaque
        ? { ...c, destaque: chatDone, nota: chatDone ? "Agendado agora pelo agente, na conversa ao lado" : c.nota }
        : c
    )
  );
  const [log, setLog] = useState(
    chatDone ? "A conversa da demonstração já está aqui, com a origem e o horário." : "Avance um card para ver o que o sistema faz em cada etapa."
  );

  const advance = (id: string) => {
    const order = ETAPAS.map((e) => e.id);
    const card = cards.find((c) => c.id === id)!;
    const next = order[order.indexOf(card.etapa) + 1];
    if (!next) return;
    const state = reduce ? null : Flip.getState(boardRef.current!.querySelectorAll(".card"));
    flushSync(() => {
      setCards((cs) => [...cs.filter((c) => c.id !== id), { ...card, etapa: next }]);
      setLog(
        next === "conversa"
          ? `${card.titulo} foi para Em conversa. Se ninguém responder em dois dias, o agente retoma o contato.`
          : `${card.titulo} foi para Agendado. Na véspera, o agente manda o lembrete.`
      );
    });
    if (state) Flip.from(state, { duration: 0.5, ease: "power3.inOut", targets: boardRef.current!.querySelectorAll(".card") });
  };

  return (
    <div className="crm">
      <div className="crm__head">
        <span className="crm__title">Funil da clínica</span>
        <span className="crm__sub">{cards.length} leads nesta semana</span>
      </div>
      <div className="crm__board" ref={boardRef} data-lenis-prevent>
        {ETAPAS.map((e, ei) => {
          const list = cards.filter((c) => c.etapa === e.id);
          return (
            <div className="col" key={e.id}>
              <h4>
                {e.nome}
                <span>{list.length}</span>
              </h4>
              {list.length === 0 && <p className="col__empty">Nenhum lead nesta etapa agora.</p>}
              {list.map((c) => (
                <div className={`card${c.destaque ? " is-hot" : ""}`} key={c.id} data-flip-id={c.id}>
                  <b>{c.titulo}</b>
                  <small>{c.origem}</small>
                  <p>{c.nota}</p>
                  {ei < ETAPAS.length - 1 && (
                    <button type="button" onClick={() => advance(c.id)}>
                      Avançar
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <p className="crm__log" aria-live="polite">
        {log}
      </p>
    </div>
  );
};
