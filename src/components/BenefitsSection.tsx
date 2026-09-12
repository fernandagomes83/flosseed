import { GraduationCap, Users, Building } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const BenefitsSection = () => {
  const { t } = useLanguage();
  const benefitGroups = [
    {
      icon: GraduationCap,
      title: t('benefits.educators.title'),
      color: "primary",
      benefits: [
        t('benefits.educators.1'),
        t('benefits.educators.2'),
        t('benefits.educators.3'),
        t('benefits.educators.4')
      ]
    },
    {
      icon: Users,
      title: t('benefits.students.title'), 
      color: "secondary",
      benefits: [
        t('benefits.students.1'),
        t('benefits.students.2'),
        t('benefits.students.3'),
        t('benefits.students.4')
      ]
    },
    {
      icon: Building,
      title: t('benefits.institutions.title'),
      color: "accent",
      benefits: [
        t('benefits.institutions.1'),
        t('benefits.institutions.2'),
        t('benefits.institutions.3'),
        t('benefits.institutions.4')
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('benefits.title.part1')}{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('benefits.title.part2')}
            </span>{" "}
            {t('benefits.title.part3')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('benefits.description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {benefitGroups.map((group, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-${group.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <group.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">
                  {group.title}
                </h3>
              </div>
              
              <ul className="space-y-4">
                {group.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start">
                    <div className={`w-2 h-2 bg-${group.color} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                    <span className="text-muted-foreground leading-relaxed">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Seção de Estatísticas */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl font-bold text-primary mb-2">60+</div>
            <div className="text-muted-foreground">{t('benefits.stats.1')}</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl font-bold text-secondary mb-2">2</div>
            <div className="text-muted-foreground">{t('benefits.stats.2')}</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-4xl font-bold text-accent mb-2">4</div>
            <div className="text-muted-foreground">{t('benefits.stats.3')}</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="text-4xl font-bold text-primary mb-2">4</div>
            <div className="text-muted-foreground">{t('benefits.stats.4')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;