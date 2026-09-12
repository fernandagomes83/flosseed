import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import heroImage from "@/assets/hero-image.jpg";
const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-glow/20 rounded-full blur-3xl animate-float" style={{
      animationDelay: '1s'
    }}></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Conteúdo */}
          <div className="text-white space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              {t('hero.title.part1')}{" "}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                {t('hero.title.part2')}
              </span>{" "}
              {t('hero.title.part3')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              {t('hero.description')}
            </p>
            
            <div className="flex justify-center sm:justify-start pt-4">
              <Button 
                variant="cta" 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate("/entrar")}
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="pt-8 grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-white/80">{t('hero.stats.free')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">60+</div>
                <div className="text-sm text-white/80">{t('hero.stats.strategies')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">4</div>
                <div className="text-sm text-white/80">{t('hero.stats.profiles')}</div>
              </div>
            </div>
          </div>
          
          {/* Imagem Hero */}
          <div className="relative animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <div className="relative">
              <img src={heroImage} alt={t('hero.alt')} className="w-full h-auto rounded-2xl shadow-glow" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;