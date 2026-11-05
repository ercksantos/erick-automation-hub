import { useLayoutEffect, useRef, useState } from "react";
import { SITE, waLink } from "@/content/site";
import { gsap, prefersReduced } from "@/lib/motion";
import { WhatsIcon } from "./NodeMark";
import { SecTag } from "./SecTag";

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
  const [ms, setMs] = useState(0);
  const doneRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "whatsapp" ? formatPhone(e.target.value) : e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const t0 = performance.now();
    try {
      const res = await fetch(SITE.webhookContato, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company: "", email: "", origem: "site" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setMs(Math.round(performance.now() - t0));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  // confirmação: o log da chamada de verdade ao n8n aparece linha por linha
  useLayoutEffect(() => {
    if (status !== "sent" || !doneRef.current || prefersReduced()) return;
    const el = doneRef.current;
    gsap
      .timeline()
      .from(el, { opacity: 0.4, duration: 0.2 })
      .from(el.querySelectorAll(".done__log li"), { autoAlpha: 0, x: -8, duration: 0.3, stagger: 0.32, ease: "power2.out" }, 0.1)
      .from(el.querySelectorAll("h4, .done > p, .done > button"), { y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, 1);
  }, [status]);

  const valid = form.name.trim().length > 1 && form.whatsapp.replace(/\D/g, "").length >= 10 && form.message.trim().length > 3;

  return (
    <section className="sec contact" id="contato">
      <div className="wrap contact__grid">
        <div>
          <SecTag id="contato" />
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
              <ol className="done__log" aria-hidden="true">
                <li>
                  <span>→</span> POST n8n.erickai.com.br/webhook/contato-site
                </li>
                <li>
                  <span>←</span> 200 OK em {ms} ms
                </li>
                <li>
                  <span>✓</span> contato gravado no meu n8n
                </li>
              </ol>
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
