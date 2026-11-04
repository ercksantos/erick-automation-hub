import { useRef } from "react";
import { HERO_CONVERSAS, SITE, waLink } from "@/content/site";
import { MEDIA, gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { CheckIcon, WhatsIcon } from "./NodeMark";

// O único momento "de cinema" da página: as mensagens da noite chegam soltas,
// sem resposta, e com a rolagem se encaixam no painel; o fio do CRM leva cada
// conversa até o horário marcado. Cada palavra do título acende na sua etapa.

const SCATTER = [
  { fx: 0.27, fy: 0.3, r: -7, s: 1.04 },
  { fx: 0.68, fy: 0.42, r: 5, s: 0.98 },
  { fx: 0.3, fy: 0.64, r: 4, s: 1 },
  { fx: 0.72, fy: 0.72, r: -6, s: 0.96 },
];
const AMBER = "#ffb547";
const LEAD_GAP = 14;

export const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const stage = q(".hero__stage")[0] as HTMLElement;
      const central = q(".central")[0] as HTMLElement;
      const grid = q(".central__grid")[0] as HTMLElement;
      const tiles = q(".conv") as HTMLElement[];
      const tileIns = q(".conv__in");
      const bubbles = q(".conv__bubble");
      const cards = q(".conv__card");
      const words = q(".hero__word");
      const lines = q(".hero__line > span");
      const title = q(".hero__title")[0];
      const count = q("[data-count]")[0] as HTMLElement;
      const track = q(".funnel__track")[0] as HTMLElement;
      const leads = q(".funnel__lead");
      const nodes = q(".funnel__node");

      const setDone = (k: number) => {
        tiles.forEach((t, i) => t.classList.toggle("is-done", i < k));
        count.textContent = String(k);
      };
      const wireW = () => track.offsetWidth - 20;
      const leadX = (i: number, at: number) => at * wireW() + (i - 1.5) * LEAD_GAP;

      const mm = gsap.matchMedia(el);
      mm.add(
        MEDIA,
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };

          if (reduce) {
            setDone(4);
            words.forEach((w) => w.classList.add("is-lit"));
            gsap.set(".funnel__fill", { scaleX: 1 });
            gsap.set(nodes, { backgroundColor: AMBER, borderColor: AMBER });
            gsap.set(leads, { autoAlpha: 1, x: (i: number) => leadX(i, i < 2 ? 1 : 0.5) });
            return;
          }

          // offsetLeft/Top ignoram transform: a conta vale em qualquer ponto da animação
          const home = (i: number) => {
            const t = tiles[i];
            return {
              x: t.offsetLeft + grid.offsetLeft + central.offsetLeft + t.offsetWidth / 2,
              y: t.offsetTop + grid.offsetTop + central.offsetTop + t.offsetHeight / 2,
            };
          };
          const spreadX = (i: number) => SCATTER[i].fx * stage.offsetWidth - home(i).x;
          const spreadY = (i: number) => SCATTER[i].fy * stage.offsetHeight - home(i).y;

          const done = { k: 0 };
          const tl = gsap.timeline({ defaults: { ease: "none" }, paused: !desktop });
          tl.fromTo(".hero__hint", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 0)
            .fromTo(
              tiles,
              { x: spreadX, y: spreadY, rotation: (i) => SCATTER[i].r, scale: (i) => SCATTER[i].s },
              { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.9, ease: "power3.inOut", stagger: { each: 0.05, from: "random" } },
              0
            )
            .to(".noise", { autoAlpha: 0, scale: 0.88, duration: 0.5, ease: "power2.in" }, 0.05)
            .fromTo(".central__frame", { autoAlpha: 0, scale: 0.93 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0.55)
            .fromTo(".central__head, .central__meter", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.95)
            .to(".hero__before", { autoAlpha: 0, y: -14, duration: 0.3 }, 0.6)
            .fromTo(".hero__after", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.9)
            .to(bubbles, { autoAlpha: 0, duration: 0.3, stagger: 0.04 }, 1.05)
            .fromTo(cards, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.04 }, 1.05)
            .fromTo(".funnel", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.15)
            // atende: as quatro conversas recebem resposta, e cada uma vira um lead no CRM
            .to(done, { k: 4, duration: 0.6, onUpdate: () => setDone(Math.round(done.k)) }, 1.3)
            .fromTo(".central__meter span", { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 1.3)
            .to(words[0], { color: AMBER, duration: 0.12 }, 1.32)
            .fromTo(nodes[0], { backgroundColor: "#1a212b", borderColor: "#2f3a49" }, { backgroundColor: AMBER, borderColor: AMBER, duration: 0.1 }, 1.35)
            .fromTo(leads, { autoAlpha: 0, x: (i) => leadX(i, 0), scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.2, stagger: 0.15, ease: "back.out(2)" }, 1.35)
            // vende: o fio leva os leads para qualificado
            .fromTo(".funnel__fill", { scaleX: 0 }, { scaleX: 0.5, duration: 0.35, ease: "power2.inOut" }, 2.0)
            .to(leads, { x: (i) => leadX(i, 0.5), duration: 0.35, ease: "power2.inOut", stagger: 0.03 }, 2.0)
            .fromTo(nodes[1], { backgroundColor: "#1a212b", borderColor: "#2f3a49" }, { backgroundColor: AMBER, borderColor: AMBER, duration: 0.1 }, 2.3)
            .to(words[1], { color: AMBER, duration: 0.12 }, 2.3)
            // organiza: dois deles já saem com horário marcado
            .to(".funnel__fill", { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 2.5)
            .to(leads.slice(0, 2), { x: (i) => leadX(i, 1), duration: 0.35, ease: "power2.inOut", stagger: 0.04 }, 2.5)
            .fromTo(nodes[2], { backgroundColor: "#1a212b", borderColor: "#2f3a49" }, { backgroundColor: AMBER, borderColor: AMBER, duration: 0.1 }, 2.82)
            .to(words[2], { color: AMBER, duration: 0.12 }, 2.82)
            .fromTo(".central__foot", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, 2.95)
            .to({}, { duration: 0.3 });

          if (desktop) {
            ScrollTrigger.create({
              animation: tl,
              trigger: el,
              start: "top top",
              end: "+=150%",
              pin: ".hero__pin",
              scrub: 0.9,
              invalidateOnRefresh: true,
              refreshPriority: 1,
            });
          } else {
            // no celular a rolagem não fica presa: a sequência toca sozinha quando o palco aparece
            tl.timeScale(0.85);
            ScrollTrigger.create({ trigger: stage, start: "top 55%", once: true, onEnter: () => tl.play() });
          }
          return () => setDone(0);
        }
      );

      // entrada: o título sobe e abre de estreito para largo (fica parada até a fonte chegar)
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        const intro = gsap.timeline({ paused: true });
        intro
          .from(lines, { yPercent: 108, duration: 1.1, ease: "expo.out", stagger: 0.09 })
          .fromTo(title, { "--wdth": 70 }, { "--wdth": 125, duration: 1.7, ease: "expo.out" }, 0.05)
          .from(".hero__swap, .hero__ctas, .hero__by", { autoAlpha: 0, y: 14, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.35)
          .from(tileIns, { autoAlpha: 0, scale: 0.4, duration: 0.8, ease: "back.out(1.7)", stagger: { each: 0.08, from: "random" } }, 0.3)
          .from(".noise > *", { autoAlpha: 0, scale: 0.75, duration: 0.7, ease: "back.out(1.6)", stagger: 0.1 }, 0.6);
        const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
        Promise.race([fonts, wait(1200)]).then(() => {
          ScrollTrigger.refresh();
          intro.play(0);
        });
      }
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="hero" id="inicio" ref={root}>
      <div className="hero__pin">
        <div className="hero__copy">
          <h1 className="hero__title" aria-label="Atende. Vende. Organiza.">
            <span className="hero__line" aria-hidden="true">
              <span className="hero__word">Atende.</span>
            </span>
            <span className="hero__line" aria-hidden="true">
              <span className="hero__word">Vende.</span>
            </span>
            <span className="hero__line" aria-hidden="true">
              <span className="hero__word">Organiza.</span>
            </span>
          </h1>
          <div className="hero__swap">
            <p className="hero__lede hero__before">
              Mensagem chegando às 22h, orçamento esquecido num post-it e ninguém sabe quem já foi respondido.
            </p>
            <p className="hero__lede hero__after">
              Eu construo os sistemas que fazem isso pela sua empresa: agentes de IA no WhatsApp, CRM e software sob medida.
            </p>
          </div>
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
          <p className="hero__by">{SITE.pessoa}, desenvolvedor</p>
        </div>

        <div className="hero__stage" aria-hidden="true">
          <div className="central">
            <div className="central__frame" />
            <div className="central__head">
              <span className="central__name">Conversas da noite</span>
              <span className="central__count">
                <b data-count>0</b> de 4 respondidas
              </span>
            </div>
            <div className="central__meter">
              <span />
            </div>
            <div className="central__grid">
              {HERO_CONVERSAS.map((c) => (
                <div className="conv" key={c.hora}>
                  <div className="conv__in">
                    <div className="conv__bubble">
                      <p>{c.texto}</p>
                      <time>{c.hora}</time>
                    </div>
                    <div className="conv__card">
                      <p>{c.texto}</p>
                      <span className="conv__status">
                        <i>
                          <CheckIcon color="#12161c" />
                        </i>
                        <span className="s-wait">Aguardando</span>
                        <span className="s-ok">
                          Respondida<span className="conv__by"> pelo agente</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="funnel">
              <span className="funnel__label">No CRM</span>
              <div className="funnel__track">
                <div className="funnel__wire">
                  <span className="funnel__fill" />
                </div>
                <span className="funnel__node">
                  <span>Novo</span>
                </span>
                <span className="funnel__node">
                  <span>Qualificado</span>
                </span>
                <span className="funnel__node">
                  <span>Agendado</span>
                </span>
                {[0, 1, 2, 3].map((i) => (
                  <i className="funnel__lead" key={i} />
                ))}
              </div>
            </div>
            <div className="central__foot">
              <span className="pill pill--amber">
                <CheckIcon />
                Conversa, lead e horário no mesmo lugar
              </span>
            </div>
          </div>

          <div className="noise">
            <div className="notif">
              <b>4</b> mensagens não lidas
            </div>
            <div className="postit">retornar o orçamento de ontem!!</div>
            <div className="sheetdoc">
              <b>leads_final (2).xlsx</b>
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>

        <p className="hero__hint" aria-hidden="true">
          <i />
          Role para ver a noite se organizar
        </p>
      </div>
    </section>
  );
};
