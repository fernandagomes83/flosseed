import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";

const ProfileResult = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  const profiles = [
    {
      id: 1,
      title: t('profile.1.title'),
      description: t('profile.1.description')
    },
    {
      id: 2,
      title: t('profile.2.title'),
      description: t('profile.2.description')
    },
    {
      id: 3,
      title: t('profile.3.title'),
      description: t('profile.3.description')
    },
    {
      id: 4,
      title: t('profile.4.title'),
      description: t('profile.4.description')
    }
  ];

  // Carregar perfil classificado do localStorage
  useEffect(() => {
    const classifiedProfile = localStorage.getItem('classifiedProfile');
    if (classifiedProfile) {
      const profileNumber = parseInt(classifiedProfile, 10);
      setSelectedProfile(profileNumber);
    }
  }, []);

  const handleNext = () => {
    if (selectedProfile) {
      console.log("Perfil selecionado:", selectedProfile);
      // Força scroll para o topo imediatamente e após navegação
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        navigate("/configuracao-projeto");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600/95 to-blue-600/95 backdrop-blur-xl border-b border-purple-200/60">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/avaliacao")}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('profile.back')}
            </Button>
            
            <div className="text-center">
              <h1 className="font-display text-lg font-semibold text-white">
                {t('profile.title')}
              </h1>
              <p className="text-sm text-purple-100">{t('profile.step')}</p>
            </div>

            {/* Seletor de Idioma */}
            <div className="w-20 flex justify-end">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Classificação do Professor em um perfil
          </h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg mb-8">
            <p className="text-lg font-semibold text-blue-800 mb-2">
              NÓS PROCESSAMOS SUAS RESPOSTAS NO INSTRUMENTO DE AUTO PERCEPÇÃO.
            </p>
            <p className="text-gray-700">
              Chegou no resultado da classificação do seu perfil abaixo:
            </p>
          </div>

          {/* Ícone de Perfil */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Opções de Perfil */}
        <div className="space-y-6 mb-12">
          {profiles.map((profile, index) => (
            <div 
              key={profile.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`
                bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-6 border-2 cursor-pointer
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                ${selectedProfile === profile.id 
                  ? 'border-blue-500 shadow-2xl ring-4 ring-blue-300 ring-opacity-50 bg-gradient-to-r from-blue-50 to-purple-50' 
                  : 'border-gray-200 hover:border-blue-300'
                }
              `}>
                <div className="flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                    ${selectedProfile === profile.id 
                      ? 'bg-blue-500 shadow-lg' 
                      : 'bg-gray-200'
                    }
                  `}>
                    {selectedProfile === profile.id ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-bold text-gray-500">{profile.id}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`
                      font-display text-lg font-semibold mb-2 transition-all duration-200
                      ${selectedProfile === profile.id 
                        ? 'text-blue-700' 
                        : 'text-gray-800'
                      }
                    `}>
                      {profile.title}
                    </h3>
                    
                    {selectedProfile === profile.id && (
                      <p className="text-blue-600 font-medium animate-fade-in">
                        {profile.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações Adicionais */}
        {selectedProfile && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-display text-xl font-semibold text-green-800">
                Seu perfil foi identificado!
              </h3>
            </div>
            <p className="text-green-700">
              Com base nas suas respostas, identificamos que você se enquadra no{" "}
              <span className="font-semibold">Perfil {selectedProfile}</span>. 
              Isso nos ajudará a personalizar sua experiência na plataforma.
            </p>
          </div>
        )}
      </div>

      {/* Barra inferior fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-green-600/95 backdrop-blur-xl border-t border-purple-200/60 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/avaliacao")}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Etapa anterior
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!selectedProfile}
              size="lg"
              className={`
                px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform
                ${selectedProfile 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 ring-4 ring-green-300 ring-opacity-50' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              Avançar
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileResult;