import { Shield, Mail, FileText } from "lucide-react";

const PrivacyFooter = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações LGPD */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">Proteção de Dados</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Em conformidade com a LGPD (Lei 13.709/2018), respeitamos sua privacidade 
              e protegemos seus dados pessoais.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">Contato - Privacidade</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                DPO (Encarregado de Dados):
              </p>
              <a 
                href="mailto:privacidade@osssee.com" 
                className="text-sm text-primary hover:underline"
              >
                privacidade@osssee.com
              </a>
            </div>
          </div>

          {/* Links Legais */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">Documentos Legais</h4>
            </div>
            <div className="space-y-1">
              <button className="text-sm text-primary hover:underline block text-left">
                Política de Privacidade
              </button>
              <button className="text-sm text-primary hover:underline block text-left">
                Termos de Uso
              </button>
              <button className="text-sm text-primary hover:underline block text-left">
                Política de Cookies
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 FLOSSeed. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Este site está em conformidade com a LGPD - Lei 13.709/2018
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PrivacyFooter;