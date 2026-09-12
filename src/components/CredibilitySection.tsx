import { Award, BookOpen, CheckCircle, TrendingUp } from "lucide-react";

const CredibilitySection = () => {
  const credibilityItems = [
    {
      icon: BookOpen,
      title: "Taxonomia de Bloom",
      description: "Objetivos de aprendizagem organizados por níveis: Familiaridade, Uso e Avaliação",
      badge: "Pedagogia"
    },
    {
      icon: Award,
      title: "Critérios de Seleção OSS", 
      description: "Baseado em critérios acadêmicos para seleção de projetos Open Source educacionais",
      badge: "Metodologia"
    },
    {
      icon: CheckCircle,
      title: "Ferramenta Open Source",
      description: "Desenvolvido usando tecnologias abertas: React, TypeScript, Tailwind CSS",
      badge: "Tecnologia"
    },
    {
      icon: TrendingUp,
      title: "Interface Web",
      description: "Aplicação web responsiva para facilitar o acesso de educadores",
      badge: "Usabilidade"
    }
  ];

  const testimonials = [
    // Testimonials removidos para manter abordagem acadêmica
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Desenvolvimento{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Acadêmico
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            FLOSSeed foi desenvolvido como ferramenta de apoio ao ensino, fundamentado em pesquisa acadêmica e metodologias pedagógicas estabelecidas.
          </p>
        </div>

        {/* Itens de Credibilidade */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {credibilityItems.map((item, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 animate-fade-in group text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                {item.badge}
              </div>
              
              <h3 className="text-lg font-semibold text-card-foreground mb-3">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção de Depoimentos removida para manter tom acadêmico */}

        {/* Apoio da Pesquisa */}
        <div className="mt-16 bg-primary rounded-xl p-8 text-white text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold mb-4">Base Científica</h3>
          <p className="text-white/90 mb-6 max-w-3xl mx-auto">
            Desenvolvimento baseado em metodologias pedagógicas e critérios validados para uso de projetos OSS na educação.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-accent">3</div>
              <div className="text-sm text-white/80">Níveis de aprendizagem</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">60+</div>
              <div className="text-sm text-white/80">Objetivos disponíveis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">2</div>
              <div className="text-sm text-white/80">Temas cobertos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">4</div>
              <div className="text-sm text-white/80">Perfis de instrutor</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredibilitySection;