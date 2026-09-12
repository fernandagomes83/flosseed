import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie, Shield, Info } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookiesAccepted", "all");
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookiesAccepted", "necessary");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-background border-border shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Políticas de Cookies e Privacidade
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies essenciais para garantir o funcionamento adequado do site. 
              Em conformidade com a <strong>LGPD (Lei 13.709/2018)</strong>, informamos que 
              não coletamos dados pessoais sem seu consentimento explícito.
            </p>

            {showDetails && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Cookies Essenciais</span>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Necessários para o funcionamento básico do site (navegação, sessão).
                </p>

                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Seus Direitos (LGPD)</span>
                </div>
                <ul className="text-xs text-muted-foreground ml-6 space-y-1">
                  <li>• Acesso aos seus dados pessoais</li>
                  <li>• Correção de dados incompletos ou incorretos</li>
                  <li>• Exclusão de dados pessoais</li>
                  <li>• Portabilidade dos dados</li>
                  <li>• Revogação do consentimento</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptAll}
                className="flex-1"
                size="sm"
              >
                Aceitar Todos os Cookies
              </Button>
              <Button
                onClick={handleAcceptNecessary}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Apenas Essenciais
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                {showDetails ? "Ocultar" : "Detalhes"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Para mais informações, consulte nossa{" "}
              <button 
                className="text-primary hover:underline"
                onClick={() => window.open("#politica-privacidade", "_blank")}
              >
                Política de Privacidade
              </button>
              {" "}ou entre em contato através do e-mail:{" "}
              <a href="mailto:privacidade@osssee.com" className="text-primary hover:underline">
                privacidade@osssee.com
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;