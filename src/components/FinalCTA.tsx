import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Download, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
const FinalCTA = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-10"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-glow/20 rounded-full blur-3xl animate-float" style={{
      animationDelay: '1.5s'
    }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center text-white animate-fade-in">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            {t('finalcta.title.part1')}{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              {t('finalcta.title.part2')}
            </span>{" "}
            {t('finalcta.title.part3')}
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {t('finalcta.description')}
          </p>

          {/* Botões Principais de CTA */}
          <div className="flex justify-center mb-12">
            <Button 
              variant="cta" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => navigate("/entrar")}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {t('finalcta.button')}
            </Button>
          </div>

          {/* Prova Social */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-6 w-6 mr-2 text-accent" />
              <span className="text-white/90">{t('finalcta.social.title')}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-accent mb-2">4</div>
                <div className="text-white/80 text-sm">{t('finalcta.social.educators')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">60+</div>
                <div className="text-white/80 text-sm">{t('finalcta.social.students')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">2</div>
                <div className="text-white/80 text-sm">{t('finalcta.social.institutions')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">4</div>
                <div className="text-white/80 text-sm">{t('finalcta.social.satisfaction')}</div>
              </div>
            </div>
          </div>

          {/* Benefícios Adicionais */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-accent text-lg font-semibold mb-2">{t('finalcta.benefit1.title')}</div>
              <div className="text-white/80 text-sm">{t('finalcta.benefit1.description')}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-secondary text-lg font-semibold mb-2">{t('finalcta.benefit2.title')}</div>
              <div className="text-white/80 text-sm">{t('finalcta.benefit2.description')}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="text-accent text-lg font-semibold mb-2">{t('finalcta.benefit3.title')}</div>
              <div className="text-white/80 text-sm">{t('finalcta.benefit3.description')}</div>
            </div>
          </div>

          {/* Mensagem Final */}
          <div className="mt-12 text-center">
            <p className="text-white/70 text-sm max-w-2xl mx-auto">
              {t('finalcta.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default FinalCTA;