import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "./motion";

// Rolagem suave do Lenis ligada ao relógio do GSAP, como no site da proposta
// da Central de Suprimentos. Com movimento reduzido, fica a rolagem nativa.
let lenis: Lenis | null = null;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startSmoothScroll() {
  if (prefersReduced() || lenis) return () => {};
  const instance = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis = instance;
  instance.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string, { instant = false } = {}) {
  const el = id === "inicio" ? null : document.getElementById(id);
  if (id !== "inicio" && !el) return;
  // posição medida na hora: o hero fixado muda a altura da página depois que tudo monta
  const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { duration: instant ? 0 : 1.3, immediate: instant, easing: easeInOutCubic, force: true });
    return;
  }
  window.scrollTo({ top, behavior: instant || prefersReduced() ? "auto" : "smooth" });
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
