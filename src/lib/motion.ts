import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// largura em que o hero deixa de prender a rolagem e as listas viram coluna
export const DESKTOP = "(min-width: 981px)";
export const MOBILE = "(max-width: 980px)";
// o gsap.matchMedia só chama a função quando alguma condição bate: desktop e mobile
// juntos cobrem todas as larguras, e reduce diz se o movimento deve ficar parado
export const MEDIA = { desktop: DESKTOP, mobile: MOBILE, reduce: "(prefers-reduced-motion: reduce)" };
