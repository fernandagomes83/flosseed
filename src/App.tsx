import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SelfAssessment from "./pages/SelfAssessment";
import ProfileResult from "./pages/ProfileResult";
import ProjectConfiguration from "./pages/ProjectConfiguration";
import SuccessPage from "./pages/SuccessPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para resetar scroll em cada mudança de rota
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/avaliacao" element={<SelfAssessment />} />
            <Route path="/resultado-perfil" element={<ProfileResult />} />
            <Route path="/profile-result" element={<Navigate to="/resultado-perfil" replace />} />
            <Route path="/configuracao-projeto" element={<ProjectConfiguration />} />
            <Route path="/sucesso" element={<SuccessPage />} />
            {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
