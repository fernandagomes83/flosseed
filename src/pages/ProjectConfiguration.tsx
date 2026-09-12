import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Settings, CheckCircle2, HelpCircle, Star, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";

const ProjectConfiguration = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    tema: "",
    nivelAprendizagem: "",
    objetivoAprendizagem: "",
    tarefasSala: [] as string[],
    estrategiaAvaliacao: "",
    nivelControle: "",
    escolhaProjeto: "",
    criteriosSelecao: [] as string[],
    ferramentasTecnologicas: [] as string[]
  });
  const [profileNumber, setProfileNumber] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<Partial<typeof formData>>({});

  // Carregar perfil e aplicar sugestões
  useEffect(() => {
    // Força scroll para o topo quando a página carregar
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const classifiedProfile = localStorage.getItem('classifiedProfile');
    if (classifiedProfile) {
      const profile = parseInt(classifiedProfile, 10);
      setProfileNumber(profile);
      console.log('Loading profile:', profile);
      applySuggestionsForProfile(profile);
    }
  }, []);

  // Força scroll para o topo quando o componente montar
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const applySuggestionsForProfile = (profile: number) => {
    const profileSuggestions: Partial<typeof formData> = {};

    // Tema: perfil 4 → modelagem de software
    if (profile === 4) {
      profileSuggestions.tema = t('config.theme.software.modeling');
    }

    // Nível de aprendizagem
    if (profile === 2 || profile === 4) {
      profileSuggestions.nivelAprendizagem = t('config.learning.level.familiarity');
    }
    // Para perfil 2, se já tiver familiaridade, adicionar uso
    if (profile === 2) {
      // Note: Como é um select, vamos priorizar "uso" para perfil 2
      profileSuggestions.nivelAprendizagem = t('config.learning.level.usage');
    }

    // Nível de controle do projeto
    if (profile === 1) {
      profileSuggestions.nivelControle = t('config.control.none');
    } else if (profile === 2) {
      profileSuggestions.nivelControle = t('config.control.internal');
    } else if (profile === 3) {
      profileSuggestions.nivelControle = t('config.control.internal.external');
    } else if (profile === 4) {
      profileSuggestions.nivelControle = t('config.control.total');
    }

    // Escolha do projeto OSS
    if (profile === 1) {
      profileSuggestions.escolhaProjeto = t('config.project.free');
    } else if (profile === 2 || profile === 3) {
      profileSuggestions.escolhaProjeto = t('config.project.list');
    } else if (profile === 4) {
      profileSuggestions.escolhaProjeto = t('config.project.predefined');
    }

    // Armazenar sugestões sem aplicar automaticamente
    setSuggestions(profileSuggestions);
    console.log('Generated suggestions for profile:', profile, profileSuggestions);
    console.log('Current suggestions state after setting:', profileSuggestions);
  };

  // Função para aplicar uma sugestão específica
  const applySuggestion = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove a sugestão depois de aplicada
    setSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[field];
      return newSuggestions;
    });
  };


  // Mapeamento da Taxonomia de Bloom
  const getBloomLevel = (nivelAprendizagem: string) => {
    if (nivelAprendizagem === t('config.learning.level.familiarity')) return 'N1';
    if (nivelAprendizagem === t('config.learning.level.usage')) return 'N3';
    if (nivelAprendizagem === t('config.learning.level.evaluation')) return 'N5';
    return null;
  };

  // Sugestões de estratégias baseadas na Taxonomia de Bloom
  const getBloomSuggestions = (bloomLevel: string | null) => {
    switch (bloomLevel) {
      case 'N1':
        return [
          t('config.evaluation.exams'),
          t('config.evaluation.interviews'),
          t('config.evaluation.seminars'),
          t('config.evaluation.diary'),
          t('config.evaluation.exercises'),
          t('config.evaluation.research'),
          "Apresentações" // Adding the missing one from requirements
        ];
      case 'N3':
        return [
          t('config.evaluation.artifacts'),
          t('config.evaluation.portfolio'),
          t('config.evaluation.participation')
        ];
      case 'N5':
        return [
          t('config.evaluation.reports'),
          t('config.evaluation.acceptance'),
          t('config.evaluation.essay')
        ];
      default:
        return [];
    }
  };

  // Função para obter sugestões de critérios baseadas no nível de controle (apenas visual, não aplica automaticamente)
  const getControlSuggestions = (nivelControle: string) => {
    if (nivelControle === t('config.control.none')) {
      return [
        t('config.criteria.acceptance'),
        t('config.criteria.community'),
        t('config.criteria.active')
      ];
    }
    if (nivelControle === t('config.control.internal.external')) {
      return [
        t('config.criteria.acceptance'),
        t('config.criteria.community'),
        t('config.criteria.active')
      ];
    }
    // Para total controle, nenhuma sugestão
    return [];
  };

  // Função para obter sugestões de critérios baseadas na escolha do projeto (apenas visual, não aplica automaticamente)
  const getProjectChoiceSuggestions = (escolhaProjeto: string) => {
    if (escolhaProjeto === t('config.project.free')) {
      return [
        t('config.criteria.size'),
        t('config.criteria.domain')
      ];
    }
    return [];
  };

  // Função para lidar com mudanças nos selects e navegar automaticamente
  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Limpar campos dependentes quando tema ou nível mudarem
      if (field === 'tema') {
        newData.objetivoAprendizagem = '';
        newData.tarefasSala = [];
      } else if (field === 'nivelAprendizagem') {
        newData.objetivoAprendizagem = '';
        newData.tarefasSala = [];
      } else if (field === 'objetivoAprendizagem') {
        newData.tarefasSala = [];
      }
      
      return newData;
    });
    
    // Se o campo for "nivelAprendizagem", aplicar sugestões da Taxonomia de Bloom
    if (field === 'nivelAprendizagem') {
      const bloomLevel = getBloomLevel(value);
      const bloomSuggestions = getBloomSuggestions(bloomLevel);
      
      if (bloomSuggestions.length > 0) {
        // Sugerir a primeira estratégia da lista baseada no nível de Bloom
        setSuggestions(prev => ({
          ...prev,
          estrategiaAvaliacao: bloomSuggestions[0]
        }));
      }
    }
    
    // Não aplicar automaticamente critérios de seleção - apenas mostrar sugestões visuais
  };

  const temas = [
    t('config.theme.software.testing'),
    t('config.theme.software.modeling')
  ];

  const niveisAprendizagem = [
    t('config.learning.level.familiarity'),
    t('config.learning.level.usage'), 
    t('config.learning.level.evaluation')
  ];

  // Dados dos objetivos de aprendizagem por tema e nível
  const getObjetivosAprendizagemData = () => {
    const tema = formData.tema;
    const nivel = formData.nivelAprendizagem;
    
    if (tema === t('config.theme.software.modeling')) {
      if (nivel === t('config.learning.level.familiarity')) {
        return [
          {
            id: 'LO114',
            area: 'Manutenção de Software',
            titulo: 'Perceber a importância da documentação para a manutenção de software',
            tarefas: [
              'Verificar se o projeto está documentado, se a documentação está atualizada.',
              'Fazer a manutenção para uma parte não documentada do projeto.',
              'Fazer a manutenção para uma parte documentada do projeto.',
              'Fazer manutenção em um OSS com boa documentação e em outro OSS com pouca documentação e discutir as dificuldades.'
            ]
          },
          {
            id: 'LO171',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Demonstrar os conceitos e práticas da notação UML.',
            tarefas: [
              'Interpretar os modelos de especificação de requisitos disponibilizados pela comunidade.',
              'Comparar modelos de especificação em projetos OS distintos.',
              'Atualizar a especificação em pelo menos um dos projetos (para o nível de "uso").'
            ]
          },
          {
            id: 'LO321',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Descrever o papel das técnicas de especificação e análise formais podem assumir no desenvolvimento de software complexo.',
            tarefas: [
              'Desenvolver a especificação formal para um módulo complexo do OSS e apresentá-la aos alunos.',
              'Descrever o objetivo e a importância dessa especificação.'
            ]
          },
          {
            id: 'LO323',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Explicar as vantagens e desvantagens do uso de linguagens de especificação formal.',
            tarefas: [
              'Visualizando um exemplo de especificação formal elaborado para um OSS, deve-se comparar as duas especificações, identificando vantagens e desvantagens.'
            ]
          }
        ];
      } else if (nivel === t('config.learning.level.usage')) {
        return [
          {
            id: 'LO5',
            area: 'Requisitos de Software',
            titulo: 'Listar os principais componentes de um caso de uso ou descrição similar para algum comportamento requerido de um software',
            tarefas: [
              'Criar ou atualizar o diagrama de casos de uso para o projeto',
              'Descrever um caso de uso para uma funcionalidade importante do projeto',
              'Propor novos casos de uso para o projeto (sendo baseados nos comentários da comunidade ou não)'
            ]
          },
          {
            id: 'LO06',
            area: 'Requisitos de Software',
            titulo: 'Usar método comum (não formal) para modelar e especificar os requisitos de software de médio porte',
            tarefas: [
              'Produzir, complementar ou atualizar a documentação dos requisitos do projeto (usar o software, criar ou atualizar especificações, usar templates porventura existentes, incluir diagramas).'
            ]
          },
          {
            id: 'LO278',
            area: 'Requisitos de Software',
            titulo: 'Traduzir a especificação de requisitos de software escrita em linguagem formal para a linguagem natural',
            tarefas: []
          },
          {
            id: 'LO169',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Demonstrar os conceitos e práticas da notação UML.',
            tarefas: [
              'Entender os modelos existentes.',
              'Atualizar modelos porventura desatualizados.',
              'Elaborar modelos inexistentes.'
            ]
          },
          {
            id: 'LO322',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Aplicar técnicas de especificação e análise formais no projeto e desenvolvimento de um software de baixa complexidade.',
            tarefas: [
              'Os alunos deverão desenvolver a especificação formal de um OSS simples.'
            ]
          }
        ];
      } else if (nivel === t('config.learning.level.evaluation')) {
        return [
          {
            id: 'LO13',
            area: 'Design de Software',
            titulo: 'Explicar a relação entre os requisitos do software e seu design, usando os modelos apropriados.',
            tarefas: [
              'Identificar no projeto como os requisitos foram projetados e implementados no código.',
              'Criar ou atualizar os modelos, de modo que estes reflitam o que foi implementado.',
              'Discutir a importância do design.'
            ]
          }
        ];
      }
    } else if (tema === t('config.theme.software.testing')) {
      if (nivel === t('config.learning.level.familiarity')) {
        return [
          {
            id: 'LO81',
            area: 'Construção de Software',
            titulo: 'Identificar os princípios fundamentais do método de desenvolvimento dirigido por testes e explicar o papel da automatização dos testes nesse método.',
            tarefas: [
              'Exemplificar como um determinado componente do projeto poderia ser desenvolvido a partir do método de desenvolvimento dirigido por testes.',
              'Demonstrar a construção do componente a partir da implementação e execução dos testes.'
            ]
          },
          {
            id: 'LO90',
            area: 'Testes de Software',
            titulo: 'Descrever os conceitos e práticas relacionadas ao teste de software.',
            tarefas: [
              'O professor demonstra os conceitos e as práticas de testes usando o OSS.'
            ]
          },
          {
            id: 'LO91',
            area: 'Testes de Software',
            titulo: 'Entender a diferença entre testar pequenos programas e testar software de grande porte.',
            tarefas: [
              'Criar testes para um pequeno programa isolado e depois criar testes para todo o software (relacionado ao LO95, LO101, LO104).'
            ]
          },
          {
            id: 'LO92',
            area: 'Testes de Software',
            titulo: 'Discutir as limitações de testar softwares em domínios particulares.',
            tarefas: [
              'Selecionar projetos OS de diferentes domínios (Web e Mobile) para entender as diferenças entre os testes.'
            ]
          },
          {
            id: 'LO93',
            area: 'Testes de Software',
            titulo: 'Descrever os conceitos e práticas relacionadas ao teste de software.',
            tarefas: [
              'Avaliar o conjunto de testes existentes para um projeto OSS de médio porte.'
            ]
          },
          {
            id: 'LO94',
            area: 'Testes de Software',
            titulo: 'Discutir as questões envolvidas em testar um software orientado a objetos.',
            tarefas: [
              'O prof. demonstra exemplos das questões que envolvem testar software OO. Alunos identificam outros exemplos e elaboram testes para esses casos.',
              'Avaliar testes em diferentes projetos OS implementados segundo o paradigma OO e discutir características.'
            ]
          },
          {
            id: 'LO102',
            area: 'Testes de Software',
            titulo: 'Descrever técnicas para identificar casos de testes significantes para integração, regressão e testes de sistema.',
            tarefas: [
              'Demonstrar as técnicas usando o projeto, como exemplo (Relacionado ao LO103, LO95, LO100).'
            ]
          },
          {
            id: 'LO103',
            area: 'Testes de Software',
            titulo: 'Descrever como selecionar bons testes de regressão e automatizá-los.',
            tarefas: [
              'Demonstrar o uso e a importância de testes de regressão usando o projeto, inclusive automatizando estes testes. (O LO102 inclui parte deste objetivo, também está relacionado ao LO100)'
            ]
          },
          {
            id: 'LO105',
            area: 'Testes de Software',
            titulo: 'Descrever um processo de gerenciamento de defeitos: como reportar o erro, monitoramento das ações de remoção de erros, submissão de correções.',
            tarefas: [
              'Identificar no bug tracker do projeto como ocorre o gerenciamento de defeitos do projeto.',
              'Apresentar um exemplo (monitorar um exemplo de ações de remoção de erros).',
              'Participar do processo reportando erros e auxiliando desenvolvedores na sua correção.',
              'Participar do processo propondo soluções para os erros já reportados.',
              'Submeter correções.'
            ]
          },
          {
            id: 'LO106',
            area: 'Testes de Software',
            titulo: 'Descrever como ferramentas de testes estáticos e dinâmicos disponíveis podem ser integrados no ambiente de desenvolvimento do software.',
            tarefas: [
              'Identificar quais e como as ferramentas de testes (dinâmicas ou estáticas – análise estática) são usadas no projeto.',
              'Usar uma cópia local do projeto e demonstrar como as ferramentas de testes estáticas e dinâmicas podem ser utilizadas.'
            ]
          },
          {
            id: 'LO110',
            area: 'Testes de Software',
            titulo: 'Ter noção sobre ferramentas de integração contínua e testes de regressão.',
            tarefas: [
              'Verificar se ferramentas de integração contínua e testes de regressão são empregados no projeto ou como poderiam ser utilizadas.',
              'Fazer uma cópia local do projeto e demonstrar o uso das ferramentas de integração contínua e testes de regressão.',
              'Criar ou atualizar scripts para realização de integração contínua e testes de regressão para novos componentes desenvolvidos.'
            ]
          },
          {
            id: 'LO287',
            area: 'Manutenção de Software',
            titulo: 'Descrever o processo de testes de regressão e seu papel no gerenciamento de releases.',
            tarefas: [
              'Aplicar testes de regressão em um projeto que já possua os testes implementados e automatizados.',
              'Discutir o histórico dos resultados da execução dos testes.'
            ]
          },
          {
            id: 'LO321',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Comparar o uso das técnicas de especificação e análise formais com técnicas de validação e verificação por meio de testes.',
            tarefas: [
              'Desenvolver a especificação formal para um módulo complexo do OSS e apresentá-la aos alunos.',
              'Descrever o objetivo e a importância dessa especificação.',
              'Elaborar testes para o módulo, caso não existam.',
              'Comparar as duas soluções.'
            ]
          },
          {
            id: 'LO186',
            area: 'Qualidade de Software',
            titulo: 'Descrever técnicas para verificação e validação dos demais artefatos gerados pelo projeto além do código.',
            tarefas: [
              'Usar os artefatos do projeto para elaborar exemplos de técnicas para verificação e validação que podem ser aplicadas.',
              'Solicitar que os alunos sugiram como verificariam e validariam determinado artefato do projeto.'
            ]
          },
          {
            id: 'LO187',
            area: 'Qualidade de Software',
            titulo: 'Listar as abordagens que minimizam falhas, que podem ser aplicadas em cada estágio do ciclo de vida do software.',
            tarefas: [
              'Identificar quais abordagens são empregadas para minimizar as falhas no decorrer do projeto.',
              'Comparar com outros processos de desenvolvimento.',
              'Identificar quais outras abordagens poderiam ser aplicadas.',
              'Discutir como essas abordagens poderiam ser inseridas no projeto.'
            ]
          },
          {
            id: 'LO189',
            area: 'Qualidade de Software',
            titulo: 'Descrever abordagens para a estimativas de falhas.',
            tarefas: [
              'Apresentar exemplos para as abordagens de estimativas de falhas usando o código do projeto.',
              'Solicitar que os alunos sugiram a abordagem a ser empregada para determinado código do projeto.'
            ]
          },
          {
            id: 'LO197',
            area: 'Qualidade de Software',
            titulo: 'Descrever o papel que ferramentas podem executar na validação de software.',
            tarefas: [
              'Mostrar como ferramentas podem auxiliar na validação de software, usando o projeto como exemplo.'
            ]
          }
        ];
      } else if (nivel === t('config.learning.level.usage')) {
        return [
          {
            id: 'LO66',
            area: 'Construção de Software',
            titulo: 'Aplicar várias estratégias de testes e depuração (debug) de programas simples.',
            tarefas: [
              'Construir testes para o projeto.',
              'Aplicar as diversas estratégias de testes.',
              'Localizar os erros encontrados.'
            ]
          },
          {
            id: 'LO82',
            area: 'Construção de Software',
            titulo: 'Construir, executar e depurar (debug) programas usando uma IDE moderna, que possua ferramentas de teste de unidade e depuração (debug) visual.',
            tarefas: [
              'Usar na manipulação do projeto uma IDE com ferramentas de testes e depuração (debug) integradas.'
            ]
          },
          {
            id: 'LO95',
            area: 'Testes de Software',
            titulo: 'Descrever e distinguir entre tipos e níveis diferentes de testes (unidade, integração, sistema e aceitação).',
            tarefas: [
              'Analisar exemplos de testes existentes no projeto.',
              'Elaborar testes de unidade, integração, sistema e aceitação. (relacionado ao LO101 e LO104)'
            ]
          },
          {
            id: 'LO96',
            area: 'Testes de Software',
            titulo: 'Descrever e distinguir entre tipos diferentes de testes, incluindo interface humano computador, usabilidade, confiabilidade, segurança, conformidade com a especificação.',
            tarefas: [
              'Analisar exemplos de testes existentes no projeto.',
              'Elaborar testes de interface, usabilidade, confiabilidade, segurança, aderência às especificações (relacionado ao LO101, LO104)'
            ]
          },
          {
            id: 'LO97',
            area: 'Testes de Software',
            titulo: 'Conduzir a verificação e avaliação (estática e dinâmica) da segurança de uma aplicação de software.',
            tarefas: [
              'Realizar a verificação e avaliação (estática e dinâmica) da segurança do software.',
              'Usar ferramentas que possam auxiliar nessas verificações.',
              'Implementar correções para os erros apresentados.'
            ]
          },
          {
            id: 'LO98',
            area: 'Testes de Software',
            titulo: 'Descrever e distinguir entre as diferentes técnicas de testes caixa-preta e caixa-branca.',
            tarefas: [
              'Elaborar casos de testes caixa-preta e caixa-branca. (relacionado ao LO99)'
            ]
          },
          {
            id: 'LO99',
            area: 'Testes de Software',
            titulo: 'Criar testes de unidade que não sejam redundantes.',
            tarefas: [
              '(Objetivo das técnicas de testes caixa-preta e caixa-branca é reduzir a redundância, está relacionado ao LO98).'
            ]
          },
          {
            id: 'LO100',
            area: 'Testes de Software',
            titulo: 'Realizar o processo de testes e correção de erros sem que haja a reintrodução de erros antigos.',
            tarefas: [
              'Construir e executar testes.',
              'Localizar e corrigir erros.',
              'Executar testes de regressão.'
            ]
          },
          {
            id: 'LO101',
            area: 'Testes de Software',
            titulo: 'Criar e documentar um conjunto de testes para um segmento de código de médio porte.',
            tarefas: [
              'Elaborar e documentar um conjunto de testes para o projeto (encontrar um pequeno número de erros (5-10) não submetidos anteriormente). (Relacionado ao LO66, LO95, LO96, LO104, LO91, LO99)'
            ]
          },
          {
            id: 'LO104',
            area: 'Testes de Software',
            titulo: 'Planejar e gerar casos de testes para softwares de médio porte.',
            tarefas: [
              'Muito próximos de LO101, LO66, LO95, LO96, LO99, LO91'
            ]
          },
          {
            id: 'LO87',
            area: 'Testes de Software',
            titulo: 'Avaliar o programa sendo testado por meio de métricas.',
            tarefas: [
              'Avaliar as funcionalidades testadas do OSS usando métricas.',
              'Usar ferramentas para coleta de métricas.',
              'Analisar os resultados em grupo.'
            ]
          },
          {
            id: 'LO88',
            area: 'Testes de Software',
            titulo: 'Avaliar os testes sendo executados por meio de métricas.',
            tarefas: [
              'Avaliar os testes executados no projeto usando métricas de cobertura',
              'Usar ferramentas para análise de cobertura.'
            ]
          },
          {
            id: 'LO107',
            area: 'Testes de Software',
            titulo: 'Demonstrar a capacidade de usar ferramentas de testes incluindo ferramentas de análise estáticas e dinâmicas, em suporte ao desenvolvimento de um software de médio porte.',
            tarefas: [
              'Elaborar e executar testes usando as ferramentas apropriadas. (Em conjunto com LO95, LO96, LO104, LO101, LO106, LO66)'
            ]
          },
          {
            id: 'LO108',
            area: 'Testes de Software',
            titulo: 'Demonstrar a capacidade de usar ferramentas de depuração (debug), em suporte ao desenvolvimento de um software de médio porte.',
            tarefas: [
              'Detectar os erros no código usando ferramentas apropriadas Relacionado com LO66 (debug), LO105 (submissão de correções) LO82 (ferramentas de debug integradas à IDE)'
            ]
          },
          {
            id: 'LO109',
            area: 'Testes de Software',
            titulo: 'Demonstrar a capacidade de usar ferramentas de teste de cobertura eficientemente.',
            tarefas: [
              'Usar ferramentas de cobertura para avaliar os testes existentes no projeto.',
              'Usar ferramentas de cobertura para avaliar os testes elaborados pelo próprio aluno. (associado ao LO88)',
              'Discutir resultados.'
            ]
          },
          {
            id: 'LO325',
            area: 'Modelos e Métodos de Engenharia de Software',
            titulo: 'Usando uma linguagem de especificação formal, formular a especificação de software simples e derivar exemplos de casos de testes dessa especificação.',
            tarefas: [
              'Os alunos deverão desenvolver a especificação formal de um OSS simples',
              'Elaborar casos de testes derivados dessa especificação.'
            ]
          },
          {
            id: 'LO178',
            area: 'Qualidade de Software',
            titulo: 'Combinar técnicas apropriadas de testes para o desenvolvimento de um software confiável e seguro.',
            tarefas: [
              'Analisar se os testes existentes no projeto garantem a confiabilidade e segurança do mesmo.',
              'Criar novos casos de testes que cubram as falhas porventura existentes.'
            ]
          },
          {
            id: 'LO190',
            area: 'Qualidade de Software',
            titulo: 'Estimar o número de falhas de um software de pequeno porte baseados na densidade e disseminação de falhas.',
            tarefas: [
              'Estimar o número de falhas para o projeto, baseando-se em técnicas de densidade e disseminação de falhas.'
            ]
          },
          {
            id: 'LO191',
            area: 'Qualidade de Software',
            titulo: 'Conduzir o registro e o acompanhamento de falhas, provendo suporte para cada uma das atividades.',
            tarefas: [
              'Verificar como as falhas são reportadas no projeto.',
              'Identificar uma falha já corrigida e reportar todo o processo envolvido na sua correção.',
              'Reportar uma falha e acompanhar a sua correção fornecendo todas as informações necessárias.'
            ]
          },
          {
            id: 'LO198',
            area: 'Qualidade de Software',
            titulo: 'Usar uma ferramenta de acompanhamento de defeitos para gerenciar os defeitos em um software de pequeno porte.',
            tarefas: [
              'Identificar a ferramenta utilizada pela comunidade do projeto para reportar os erros e acompanhar a correção dos mesmos.',
              'Reportar ao menos um erro usando a ferramenta.',
              'Corrigir ao menos um erro e reportar a solução na ferramenta.'
            ]
          }
        ];
      } else if (nivel === t('config.learning.level.evaluation')) {
        return [
          {
            id: 'LO34',
            area: 'Testes de Software',
            titulo: 'Criar e conduzir testes de usabilidade simples para um software existente.',
            tarefas: [
              'Elaborar e realizar testes de usabilidade',
              'Criar testes de usabilidade para diferentes projetos OS de diferentes domínios (ex: Web, Mobile e Desktop).'
            ]
          }
        ];
      }
    }
    
    // Fallback para objetivos genéricos
    return [
      {
        id: 'generic',
        area: 'Genérico',
        titulo: t('config.learning.objective.documentation'),
        tarefas: []
      },
      {
        id: 'generic2',
        area: 'Genérico',
        titulo: t('config.learning.objective.requirements'),
        tarefas: []
      },
      {
        id: 'generic3',
        area: 'Genérico',
        titulo: t('config.learning.objective.analysis'),
        tarefas: []
      }
    ];
  };

  // Função para obter objetivos de aprendizagem baseados no tema e nível
  const getObjetivosAprendizagem = () => {
    if (!formData.tema || !formData.nivelAprendizagem) {
      return [];
    }
    
    const objetivosData = getObjetivosAprendizagemData();
    return objetivosData.map(obj => obj.titulo);
  };

  // Função para obter tarefas baseadas no objetivo selecionado
  const getTarefasSala = () => {
    if (!formData.objetivoAprendizagem) {
      return [];
    }
    
    const objetivosData = getObjetivosAprendizagemData();
    const objetivoSelecionado = objetivosData.find(obj => obj.titulo === formData.objetivoAprendizagem);
    
    if (objetivoSelecionado) {
      return objetivoSelecionado.tarefas;
    }
    
    // Fallback para tarefas genéricas
    return [
      t('config.classroom.tasks.check'),
      t('config.classroom.tasks.undocumented'),
      t('config.classroom.tasks.documented'),
      t('config.classroom.tasks.compare')
    ];
  };

  // Função para obter estratégias com sugestões baseadas na Taxonomia de Bloom
  const getEstrategiasComSugestoes = () => {
    const bloomLevel = getBloomLevel(formData.nivelAprendizagem);
    const bloomSuggestions = getBloomSuggestions(bloomLevel);
    
    const baseEstrategias = [
      t('config.evaluation.exams'),
      t('config.evaluation.reports'), 
      t('config.evaluation.artifacts'),
      t('config.evaluation.acceptance'),
      t('config.evaluation.interviews'),
      t('config.evaluation.seminars'),
      t('config.evaluation.portfolio'),
      t('config.evaluation.diary'),
      t('config.evaluation.exercises'),
      t('config.evaluation.research'),
      "Apresentações",
      t('config.evaluation.essay'),
      t('config.evaluation.participation')
    ];

    return baseEstrategias.map(estrategia => ({
      value: estrategia,
      display: bloomSuggestions.includes(estrategia) 
        ? `${estrategia} (sugestão)`
        : estrategia,
      isSuggestion: bloomSuggestions.includes(estrategia)
    }));
  };

  const niveisControle = [
    t('config.control.none'),
    t('config.control.internal.external'),
    t('config.control.internal'),
    t('config.control.total')
  ];

  const escolhasProjeto = [
    t('config.project.predefined'),
    t('config.project.list'),
    t('config.project.free')
  ];

  // Função para obter critérios com sugestões baseadas no nível de controle e escolha do projeto
  const getCriteriosComSugestoes = () => {
    const controlSuggestions = getControlSuggestions(formData.nivelControle);
    const projectChoiceSuggestions = getProjectChoiceSuggestions(formData.escolhaProjeto);
    const allSuggestions = [...controlSuggestions, ...projectChoiceSuggestions];
    
    const baseCriterios = [
      t('config.criteria.language'),
      t('config.criteria.collaborators'),
      t('config.criteria.acceptance'),
      t('config.criteria.tracker'),
      t('config.criteria.community'),
      t('config.criteria.size'),
      t('config.criteria.maturity'),
      t('config.criteria.domain'),
      t('config.criteria.active'),
      t('config.criteria.contributors')
    ];

    return baseCriterios.map(criterio => ({
      value: criterio,
      display: allSuggestions.includes(criterio) 
        ? `${criterio} (sugestão)`
        : criterio,
      isSuggestion: allSuggestions.includes(criterio)
    }));
  };

  const ferramentasTecnologicas = [
    t('config.tools.github.explore'),
    t('config.tools.github'),
    t('config.tools.moodle'),
    t('config.tools.canvas'),
    t('config.tools.google.form'),
    t('config.tools.github.desktop'),
    t('config.tools.quizzy'),
    t('config.tools.open.interview')
  ];

  const handleCheckboxChange = (field: 'criteriosSelecao' | 'ferramentasTecnologicas' | 'tarefasSala', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNext = () => {
    // Salvar dados da configuração no localStorage
    console.log("Dados do formulário:", formData);
    localStorage.setItem('projectConfigData', JSON.stringify(formData));
    navigate("/sucesso");
  };

  const isFormValid = () => {
    return formData.tema && 
           formData.nivelAprendizagem && 
           formData.objetivoAprendizagem && 
           formData.tarefasSala.length > 0 &&
           formData.estrategiaAvaliacao &&
           formData.nivelControle &&
           formData.escolhaProjeto &&
           formData.criteriosSelecao.length > 0 &&
           formData.ferramentasTecnologicas.length > 0;
  };

  const getTooltipData = () => {
    console.log('getTooltipData called, current theme:', t('config.theme'));
    if (t('config.theme') === 'Theme') { // English
      return {
        nivelAprendizagem: {
          "Familiarity": "Familiarity refers to the recognition and remembrance of facts, terms and basic concepts. By aligning the 'Familiarity' option with level 1 of Bloom's Taxonomy (Knowledge), we emphasize the student's ability to recall previously learned information, such as facts, definitions and simple procedures. This level guides activities that require remembering and reproducing content without necessarily understanding it deeply, serving as a foundation for more complex levels of thinking.",
          "Usage": "The 'Usage' option is directly linked to level 3 of Bloom's Taxonomy, which corresponds to application. At this stage, the student not only understands the concepts, but uses them in new situations or in different contexts. By opting for 'Usage', you are emphasizing the ability to apply previously learned knowledge, techniques or rules to solve problems, interpret information, or perform practical tasks.",
          "Evaluation": "The 'Evaluation' option corresponds to level 5 of Bloom's Taxonomy, which is the evaluation level. At this stage, students demonstrate the ability to judge, justify and make decisions based on criteria, evidence and standards. They develop arguments, make grounded criticisms, make judgments and defend positions with logical validation and evidence."
        },
        objetivosAprendizagem: "Learning objectives are clear and specific goals that describe what a student should know, understand or be able to do at the end of an activity, module or course. They guide planning, selection of teaching strategies and evaluation, helping to make the learning process more focused and measurable.",
        estrategiaAvaliacao: {
          "Exams": "Exam is a systematic instrument for collecting learning evidence (knowledge, skills and attitudes) and assigning a grade or performance judgment based on pre-established criteria. It serves to verify the level of achievement of objectives, guide feedback, decision making (approval/disapproval) and guide pedagogical adjustments.",
          "Reports": "Report is a structured document that describes the work performed, the methods employed, the results obtained and the interpretations or inferences from these results. It allows identifying what was learned, how it was demonstrated and what evidence supports the conclusions.",
          "Software Artifacts": "Software artifacts is the structured set of deliverables produced throughout development (such as requirements, design, code, test cases, documentation, builds) that is used to evaluate the maturity, quality and adherence to project planning.",
          "Acceptance Test": "Acceptance tests are an evaluation strategy that validates whether the software meets the acceptance criteria previously defined by stakeholders, focusing on confirming that the product is ready for release or delivery.",
          "Interviews": "Interviews are an evaluation strategy that collects perceptions, experiences and expectations from relevant people (stakeholders, users, experts) through guided questions, with the goal of understanding needs, justifying decisions and validating hypotheses.",
          "Seminars": "Seminars are an evaluation strategy that involves oral presentation of a topic by a group of students, followed by discussion and debate. They are used to evaluate students' ability to research, organize information, present ideas clearly and answer questions about the subject.",
          "Portfolio": "Portfolio is an organized collection of a student's work that demonstrates their progress and development over a period. It serves as a record of the learning journey, allowing both student and teacher to reflect on the process and improve learning.",
          "Diary": "Diary is an instrument that allows students to record their experiences, reflections and learning over a period. It is a tool that favors self-evaluation and reflection on the learning process, both for the student and for the instructor.",
          "Exercises": "Exercises are structured activities that aim to measure student learning, providing feedback on their progress and identifying areas that need more attention. They can be used at different times and for various purposes, such as diagnosis, training and summative evaluation.",
          "Research": "Research acts as a strategy to collect and analyze data, with the goal of understanding the effectiveness of a program, intervention or policy, identifying areas for improvement and informing future decisions. It is a systematic process that involves collecting relevant and reliable information.",
          "Reflective Essay": "Reflective essay is a type of writing in which the student critically analyzes their own learning experiences, identifying what they learned and how that learning impacted their personal and professional development.",
          "Participation": "Participation involves the active inclusion of evaluated subjects in the evaluation process, whether in defining criteria, data collection, analysis or decision making. This approach transforms evaluation from a unilateral action by the evaluator to a collective construction."
        },
        nivelControle: {
          "No Control": "No control is the level where faculty/staff only monitor student activities within the project. Students work with community requests and the community approves student contributions.",
          "Internal Initiative/External Approval": "Internal initiative/External approval is the control level where a new feature is proposed and built within the educational institution, but is later submitted for community approval.",
          "Internal Control": "Internal control is the control level where faculty/staff fork the OSS code, prepare assignments and evaluate student contributions.",
          "Total Control": "Total control is the control level where the project's core development has been sustained by faculty/staff."
        },
        escolhaProjeto: {
          "Predefined": "Predefined is the type of project choice where faculty/staff decide the project students will work on.",
          "Choice List": "Choice list is the type of project choice where students can choose any project from the list provided by faculty/staff.",
          "Free Choice": "Free choice is the type of project choice where students must search and decide which OSS (of their interest) they will work with."
        },
        criteriosSelecao: {
          "Programming Language": "Programming language is an OSS project selection criterion that considers the predominant programming language in the project, measured by the number of bytes of source code files",
          "Number of Collaborators": "Number of collaborators is an OSS project selection criterion that considers the number of users who contributed to the project by performing at least one commit",
          "Collaborator Acceptance": "Collaborator acceptance is an OSS project selection criterion that considers whether project members accept contributions from non-members, where open issues containing labels like help needed and good first issue are sought.",
          "Issue Tracker": "Issue tracker is an OSS project selection criterion that considers whether the project has an issue tracker with at least one open issue",
          "Active Community": "Active community is an OSS project selection criterion that considers whether the community is active, as evidenced by the history of comments on issues, where comments answered in the last 30 days are sought",
          "Project Size": "Project size is an OSS project selection criterion that considers the number of lines of code in a project's source code",
          "Maturity": "Maturity is an OSS project selection criterion that considers maturity measured as the number of releases; the rationale is that a consistent release history can be an indicator that tasks are complex and require deeper student knowledge",
          "Domain": "Domain is an OSS project selection criterion that considers the problem domain, according to a project's description",
          "Active Project": "Active Project is an OSS project selection criterion that considers whether the project is active, as indicated by the number of commits in the last 30 days. It should be noted that commit content is not evaluated.",
          "Main Contributors": "Main contributors is an OSS project selection criterion that considers a list with the 10 developers who contributed the most commits to the project since its creation."
        },
        ferramentasTecnologicas: {
          "GitHub": "Github is a source code hosting platform that allows developers to share, collaborate and manage their projects easily (https://github.com/)",
          "Moodle": "Moodle is an open source online learning platform that allows institutions and teachers to create personalized teaching environments (https://moodle.org/)",
          "Github Desktop": "Github Desktop is an open source tool developed by the GitHub team to facilitate the use of Git in graphical interfaces (https://desktop.github.com/)",
          "LimeSurvey": "LimeSurvey is an open source tool that offers a variety of features to create, distribute and analyze questionnaires in a completely free and customizable way (https://www.limesurvey.org/)",
          "Quizzy": "Quizzy is an open source platform that serves to create and administer interactive questionnaires. It can be used to generate quizzes, tests or assessments easily and in a personalized way (https://github.com/cornelltech/quizzy)",
          "Open Interview": "OpenInterview is an open source tool to facilitate interview processes, allowing interviews to be conducted more efficiently and accessibly (https://github.com/OpenInterview/OpenInterview)"
        }
      };
    } else { // Portuguese
      return {
        nivelAprendizagem: {
          "Familiaridade": "Familiaridade refere-se ao reconhecimento e lembrança de fatos, termos e conceitos básicos. Ao alinhar a opção 'Familiaridade' com o nível 1 da Taxonomia de Bloom (Conhecimento), enfatizamos a capacidade do estudante de recordar informações previamente aprendidas, como fatos, definições e procedimentos simples. Esse nível orienta atividades que exigem recordar e reproduzir conteúdo sem necessariamente compreendê-lo profundamente, servindo como base para níveis mais complexos de pensamento.",
          "Uso": "A opção \"Uso\" está diretamente ligada ao nível 3 da Taxonomia de Bloom, que corresponde à aplicação. Nesse estágio, o aluno não apenas entende os conceitos, mas os utiliza em situações novas ou em contextos diferentes. Ao optar por \"Uso\", você está enfatizando a habilidade de aplicar conhecimentos, técnicas ou regras aprendidas previamente para resolver problemas, interpretar informações, ou executar tarefas práticas.",
          "Avaliação": "A opção \"Avaliação\" corresponde ao nível 5 da Taxonomia de Bloom, que é o nível de avaliação. Nesse estágio, os alunos demonstram a capacidade de julgar, justificar e tomar decisões com base em critérios, evidências e normas. Eles elaboram argumentos, fazem críticas fundamentadas, apuram julgamentos e defendem posições com validação lógica e evidências."
        },
        objetivosAprendizagem: "Objetivos de aprendizagem são metas claras e específicas que descrevem o que um estudante deve saber, entender ou ser capaz de fazer ao final de uma atividade, module ou curso. Eles guiam o planejamento, a seleção de estratégias de ensino e a avaliação, ajudando a tornar o processo de aprendizado mais focado e mensurável.",
        estrategiaAvaliacao: {
          "Provas": "Prova é um instrumento sistemático para coletar evidências de aprendizagem (conhecimento, habilidades e atitudes) e atribuir uma nota ou julgamento de desempenho com base em critérios pré-estabelecidos. Serve para verificar o nível de alcance dos objetivos, orientar feedback, tomada de decisão (aprovação/reprovação) e orientar ajustes pedagógicos.",
          "Relatórios": "Relatório é um documento estruturado que descreve o trabalho realizado, os métodos empregados, os resultados obtidos e as interpretações ou inferências a partir desses resultados. Ele permite identificar o que foi aprendido, como foi demonstrado e quais evidências sustentam as conclusões.",
          "Artefatos de software": "Artefatos de software é o conjunto estruturado de entregáveis produzidos ao longo do desenvolvimento (como requisitos, design, código, casos de teste, documentação, builds) que é usado para avaliar a maturidade, qualidade e aderência ao planejamento do projeto.",
          "Teste de aprovação": "Testes de aprovação são uma estratégia de avaliação que valida se o software atende aos critérios de aceitação previamente definidos pelos stakeholders, com foco em confirmar que o produto está pronto para liberação ou entrega.",
          "Entrevistas": "Entrevistas são uma estratégia de avaliação que coleta percepções, experiências e expectativas de pessoas relevantes (stakeholders, usuários, especialistas) por meio de perguntas guiadas, com o objetivo de entender necessidades, justificar decisões e validar hipóteses.",
          "Seminários": "Seminários são uma estratégia de avaliação que envolve a apresentação oral de um tema por um grupo de estudantes, seguida de discussão e debate. Eles são utilizados para avaliar a capacidade dos alunos de pesquisar, organizar informações, apresentar ideias de forma clara e responder a perguntas sobre o assunto.",
          "Portfólio": "Portfólio é uma coleção organizada de trabalhos de um aluno que demonstra seu progresso e desenvolvimento ao longo de um período. Ele serve como um registro do percurso de aprendizagem, permitindo que o aluno e o professor reflitam sobre o processo e aprimorem o aprendizado.",
          "Diário": "Diário é um instrumento que permite aos estudantes registrarem suas experiências, reflexões e aprendizados ao longo de um período. É uma ferramenta que favorece a autoavaliação e a reflexão sobre o processo de aprendizagem, tanto para o estudante quanto para o instrutor.",
          "Exercícios": "Exercícios são atividades estruturadas que visam medir o aprendizado do aluno, fornecendo feedback sobre o seu progresso e identificando áreas que necessitam de mais atenção. Eles podem ser utilizados em diferentes momentos e com diversos propósitos, como diagnóstico, formação e avaliação somativa.",
          "Pesquisas": "Pesquisa atua como uma estratégia para coletar e analisar dados, com o objetivo de entender a eficácia de um programa, intervenção ou política, identificar áreas de melhoria e informar decisões futuras. É um processo sistemático que envolve a coleta de informações relevantes e confiáveis.",
          "Ensaio reflexivo": "Ensaio reflexivo é um tipo de escrita em que o aluno analisa criticamente suas próprias experiências de aprendizagem, identificando o que aprendeu e como esse aprendizado impactou seu desenvolvimento pessoal e profissional.",
          "Participação": "Participação envolve a inclusão ativa dos sujeitos avaliados no processo avaliativo, seja na definição de critérios, coleta de dados, análise ou tomada de decisões. Essa abordagem transforma a avaliação de uma ação unilateral do avaliador para uma construção coletiva."
        },
        nivelControle: {
          "Sem controle": "Sem controle é o nível em que o corpo docente/equipe apenas monitora as atividades dos alunos dentro do projeto. Os estudantes trabalham com as solicitações da comunidade e a comunidade aprova a contribuição dos estudantes.",
          "Iniciativa interna/Aprovação externa": "Iniciativa interna/Aprovação externa é o nível de controle em que um novo recurso é proposto e construído dentro da instituição de ensino, mas posteriormente é submetido à aprovação da comunidade.",
          "Controle interno": "Controle interno é o nível de controle em que o corpo docente/equipe ramificam o código OSS, preparam atribuições e avaliam a contribuição dos estudantes.",
          "Total controle": "Controle total é o nível de controle em que o desenvolvimento do núcleo do projeto foi sustentado pelo corpo docente/equipe."
        },
        escolhaProjeto: {
          "Predefinido": "Predefinido é o tipo de escolha do projeto em que o corpo docente/equipe decide o projeto em que os estudantes trabalham.",
          "Lista de escolhas": "Lista de escolha é o tipo de escolha do projeto em que os estudantes podem escolher qualquer projeto da lista fornecida pelo corpo docente/equipe.",
          "Escolha livre": "Livre escolha é o tipo de escolha do projeto em que os estudantes devem procurar e decidir com qual OSS(de seu interesse) trabalharão."
        },
        criteriosSelecao: {
          "Linguagem de programação": "Linguagem de programação é um critério de seleção do projeto OSS que considera a linguagem de programação predominante no projeto, medida pelo número de bytes de arquivos de código-fonte",
          "Número de colaboradores": "Número de colaboradores é um critério de seleção do projeto OSS que considera o número de usuários que contribuíram para o projeto realizando pelo menos um commit",
          "Aceitação do colaborador": "Aceitação do colaborador é um critério de seleção do projeto OSS que considera se os membros do projeto aceitam contribuições de não membros, em que são procurados problemas abertos contendo rótulos como ajuda necessária e bom primeiro problema.",
          "Rastreador de problemas": "Rastreador de problemas é um critério de seleção do projeto OSS que considera se o projeto tem um rastreador de problemas com pelo menos um problema aberto",
          "Comunidade ativa": "Comunidade ativa é um critério de seleção do projeto OSS que considera se a comunidade é ativa, conforme evidenciado pelo histórico de comentários em problemas, em que são procurados os comentários respondidos nos últimos 30 dias",
          "Tamanho do projeto": "Tamanho do projeto é um critério de seleção do projeto OSS que considera o número de linhas de código no código-fonte de um projeto",
          "Maturidade": "Maturidade é um critério de seleção do projeto OSS que considera a maturidade medida como o número de lançamentos; a justificativa é que um histórico consistente de lançamentos pode ser um indicador de que as tarefas são complexas e exigem conhecimento mais profundo dos estudantes",
          "Domínio": "Domínio é um critério de seleção do projeto OSS que considera o domínio do problema, de acordo com a descrição de um projeto",
          "Projeto ativo": "Projeto Ativo é um critério de seleção do projeto OSS que considera se o projeto está ativo, conforme indicado pelo número de commits nos últimos 30 dias. Deve-se notar que o conteúdo do commit não é avaliado.",
          "Principais Contribuidores": "Principais contribuidores é um critério de seleção do projeto OSS que considera uma lista com os 10 desenvolvedores que contribuíram com mais commits no projeto desde sua criação."
        },
        ferramentasTecnologicas: {
          "GitHub": "Github é uma plataforma de hospedagem de código-fonte que permite que desenvolvedores compartilhem, colaborem e gerenciem seus projetos de forma fácil (https://github.com/)",
          "Moodle": "Moodle é uma plataforma de aprendizagem online de código aberto que permite que instituições e professores criem ambientes de ensino personalizados (https://moodle.org/)",
          "Github Desktop": "Github Desktop é uma ferramenta de código aberto desenvolvido pela equipe do GitHub para facilitar o uso do Git em interfaces gráficas (https://desktop.github.com/)",
          "LimeSurvey": "LimeSurvey é uma ferramenta de código aberto que oferece uma variedade de recursos para criar, distribuir e analisar questionários de forma totalmente livre e personalizável (https://www.limesurvey.org/)",
          "Quizzy": "Quizzy é uma plataforma de código aberto que serve para criar e administrar questionários interativos. Ela pode ser usada para gerar quizzes, testes ou avaliações de forma fácil e personalizada (https://github.com/cornelltech/quizzy)",
          "Open Interview": "OpenInterview é uma ferramenta de código aberto para facilitar processos de entrevistas, permitindo que sejam conduzidas entrevistas de forma mais eficiente e acessível (https://github.com/OpenInterview/OpenInterview)"
        }
      };
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600/95 to-blue-600/95 backdrop-blur-xl border-b border-purple-200/60">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/resultado-perfil")}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('config.back') || 'Previous step'}
            </Button>
            
            <div className="text-center">
              <h1 className="font-display text-lg font-semibold text-white">
                {t('config.title') || 'Model Configuration'}
              </h1>
              <p className="text-sm text-purple-100">{t('config.step') || 'Step 3 of 3'}</p>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Settings className="h-5 w-5 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            {t('config.process.title') || 'OSS Project Adoption Model Configuration Process in SEE'}
          </h2>
          <p className="text-lg text-gray-600">
            {t('config.select.info') || 'Select the information below:'}
          </p>
          {profileNumber && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <p className="text-sm text-blue-700">
                {t('config.suggestions.available')?.replace('{profile}', profileNumber.toString()) || `✨ Sugestões disponíveis baseadas no Perfil ${profileNumber} identificado`}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {t('config.suggestions.instruction') || 'Procure pelos ícones de estrela nos campos abaixo para ver as recomendações personalizadas'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          {/* Tema */}
          <Card id="tema" className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.theme') || 'Theme'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.tema} onValueChange={(value) => handleSelectChange('tema', value)}>
                <SelectTrigger className="w-full border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {temas.map((tema) => (
                    <SelectItem key={tema} value={tema}>{tema}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sugestão baseada no perfil */}
              {suggestions.tema && formData.tema === "" && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-600 font-medium truncate">
                        {t('config.suggestions.label')}: <span className="font-semibold">{suggestions.tema}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion('tema', suggestions.tema)}
                      className="h-6 px-2 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm transition-colors duration-200"
                    >
                      {t('config.suggestions.apply')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nível de Aprendizagem */}
          <Card id="nivelAprendizagem" className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.learning.level') || 'Learning Level'}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('config.learning.level') || 'Learning Level'}</DialogTitle>
                      <DialogDescription className="space-y-4 text-left">
                        {Object.entries(getTooltipData().nivelAprendizagem).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <h4 className="font-semibold text-foreground">{key}:</h4>
                            <p className="text-sm">{value as string}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.nivelAprendizagem} onValueChange={(value) => handleSelectChange('nivelAprendizagem', value)}>
                <SelectTrigger className="w-full border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {niveisAprendizagem.map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sugestão baseada no perfil */}
              {suggestions.nivelAprendizagem && formData.nivelAprendizagem === "" && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-600 font-medium truncate">
                        {t('config.suggestions.label')}: <span className="font-semibold">{suggestions.nivelAprendizagem}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion('nivelAprendizagem', suggestions.nivelAprendizagem)}
                      className="h-6 px-2 text-xs bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-sm transition-colors duration-200"
                    >
                      {t('config.suggestions.apply')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Objetivos de Aprendizagem */}
          <Card id="objetivoAprendizagem" className="bg-gradient-to-br from-white via-green-50/30 to-purple-50/30 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-green-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.learning.objective') || 'Learning Objective'}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{t('config.learning.objective') || 'Learning Objective'}</DialogTitle>
                      <DialogDescription className="text-left">
                        {getTooltipData().objetivosAprendizagem}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.objetivoAprendizagem} onValueChange={(value) => handleSelectChange('objetivoAprendizagem', value)}>
                <SelectTrigger className="w-full border-green-200 focus:ring-green-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {getObjetivosAprendizagem().map((objetivo) => (
                    <SelectItem key={objetivo} value={objetivo}>{objetivo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tarefas a serem desenvolvidas em sala de aula */}
          <Card id="tarefasSala" className="bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.classroom.tasks') || 'Classroom Tasks'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getTarefasSala().map((tarefa) => (
                  <div key={tarefa} className="flex items-center space-x-2">
                    <Checkbox
                      id={tarefa}
                      checked={formData.tarefasSala.includes(tarefa)}
                      onCheckedChange={() => handleCheckboxChange('tarefasSala', tarefa)}
                      className="border-orange-300 data-[state=checked]:bg-orange-500"
                    />
                    <Label htmlFor={tarefa} className="text-sm cursor-pointer">
                      {tarefa}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estratégia de Avaliação */}
          <Card id="estrategiaAvaliacao" className="bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.evaluation.strategy') || 'Evaluation Strategy'}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('config.evaluation.strategy') || 'Evaluation Strategy'}</DialogTitle>
                      <DialogDescription className="space-y-4 text-left">
                        {Object.entries(getTooltipData().estrategiaAvaliacao).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <h4 className="font-semibold text-foreground">{key}:</h4>
                            <p className="text-sm">{value as string}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.estrategiaAvaliacao} onValueChange={(value) => handleSelectChange('estrategiaAvaliacao', value)}>
                <SelectTrigger className="w-full border-pink-200 focus:ring-pink-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent className="bg-white z-50 max-h-60 overflow-y-auto">
                  {getEstrategiasComSugestoes().map((estrategia) => (
                    <SelectItem 
                      key={estrategia.value} 
                      value={estrategia.value}
                      className={estrategia.isSuggestion ? 'bg-blue-50 font-medium text-blue-700' : ''}
                    >
                      {estrategia.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Nível de Controle do Projeto OSS */}
          <Card id="nivelControle" className="bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/30 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.control.level') || 'Project Control Level'}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('config.control.level') || 'Control Level'}</DialogTitle>
                      <DialogDescription className="space-y-4 text-left">
                        {Object.entries(getTooltipData().nivelControle).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <h4 className="font-semibold text-foreground">{key}:</h4>
                            <p className="text-sm">{value as string}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.nivelControle} onValueChange={(value) => handleSelectChange('nivelControle', value)}>
                <SelectTrigger className="w-full border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {niveisControle.map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sugestão baseada no perfil */}
              {suggestions.nivelControle && formData.nivelControle === "" && (
                <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-indigo-600 font-medium truncate">
                        {t('config.suggestions.label')}: <span className="font-semibold">{suggestions.nivelControle}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion('nivelControle', suggestions.nivelControle)}
                      className="h-6 px-2 text-xs bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-sm transition-colors duration-200"
                    >
                      {t('config.suggestions.apply')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Definir a escolha de projeto OSS */}
          <Card id="escolhaProjeto" className="bg-gradient-to-br from-white via-teal-50/30 to-green-50/30 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                {t('config.project.choice') || 'Project Choice'}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('config.project.choice') || 'Project Choice'}</DialogTitle>
                      <DialogDescription className="space-y-4 text-left">
                        {Object.entries(getTooltipData().escolhaProjeto).map(([key, value]) => (
                          <div key={key} className="space-y-2">
                            <h4 className="font-semibold text-foreground">{key}:</h4>
                            <p className="text-sm">{value as string}</p>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select value={formData.escolhaProjeto} onValueChange={(value) => handleSelectChange('escolhaProjeto', value)}>
                <SelectTrigger className="w-full border-teal-200 focus:ring-teal-500">
                  <SelectValue placeholder={t('config.select') || 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {escolhasProjeto.map((escolha) => (
                    <SelectItem key={escolha} value={escolha}>{escolha}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sugestão baseada no perfil */}
              {suggestions.escolhaProjeto && formData.escolhaProjeto === "" && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-teal-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-teal-600 font-medium truncate">
                        {t('config.suggestions.label')}: <span className="font-semibold">{suggestions.escolhaProjeto}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion('escolhaProjeto', suggestions.escolhaProjeto)}
                      className="h-6 px-2 text-xs bg-teal-500 hover:bg-teal-600 text-white border-0 shadow-sm transition-colors duration-200"
                    >
                      {t('config.suggestions.apply')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Definir critérios de seleção do projeto OSS */}
          <Card id="criteriosSelecao" className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
               <CardTitle className="text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-white rounded-full"></span>
                  {t('config.selection.criteria') || 'Project Selection Criteria'}
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button
                       variant="ghost"
                       size="sm"
                       className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                     >
                       <HelpCircle className="h-4 w-4" />
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                     <DialogHeader>
                       <DialogTitle>{t('config.selection.criteria') || 'Selection Criteria'}</DialogTitle>
                       <DialogDescription className="space-y-4 text-left">
                          {Object.entries(getTooltipData().criteriosSelecao).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <h4 className="font-semibold text-foreground">{key}:</h4>
                              <p className="text-sm">{value as string}</p>
                            </div>
                          ))}
                       </DialogDescription>
                     </DialogHeader>
                   </DialogContent>
                 </Dialog>
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getCriteriosComSugestoes().map((criterio) => (
                   <div key={criterio.value} className="flex items-center space-x-2">
                     <Checkbox
                       id={criterio.value}
                       checked={formData.criteriosSelecao.includes(criterio.value)}
                       onCheckedChange={() => handleCheckboxChange('criteriosSelecao', criterio.value)}
                       className="border-emerald-300 data-[state=checked]:bg-emerald-500"
                     />
                     <Label 
                       htmlFor={criterio.value} 
                       className={`text-sm cursor-pointer ${criterio.isSuggestion ? 'text-blue-600 font-medium' : ''}`}
                     >
                       {criterio.display}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Definir as ferramentas tecnológicas */}
          <Card id="ferramentasTecnologicas" className="bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 border-2 border-violet-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
               <CardTitle className="text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-white rounded-full"></span>
                 {t('config.tech.tools') || 'Technological Tools'}
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button
                       variant="ghost"
                       size="sm"
                       className="ml-auto p-0 h-6 w-6 text-white/80 hover:text-white hover:bg-white/20"
                     >
                       <HelpCircle className="h-4 w-4" />
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                     <DialogHeader>
                       <DialogTitle>{t('config.tech.tools') || 'Technological Tools'}</DialogTitle>
                       <DialogDescription className="space-y-4 text-left">
                          {Object.entries(getTooltipData().ferramentasTecnologicas).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <h4 className="font-semibold text-foreground">{key}:</h4>
                              <p className="text-sm">{value as string}</p>
                            </div>
                          ))}
                       </DialogDescription>
                     </DialogHeader>
                   </DialogContent>
                 </Dialog>
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ferramentasTecnologicas.map((ferramenta) => (
                  <div key={ferramenta} className="flex items-center space-x-2">
                    <Checkbox
                      id={ferramenta}
                      checked={formData.ferramentasTecnologicas.includes(ferramenta)}
                      onCheckedChange={() => handleCheckboxChange('ferramentasTecnologicas', ferramenta)}
                      className="border-violet-300 data-[state=checked]:bg-violet-500"
                    />
                    <Label htmlFor={ferramenta} className="text-sm cursor-pointer">
                      {ferramenta}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-green-600/95 backdrop-blur-xl border-t border-purple-200/60 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile-result")}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('config.back') || 'Previous step'}
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!isFormValid()}
              size="lg"
              className={`
                px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform
                ${isFormValid() 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 ring-4 ring-green-300 ring-opacity-50' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {t('config.generate') || 'GENERATE'}
              <CheckCircle2 className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
};

export default ProjectConfiguration;