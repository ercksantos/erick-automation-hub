import type { ReactNode } from "react";
import { WhatsIcon } from "./NodeMark";

// Ícones dos nós de fluxo (hero, serviços, por dentro), todos no mesmo traço.
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...stroke}>
    {children}
  </svg>
);

export const FLOW_ICONS: Record<string, ReactNode> = {
  whatsapp: <WhatsIcon />,
  roteador: svg(
    <>
      <circle cx="5" cy="12" r="2" />
      <path d="M7 12h4M11 12c2.5 0 3-6 6-6h2M11 12h8M11 12c2.5 0 3 6 6 6h2" />
    </>
  ),
  agenda: svg(
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h3" />
    </>
  ),
  duvidas: svg(
    <>
      <path d="M5 4.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
      <path d="M12 8l.9 1.9 1.9.9-1.9.9L12 13.6l-.9-1.9-1.9-.9 1.9-.9Z" />
    </>
  ),
  agente: svg(
    <>
      <path d="M5 4.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
      <path d="M12 8l.9 1.9 1.9.9-1.9.9L12 13.6l-.9-1.9-1.9-.9 1.9-.9Z" />
    </>
  ),
  equipe: svg(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  crm: svg(
    <>
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="4" height="7" rx="1.5" />
    </>
  ),
  site: svg(
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M6.5 6.8h.01M9 6.8h.01M7 13h6M7 16h4" />
    </>
  ),
  sistema: svg(
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  lembrete: svg(
    <>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  webhook: svg(
    <>
      <path d="M8.5 15.5 12 9.5a3 3 0 1 1 3.4 1.4" />
      <path d="M12 9.5 9 4.4M15.5 15.5H8.5a3 3 0 1 1-2.5-4.7" />
      <path d="M15.5 15.5a3 3 0 1 0 2.6-4.5l-3-5" />
    </>
  ),
};
