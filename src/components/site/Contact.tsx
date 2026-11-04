import { useLayoutEffect, useRef, useState } from "react";
import { SITE, waLink } from "@/content/site";
import { gsap, prefersReduced } from "@/lib/motion";
import { WhatsIcon } from "./NodeMark";

const formatPhone = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

type Status = "idle" | "sending" | "sent" | "error";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", whatsapp: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const doneRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "whatsapp" ? formatPhone(e.target.value) : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(SITE.webhookContato, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: "", email: "", origem: "site" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  // confirmação: o círculo cresce e o check se desenha; o texto nunca fica invisível
  useLayoutEffect(() => {
    if (status !== "sent" || !doneRef.current || prefersReduced()) return;
    const el = doneRef.current;
    const path = el.querySelector("path")!;
    const len = path.getTotalLength();
    gsap
      .timeline()
      .from(el, { opacity: 0.4, duration: 0.2 })
      .from(el.querySelector("circle"), { scale: 0.55, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(2)" }, 0)
      .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.35, ease: "power3.out" }, 0.12)
      .from(el.querySelectorAll("h4, p, button"), { y: 8, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 0.1);
  }, [status]);

  const valid = form.name.trim().length > 1 && form.whatsapp.replace(/\D/g, "").length >= 10 && form.message.trim().length > 3;

  return (
    <section className="sec contact" id="contato">
      <div className="wrap contact__grid">
        <div>
          <h2 className="contact__line">Me conta o que trava hoje na sua empresa.</h2>
          <p className="contact__sub">
            Pode ser o atendimento, o funil, uma planilha que ninguém aguenta mais. A primeira conversa é para entender o problema,
            sem compromisso.
          </p>
          <div className="contact__actions">
            <a className="btn btn--amber" href={waLink()} target="_blank" rel="noopener noreferrer">
              <WhatsIcon />
              Conversar no WhatsApp
            </a>
            <a className="btn btn--ghost" href={`mailto:${SITE.email}`}>
              Mandar um e-mail
            </a>
          </div>
          <p className="contact__alt">
            WhatsApp {SITE.whatsapp.exibicao}
            <br />
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>

        <form className="form" onSubmit={submit} noValidate>
          <h3>Prefere escrever?</h3>
          <p>Eu te respondo pelo WhatsApp.</p>
          <label className="field">
            <span>Seu nome</span>
            <input name="name" value={form.name} onChange={set("name")} autoComplete="name" required />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={set("whatsapp")}
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(53) 99999-9999"
              required
            />
          </label>
          <label className="field">
            <span>O que você quer resolver</span>
            <textarea
              name="message"
              value={form.message}
              onChange={set("message")}
              rows={4}
              placeholder="Ex.: perco cliente que chama fora do horário"
              required
            />
          </label>
          {status === "error" && (
            <p className="form__error" role="alert">
              A mensagem não foi enviada. Tente de novo ou chame direto no{" "}
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          )}
          <button className="btn btn--amber" type="submit" disabled={!valid || status === "sending"}>
            {status === "sending" ? "Enviando..." : "Enviar mensagem"}
          </button>

          {status === "sent" && (
            <div className="done" ref={doneRef} role="status">
              <svg viewBox="0 0 84 84" aria-hidden="true">
                <circle cx="42" cy="42" r="42" />
                <path d="M25 43l11 11 23-25" />
              </svg>
              <h4>Mensagem enviada</h4>
              <p>Obrigado, {form.name.split(" ")[0]}. Eu te respondo pelo WhatsApp {form.whatsapp}.</p>
              <button
                type="button"
                className="chip"
                onClick={() => {
                  setForm({ name: "", whatsapp: "", message: "" });
                  setStatus("idle");
                }}
              >
                Enviar outra
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
