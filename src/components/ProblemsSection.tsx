import { AlertTriangle, Users, Search, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const ProblemsSection = () => {
  const { t } = useLanguage();
  const problems = [
    {
      icon: BookOpen,
      title: t('problems.1.title'),
      description: t('problems.1.description')
    },
    {
      icon: Users,
      title: t('problems.2.title'), 
      description: t('problems.2.description')
    },
    {
      icon: Search,
      title: t('problems.3.title'),
      description: t('problems.3.description')
    },
    {
      icon: AlertTriangle,
      title: t('problems.4.title'),
      description: t('problems.4.description')
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('problems.title.part1')}{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('problems.title.part2')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('problems.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-4">
                <problem.icon className="h-7 w-7 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;