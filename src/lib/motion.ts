import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, useGSAP);

export { gsap, ScrollTrigger, Draggable, useGSAP };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// largura em que as listas viram coluna e os fios passam a descer na vertical
export const DESKTOP = "(min-width: 981px)";
export const MOBILE = "(max-width: 980px)";
// o gsap.matchMedia só chama a função quando alguma condição bate: desktop e mobile
// juntos cobrem todas as larguras, e reduce diz se o movimento deve ficar parado
export const MEDIA = { desktop: DESKTOP, mobile: MOBILE, reduce: "(prefers-reduced-motion: reduce)" };
// mouse de verdade: arrastar nó e inclinar placa só fazem sentido com ele
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
