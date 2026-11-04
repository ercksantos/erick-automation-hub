import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// a home carrega sozinha; o resto vem só quando alguém abre a página
const TesteGratis = lazy(() => import("./pages/TesteGratis"));
const Privacidade = lazy(() => import("./pages/Privacidade"));
const Termos = lazy(() => import("./pages/Termos"));

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* fora do menu e do sitemap enquanto não houver crédito de LLM para o agente responder */}
        <Route path="/teste-gratis" element={<TesteGratis />} />
        {/* /privacidade (com #exclusao-de-dados) e /termos estão cadastradas no app da Meta: não mudar */}
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
