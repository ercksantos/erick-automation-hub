import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NAV, SITE, waLink } from "@/content/site";
import { ScrollTrigger, useGSAP } from "@/lib/motion";
import { scrollToId, setScrollLocked } from "@/lib/scroll";
import { NodeMark, WhatsIcon } from "./NodeMark";

type Props = { home?: boolean };

export const Bar = ({ home = false }: Props) => {
  const barRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const bar = barRef.current!;
      ScrollTrigger.create({
        start: 10,
        end: "max",
        onToggle: (s) => bar.classList.toggle("is-scrolled", s.isActive),
      });
      if (!home) return;
      NAV.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (s) => s.isActive && setActive(id),
        });
      });
      ScrollTrigger.create({
        trigger: "#inicio",
        start: "top top",
        end: "bottom 45%",
        onToggle: (s) => s.isActive && setActive(""),
      });
    },
    { dependencies: [home] }
  );

  // menu do celular: trava a rolagem, fecha com Esc e devolve o foco ao botão
  useEffect(() => {
    // menu fechado fica fora do teclado e do leitor de tela
    if (open) sheetRef.current?.removeAttribute("inert");
    else sheetRef.current?.setAttribute("inert", "");
    if (!open) return;
    const menuBtn = menuBtnRef.current;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKey);
      menuBtn?.focus();
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!home) return; // fora da home, o Link leva para /#id
    e.preventDefault();
    setOpen(false);
    // espera o menu soltar a rolagem antes de andar
    requestAnimationFrame(() => scrollToId(id));
  };

  const navLink = (id: string, label: string, className?: string) =>
    home ? (
      <a href={`#${id}`} onClick={go(id)} className={className}>
        {label}
      </a>
    ) : (
      <Link to={`/#${id}`} className={className} onClick={() => setOpen(false)}>
        {label}
      </Link>
    );

  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="bar" ref={barRef}>
        {home ? (
          <a className="bar__brand" href="#inicio" onClick={go("inicio")} aria-label={`${SITE.marca}, início`}>
            <NodeMark />
            <span className="bar__names">
              <strong>{SITE.marca}</strong>
              <span>{SITE.pessoa}</span>
            </span>
          </a>
        ) : (
          <Link className="bar__brand" to="/" aria-label={`${SITE.marca}, início`}>
            <NodeMark />
            <span className="bar__names">
              <strong>{SITE.marca}</strong>
              <span>{SITE.pessoa}</span>
            </span>
          </Link>
        )}

        <nav className="bar__nav" aria-label="Seções">
          <ul>
            {NAV.map(({ id, label }) => (
              <li key={id}>{navLink(id, label, active === id ? "is-active" : undefined)}</li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--amber btn--sm bar__cta" href={waLink()} target="_blank" rel="noopener noreferrer">
          <WhatsIcon />
          Conversar no WhatsApp
        </a>

        <button
          ref={menuBtnRef}
          className="bar__menu"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      <div ref={sheetRef} className={`sheet${open ? " is-open" : ""}`} id="menu" aria-hidden={!open}>
        <ul>
          {NAV.map(({ id, label }) => (
            <li key={id}>{navLink(id, label, "sheet__link")}</li>
          ))}
        </ul>
        <a className="btn btn--amber" href={waLink()} target="_blank" rel="noopener noreferrer">
          <WhatsIcon />
          Conversar no WhatsApp
        </a>
      </div>
    </>
  );
};
