import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CONVERSA_DEMO, MENSAGENS_ROTEADOR, RASTRO, ROTAS, SITE } from "@/content/site";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/motion";
import { FLOW_ICONS } from "./FlowIcons";
import { CheckIcon, NodeMark } from "./NodeMark";
import { SecTag } from "./SecTag";

// "Por dentro": a conversa de uma clínica às 22h47 e, ao lado, o rastro da execução.
// Cada mensagem do agente só aparece depois que os passos por trás dela rodam
// (roteador, base de conhecimento, agenda, CRM), então dá para ver as duas coisas
// acontecendo juntas. Embaixo, um teste do roteador com outras mensagens.

type Estado = "run" | "ok";
const TODOS_OK = Object.fromEntries(RASTRO.map((p) => [p.id, "ok" as Estado]));

export const Inside = () => {
  const root = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const reduce = prefersReduced();
  const [shown, setShown] = useState(reduce ? CONVERSA_DEMO.length : 0);
  const [typing, setTyping] = useState(false);
  const [estado, setEstado] = useState<Record<string, Estado>>(reduce ? TODOS_OK : {});
  const [atual, setAtual] = useState<string | null>(reduce ? RASTRO[RASTRO.length - 1].id : null);
  const [fase, setFase] = useState<"espera" | "rodando" | "fim">(reduce ? "fim" : "espera");

  useGSAP(
    () => {
      if (reduce) return;
      const passo = (id: string, st: Estado) => {
        setEstado((e) => ({ ...e, [id]: st }));
        setAtual(id);
      };
      const t = gsap.timeline({ paused: true });
      t.call(() => {
        setShown(0);
        setTyping(false);
        setEstado({});
        setAtual(null);
        setFase("rodando");
      });
      let at = 0.35;
      CONVERSA_DEMO.forEach((f, i) => {
        const antes = RASTRO.filter((p) => p.em === i);
        if (f.de === "agente") t.call(() => setTyping(true), [], at);
        antes.forEach((p) => {
          t.call(() => passo(p.id, "run"), [], at);
          at += p.id === "gatilho" ? 0.45 : 0.75;
          t.call(() => passo(p.id, "ok"), [], at);
          at += 0.15;
        });
        if (f.de === "agente") at += 0.45;
        t.call(
          () => {
            setTyping(false);
            setShown(i + 1);
          },
          [],
          at
        );
        at += f.de === "dia" ? 0.3 : f.de === "cliente" ? 0.9 : 0.55;
      });
      t.call(() => setFase("fim"), [], at);
      tl.current = t;
      ScrollTrigger.create({ trigger: ".exec", start: "top 70%", once: true, onEnter: () => t.play(0) });
      return () => t.kill();
    },
    { scope: root }
  );

  // a conversa rola sozinha até a última mensagem, e a mensagem nova entra deslizando
  const prev = useRef(shown);
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

  const passoAtual = RASTRO.find((p) => p.id === atual);
  const statusTxt = fase === "rodando" ? "executando" : fase === "fim" ? "execução concluída" : "esperando mensagem";

  return (
    <section className="sec inside" id="por-dentro" ref={root}>
      <div className="wrap">
        <header className="sec__head">
          <SecTag id="por-dentro" />
          <h2 className="sec__title">Um agente de IA, por dentro.</h2>
          <p className="sec__lede">
            Alguém manda mensagem para uma clínica às 22h47. De um lado, a conversa. Do outro, tudo o que roda antes de cada
            resposta.
          </p>
        </header>

        <div className="exec">
          <div className="exec__bar">
            <span className="exec__name">
              <NodeMark />
              clinica-exemplo / atendimento
            </span>
            <span className={`exec__state is-${fase}`}>
              <i />
              {statusTxt}
            </span>
          </div>

          <div className="exec__grid">
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
              <div className="wa__body" ref={bodyRef} aria-live="polite">
                {CONVERSA_DEMO.slice(0, shown).map((f, i) =>
                  f.de === "dia" ? (
                    <span className="wa__day" key={i} data-i={i}>
                      {f.texto}
                    </span>
                  ) : f.de === "sistema" ? (
                    <div className="msg msg--sistema" key={i} data-i={i}>
                      {f.texto}
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
                <button type="button" className="chip" onClick={() => tl.current?.play(0)} disabled={fase !== "fim" || reduce}>
                  Rodar de novo
                </button>
              </div>
            </div>

            <div className="trace" aria-label="O que roda por trás da conversa">
              <p className="trace__title">o que roda por trás</p>
              <ol className="trace__list">
                {RASTRO.map((p) => (
                  <li className="tstep" data-state={estado[p.id] ?? "wait"} key={p.id}>
                    <span className="tstep__tile" aria-hidden="true">
                      {FLOW_ICONS[p.icone]}
                      <i className="tstep__badge">
                        <CheckIcon color="#12161c" />
                      </i>
                    </span>
                    <span className="tstep__txt">
                      <b>
                        {p.nome}
                        <small>{p.tipo}</small>
                      </b>
                      <span className="tstep__det">{p.detalhe}</span>
                    </span>
                    <time>{p.hora}</time>
                  </li>
                ))}
              </ol>
              <p className="trace__now" aria-hidden="true">
                {passoAtual ? (
                  <>
                    <b>{passoAtual.nome.toLowerCase()}</b> {passoAtual.detalhe}
                  </>
                ) : (
                  "esperando a primeira mensagem"
                )}
              </p>
            </div>
          </div>
        </div>

        <Tester />

        <p className="inside__note">Telas de exemplo, com dados inventados.</p>
        {SITE.testeGratisVisivel && (
          <Link className="btn btn--ghost inside__live" to="/teste-gratis">
            Conversar com um agente de verdade
          </Link>
        )}
      </div>
    </section>
  );
};

/* ---------- teste do roteador: outra mensagem, outro caminho ---------- */

const Tester = () => {
  const [pick, setPick] = useState<number | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const timer = useRef<gsap.core.Tween | null>(null);

  const escolhe = (i: number) => {
    setPick(i);
    setLit(null);
    timer.current?.kill();
    // o roteador "pensa" um instante antes de acender o caminho
    timer.current = gsap.delayedCall(prefersReduced() ? 0 : 0.5, () => setLit(MENSAGENS_ROTEADOR[i].rota));
  };
  useLayoutEffect(() => () => void timer.current?.kill(), []);

  const atual = pick == null ? null : MENSAGENS_ROTEADOR[pick];

  return (
    <div className="tester">
      <div className="tester__ask">
        <p className="tester__title">Teste o roteador: escolha outra mensagem</p>
        <div className="tester__chips">
          {MENSAGENS_ROTEADOR.map((m, i) => (
            <button key={m.texto} type="button" className={`chip${pick === i ? " is-on" : ""}`} onClick={() => escolhe(i)}>
              {m.texto}
            </button>
          ))}
        </div>
      </div>
      <div className="tester__out">
        <ul className="tester__routes">
          {ROTAS.map((r) => (
            <li
              key={r.id}
              className={`troute${r.id === "equipe" ? " troute--human" : ""}${lit === r.id ? " is-on" : ""}${
                pick != null && !lit ? " is-wait" : ""
              }`}
            >
              <b>{r.nome}</b>
              <span>{r.faz}</span>
            </li>
          ))}
        </ul>
        <p className="tester__why" aria-live="polite">
          {lit && atual ? (
            <>
              <code>roteador → {ROTAS.find((r) => r.id === lit)?.nome.toLowerCase()}</code> {atual.porque}
            </>
          ) : pick != null ? (
            <code>roteador classificando...</code>
          ) : (
            "O roteador não conversa com o cliente: ele só decide o caminho."
          )}
        </p>
      </div>
    </div>
  );
};
