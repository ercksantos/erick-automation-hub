import { createRoot } from "react-dom/client";
import "lenis/dist/lenis.css";
import App from "./App.tsx";
import "./index.css";
import "./styles/site.css";

const root = document.documentElement;
root.classList.add("js");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) root.classList.add("no-motion");
document.body.classList.add("site");
// a página decide onde abrir (topo ou /#secao): o navegador não restaura a rolagem antiga
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")!).render(<App />);
