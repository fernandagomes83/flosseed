import { User, Cog, Search, ClipboardList, Sliders, Wrench } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const FeaturesSection = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: User,
      title: t('features.1.title'),
      items: [
        t('features.1.item1'),
        t('features.1.item2'), 
        t('features.1.item3')
      ]
    },
    {
      icon: Cog,
      title: t('features.2.title'),
      items: [
        t('features.2.item1'),
        t('features.2.item2'),
        t('features.2.item3')
      ]
    },
    {
      icon: Search,
      title: t('features.3.title'),
      items: [
        t('features.3.item1'),
        t('features.3.item2'),
        t('features.3.item3')
      ]
    },
    {
      icon: ClipboardList,
      title: t('features.4.title'),
      items: [
        t('features.4.item1'),
        t('features.4.item2'),
        t('features.4.item3')
      ]
    },
    {
      icon: Sliders,
      title: t('features.5.title'),
      items: [
        t('features.5.item1'),
        t('features.5.item2'),
        t('features.5.item3')
      ]
    },
    {
      icon: Wrench,
      title: t('features.6.title'),
      items: [
        t('features.6.item1'),
        t('features.6.item2'),
        t('features.6.item3')
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t('features.title.part1')}{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('features.title.part2')}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
              </div>
              
              <ul className="space-y-3">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;