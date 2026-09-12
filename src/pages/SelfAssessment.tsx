import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, User, GraduationCap, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";

interface Question {
  id: string;
  text: string;
  category: string;
}

const SelfAssessment = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Carregar dados do usuário do localStorage apenas se não for anônimo
    const savedUserData = localStorage.getItem('userData');
    const isAnonymous = localStorage.getItem('isAnonymous') === 'true';
    
    if (savedUserData && !isAnonymous) {
      setUserData(JSON.parse(savedUserData));
    } else {
      // Se for anônimo ou não tiver dados, limpar dados do usuário
      setUserData(null);
      if (isAnonymous) {
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const questions: Question[] = [
    {
      id: "q1",
      text: t('assessment.questions.1'),
      category: t('assessment.category.software')
    },
    {
      id: "q2", 
      text: t('assessment.questions.2'),
      category: ""
    },
    {
      id: "q3",
      text: t('assessment.questions.3'),
      category: ""
    },
    {
      id: "q4",
      text: t('assessment.questions.4'),
      category: ""
    },
    {
      id: "q5",
      text: t('assessment.questions.5'),
      category: t('assessment.category.oss')
    },
    {
      id: "q6",
      text: t('assessment.questions.6'),
      category: ""
    },
    {
      id: "q7",
      text: t('assessment.questions.7'),
      category: ""
    },
    {
      id: "q8",
      text: t('assessment.questions.8'),
      category: ""
    }
  ];

  const options = [
    { value: "1", label: t('assessment.option.strongly.disagree'), color: "bg-red-50 border-red-200 text-red-700" },
    { value: "2", label: t('assessment.option.disagree'), color: "bg-orange-50 border-orange-200 text-orange-700" },
    { value: "3", label: t('assessment.option.agree'), color: "bg-blue-50 border-blue-200 text-blue-700" },
    { value: "4", label: t('assessment.option.strongly.agree'), color: "bg-green-50 border-green-200 text-green-700" }
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Encontrar a próxima pergunta sem resposta
    const currentIndex = questions.findIndex(q => q.id === questionId);
    const nextUnansweredQuestion = questions.find((q, index) => 
      index > currentIndex && !answers[q.id] && q.id !== questionId
    );

    // Se há uma próxima pergunta sem resposta, fazer scroll suave para ela após um delay
    if (nextUnansweredQuestion) {
      setTimeout(() => {
        const nextElement = document.getElementById(nextUnansweredQuestion.id);
        if (nextElement) {
          nextElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 300);
    }
  };

  const canProceed = questions.every(q => answers[q.id]);
  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;

  const classifyProfile = (answers: Record<string, string>): number => {
    // Mapear perguntas por categoria
    const softwareQuestions = ['q1', 'q2', 'q3', 'q4']; // Questões 1-4: Desenvolvimento de Software
    const ossQuestions = ['q5', 'q6', 'q7', 'q8']; // Questões 5-8: Projetos de Código Aberto
    
    // Contar respostas positivas (3: Concordo parcialmente, 4: Concordo totalmente)
    const countPositiveAnswers = (questionIds: string[]) => {
      return questionIds.filter(id => answers[id] === '3' || answers[id] === '4').length;
    };
    
    const softwarePositive = countPositiveAnswers(softwareQuestions);
    const ossPositive = countPositiveAnswers(ossQuestions);
    
    // Determinar se é experiente (maioria das respostas positivas)
    const isExperiencedSoftware = softwarePositive >= 2; // Maioria de 4 questões
    const isExperiencedOSS = ossPositive >= 2; // Maioria de 4 questões
    
    // Classificar perfil conforme as regras
    if (isExperiencedSoftware && isExperiencedOSS) {
      return 1; // Experiente em ambos
    } else if (isExperiencedSoftware && !isExperiencedOSS) {
      return 2; // Experiente apenas em software
    } else if (!isExperiencedSoftware && isExperiencedOSS) {
      return 3; // Experiente apenas em OSS
    } else {
      return 4; // Inexperiente em ambos
    }
  };

  const handleNext = () => {
    if (canProceed) {
      const profileNumber = classifyProfile(answers);
      
      // Salvar respostas e perfil no localStorage
      localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
      localStorage.setItem('classifiedProfile', profileNumber.toString());
      
      console.log("Perfil classificado:", profileNumber);
      console.log("Respostas:", answers);
      
      navigate("/resultado-perfil");
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
              onClick={() => navigate("/entrar")}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('assessment.back')}
            </Button>
            
            <div className="text-center">
              <h1 className="font-display text-lg font-semibold text-white">
                {t('assessment.title')}
              </h1>
              <p className="text-sm text-purple-100">{t('assessment.step')}</p>
            </div>

            {/* Seletor de Idioma */}
            <div className="w-20 flex justify-end">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 text-right">
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {Object.keys(answers).length} de {questions.length} {t('assessment.progress')}
            </span>
          </div>
        </div>
      </div>

      {/* Seção de Boas-vindas */}
      {userData && (
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-gradient-to-r from-white via-purple-50/50 to-blue-50/50 rounded-3xl shadow-lg border-2 border-purple-200/40 p-8 animate-fade-in">
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {t('assessment.welcome')}, {userData.name}! 👋
                </h2>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-purple-200">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">{userData.institution}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-blue-200">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{userData.course}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            {t('assessment.evaluate')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {t('assessment.description')}
          </p>
        </div>

        <div className="space-y-12">
          {questions.map((question, index) => (
            <div 
              key={question.id} 
              id={question.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cabeçalho da categoria */}
              {question.category && (
                <div className="mb-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-200 shadow-md">
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent uppercase tracking-wider">
                      {question.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Card da Pergunta */}
              <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-lg border-2 border-gradient-to-r border-purple-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      {answers[question.id] ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-sm font-bold text-white">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-xl font-semibold text-gray-800 leading-relaxed">
                        {question.text}
                      </p>
                    </div>
                  </div>

                  {/* Opções de radio */}
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {options.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem 
                          value={option.value} 
                          id={`${question.id}-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label 
                          htmlFor={`${question.id}-${option.value}`}
                          className={`
                            flex items-center justify-center p-5 rounded-2xl border-3 cursor-pointer
                            transition-all duration-300 peer-checked:scale-110 peer-checked:shadow-2xl
                            hover:scale-105 hover:shadow-xl text-center font-semibold transform
                            ${answers[question.id] === option.value 
                              ? `${option.color} border-current shadow-2xl ring-4 ring-offset-2 ring-purple-300` 
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-700 hover:from-purple-50 hover:to-blue-50 hover:border-purple-300'
                            }
                          `}
                        >
                          <span className="text-sm leading-tight">
                            {option.label}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-green-600/95 backdrop-blur-xl border-t border-purple-200/60 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/90">
              {canProceed ? (
                <span className="text-green-200 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {t('assessment.all.answered')}
                </span>
              ) : (
                `${questions.length - Object.keys(answers).length} ${t('assessment.questions.remaining')}`
              )}
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed}
              size="lg"
              className={`
                px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform
                ${canProceed 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 ring-4 ring-green-300 ring-opacity-50' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {t('assessment.continue')}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfAssessment;