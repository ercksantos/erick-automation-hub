import { prefersReduced } from "./motion";

// Rolagem nativa do navegador: nada de rolagem suave sequestrada.
// Os links do menu andam com behavior "smooth" (ou pulam, com movimento reduzido).

export function scrollToId(id: string, { instant = false } = {}) {
  const el = id === "inicio" ? null : document.getElementById(id);
  if (id !== "inicio" && !el) return;
  // posição medida na hora: as seções mudam de altura depois que tudo monta
  const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior: instant || prefersReduced() ? "auto" : "smooth" });
}

export function setScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
