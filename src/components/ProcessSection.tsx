import { CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const ProcessSection = () => {
  const { t } = useLanguage();
  const steps = [
    {
      number: "01",
      title: t('process.1.title'),
      description: t('process.1.description'),
      highlight: t('process.1.highlight')
    },
    {
      number: "02", 
      title: t('process.2.title'),
      description: t('process.2.description'),
      highlight: t('process.2.highlight')
    },
    {
      number: "03",
      title: t('process.3.title'),
      description: t('process.3.description'),
      highlight: t('process.3.highlight')
    },
    {
      number: "04",
      title: t('process.4.title'),
      description: t('process.4.description'),
      highlight: t('process.4.highlight')
    },
    {
      number: "05",
      title: t('process.5.title'),
      description: t('process.5.description'),
      highlight: t('process.5.highlight')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('process.title.part1')}{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              {t('process.title.part2')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('process.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start mb-12 last:mb-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Número da Etapa */}
              <div className="flex-shrink-0 mr-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-elegant">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-primary/20 mx-auto mt-4"></div>
                )}
              </div>

              {/* Conteúdo da Etapa */}
              <div className="flex-1 bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <div className="flex items-center text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {step.highlight}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-end mt-4 text-primary">
                    <span className="text-sm mr-2">{t('process.next')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Processo */}
        <div className="mt-16 bg-gradient-primary rounded-xl p-8 text-white text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold mb-4">Processo Completo em Minutos</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Todo o processo de configuração leva apenas alguns minutos, mas os benefícios 
            se estendem por todo o semestre letivo.
          </p>
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-bold text-accent">5 min</div>
              <div className="text-sm text-white/80">Setup inicial</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">1 sem</div>
              <div className="text-sm text-white/80">Implementação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">Todo semestre</div>
              <div className="text-sm text-white/80">Benefícios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;