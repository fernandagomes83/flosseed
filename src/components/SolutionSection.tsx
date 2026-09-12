import { Brain, Settings, Target, BarChart3, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const SolutionSection = () => {
  const { t } = useLanguage();
  const benefits = [
    {
      icon: Brain,
      title: t('solution.1.title'),
      description: t('solution.1.description')
    },
    {
      icon: Settings,
      title: t('solution.2.title'), 
      description: t('solution.2.description')
    },
    {
      icon: Target,
      title: t('solution.3.title'),
      description: t('solution.3.description')
    },
    {
      icon: BarChart3,
      title: t('solution.4.title'),
      description: t('solution.4.description')
    },
    {
      icon: Shield,
      title: t('solution.5.title'),
      description: t('solution.5.description')
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('solution.title.part1')}{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              {t('solution.title.part2')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('solution.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {benefits.slice(0, 3).map((benefit, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {benefits.slice(3).map((benefit, index) => (
            <div 
              key={index + 3}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in group"
              style={{ animationDelay: `${(index + 3) * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;