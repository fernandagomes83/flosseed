import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const SuccessPage = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const generatePDF = () => {
    try {
      // Carregar dados do localStorage
      const profileData = localStorage.getItem('classifiedProfile');
      const configData = localStorage.getItem('projectConfigData');
      const userData = localStorage.getItem('userData');
      const isAnonymous = localStorage.getItem('isAnonymous') === 'true';
      interface ConfigData {
        tema?: string;
        nivelAprendizagem?: string;
        objetivoAprendizagem?: string;
        tarefasSala?: string[];
        estrategiaAvaliacao?: string;
        nivelControle?: string;
        escolhaProjeto?: string;
        criteriosSelecao?: string[];
      }
      interface UserData {
        name?: string;
        institution?: string;
        course?: string;
      }
      let parsedConfigData: ConfigData = {};
      let parsedUserData: UserData = {};
      let profileNumber: number | null = null;
      try {
        if (configData) parsedConfigData = JSON.parse(configData);
        if (userData && !isAnonymous) parsedUserData = JSON.parse(userData);
        if (profileData) profileNumber = parseInt(profileData, 10);
      } catch (parseError) {
        console.warn('Erro ao fazer parse dos dados armazenados:', parseError);
      }
      const doc = new jsPDF();

      // Paleta de cores moderna
      const colors = {
        primary: [99, 102, 241] as [number, number, number],
        secondary: [59, 130, 246] as [number, number, number],
        accent: [16, 185, 129] as [number, number, number],
        highlight: [237, 100, 166] as [number, number, number], // Rosa para destacar
        dark: [17, 24, 39] as [number, number, number],
        light: [249, 250, 251] as [number, number, number],
        white: [255, 255, 255] as [number, number, number]
      };

      // Mapeamento de ferramentas para links externos
      const toolLinks: { [key: string]: string } = {
        'GitHub Trending': 'https://github.com/trending',
        'GitHub': 'https://github.com',
        'Moodle': 'https://moodle.org',
        'Github Desktop': 'https://desktop.github.com',
        'LimeSurvey': 'https://www.limesurvey.org'
      };

      // Função para processar texto mantendo formatação limpa
      const processTextForPDF = (text: string) => {
        // Manter o texto original mas melhorar a apresentação visual
        return text;
      };

      // Configurar cabeçalho moderno com efeito gradiente
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, 220, 50, 'F');

      // Título com tipografia moderna
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...colors.white);
      doc.text("GUIA DE APOIO PARA ADOÇÃO", 105, 18, {
        align: "center"
      });
      doc.text("DE PROJETOS OSS EM ESE", 105, 28, {
        align: "center"
      });

      // Subtítulo
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 200, 200);
      doc.text("Documento gerado automaticamente", 105, 35, {
        align: "center"
      });

      // Adicionar informações do usuário e perfil
      doc.setFontSize(10);
      const generationDate = new Date().toLocaleDateString('pt-BR');
      doc.text(`Data de geração: ${generationDate}`, 105, 42, {
        align: "center"
      });

      // Redefinir cor do texto para o corpo
      doc.setTextColor(...colors.dark);
      let yPos = 55;

      // Seção de Informações do Usuário - apenas se não for anônimo e tiver dados
      if (parsedUserData.name && !isAnonymous) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.primary);
        doc.text("INFORMAÇÕES DO USUÁRIO", 20, yPos + 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...colors.dark);
        yPos += 20;
        if (parsedUserData.name) {
          doc.text(`Nome: ${parsedUserData.name}`, 20, yPos);
          yPos += 5;
        }
        if (parsedUserData.institution) {
          doc.text(`Instituição: ${parsedUserData.institution}`, 20, yPos);
          yPos += 5;
        }
        if (parsedUserData.course) {
          doc.text(`Curso: ${parsedUserData.course}`, 20, yPos);
          yPos += 5;
        }
        yPos += 10;
      }

      // Seção 1: Planejamento
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.primary);
      doc.text("FASE DE PLANEJAMENTO", 20, yPos);

      // Dados de planejamento dinâmicos baseados na configuração
      let planningData: string[][] = [];

      // Adicionar tarefa de seleção de projeto dinâmica baseada na estratégia
      if (parsedConfigData.escolhaProjeto === "Predefinido" || parsedConfigData.escolhaProjeto?.includes("Predefinido")) {
        planningData.push(["Selecionar projeto OSS (caso estratégia de escolha tenha sido Predefinido)", "Planejamento", "Instrutor", "GitHub Trending"]);
      }

      // Sempre adicionar a linha de critérios de seleção (base do PDF original)
      const criterios = parsedConfigData.criteriosSelecao && parsedConfigData.criteriosSelecao.length > 0 
        ? parsedConfigData.criteriosSelecao.join(', ') 
        : 'critérios de seleção selecionados';
      planningData.push([`Definir os critérios de seleção de projetos OSS (caso estratégia de escolha tenha sido Livre escolha) [${criterios}]`, "Planejamento", "Instrutor", "GitHub Trending"]);

      // Atividades base de planejamento
      planningData.push(...[
        ["Avaliar os tutoriais das ferramentas selecionadas", "Planejamento", "Instrutor", "GitHub Trending\nGitHub\nMoodle\nGithub Desktop\nLimeSurvey\nQuizzy"],
        ["Avaliar questionário fornecido para identificar a experiência prévia dos alunos com o Github", "Planejamento", "Instrutor", "Experiência Prévia - Estudantes"],
        ["Avaliar instrumento de reconhecimento do projeto OSS fornecido pela abordagem", "Planejamento", "Instrutor", "Reconhecimento do Projeto OSS"],
        ["Organizar treinamento sobre o Github", "Planejamento", "Instrutor", "GitHub"]
      ]);
      autoTable(doc, {
        head: [["ATIVIDADE", "ETAPA", "RESPONSÁVEL", "FERRAMENTA"]],
        body: planningData,
        startY: yPos + 10,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
          textColor: colors.dark,
          valign: 'top',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        columnStyles: {
          0: {
            cellWidth: 75,
            fontStyle: 'normal'
          },
          1: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          2: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          3: {
            cellWidth: 45,
            fontSize: 8
          }
        },
        margin: {
          left: 15,
          right: 15
        },
        didParseCell: function (data: any) {
          if (data.column.index === 0) {
            const cellText = data.cell.text.join(' ');
            if (cellText.includes('[') && cellText.includes(']')) {
              // Aplicar destaque sutil para células com conteúdo dinâmico
              data.cell.styles.fillColor = [245, 247, 255];
              data.cell.styles.textColor = [55, 65, 81];
              data.cell.styles.fontStyle = 'italic';
            }
          }
          // Limpar texto da coluna FERRAMENTA para desenhar manualmente
          if (data.column.index === 3 && data.cell.section === 'body') {
            const originalText = data.cell.text.join('\n');
            data.cell.text = []; // Limpar para não renderizar automaticamente
            (data.cell as any).originalToolText = originalText; // Guardar para usar no didDrawCell
          }
        },
        didDrawCell: function (data: any) {
          // Adicionar links clicáveis na coluna FERRAMENTA
          if (data.column.index === 3 && data.cell.section === 'body') {
            const cellText = (data.cell as any).originalToolText || '';
            const tools = cellText.split('\n').map((t: string) => t.trim()).filter((t: string) => t);
            
            doc.setFontSize(8);
            let yOffset = data.cell.y + 4;
            
            tools.forEach((tool: string) => {
              if (toolLinks[tool]) {
                // Ferramenta com link - desenhar em azul com link
                doc.setTextColor(0, 0, 255);
                doc.textWithLink(tool, data.cell.x + 2, yOffset, {
                  url: toolLinks[tool]
                });
                // Adicionar sublinhado
                const textWidth = doc.getTextWidth(tool);
                doc.setDrawColor(0, 0, 255);
                doc.line(data.cell.x + 2, yOffset + 0.5, data.cell.x + 2 + textWidth, yOffset + 0.5);
              } else {
                // Ferramenta sem link - desenhar texto normal
                doc.setTextColor(...colors.dark);
                doc.text(tool, data.cell.x + 2, yOffset);
              }
              yOffset += 4;
            });
          }
        }
      });

      // Adicionar nova página com cabeçalho moderno
      doc.addPage();

      // Cabeçalho moderno para página 2
      doc.setFillColor(...colors.secondary);
      doc.rect(0, 0, 220, 30, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...colors.white);
      doc.text("FASE DE EXECUÇÃO", 105, 20, {
        align: "center"
      });
      doc.setTextColor(...colors.dark);

      // Dados de execução dinâmicos baseados na configuração
      let executionData: string[][] = [];

      // Atividades base de execução
      executionData.push(...[
        [`Apresentar uma introdução do conteúdo sobre o tema [${parsedConfigData.tema || 'tema selecionado'}]`, "Execução", "Instrutor", ""],
        [`Apresentar a proposta das tarefas a serem desenvolvidas em sala de aula [${parsedConfigData.tarefasSala?.join(', ') || 'tarefas selecionadas'}] conforme nível de aprendizagem [${parsedConfigData.nivelAprendizagem || 'nível de aprendizagem selecionado'}]`, "Execução", "Instrutor", ""],
        ["Aplicar questionário de experiência prévia dos alunos sobre o Github", "Execução", "Instrutor", "Experiência Prévia - Estudantes"],
        ["Responder questionário de experiência prévia sobre o Github", "Execução", "Estudante", "Experiência Prévia - Estudantes"],
        ["Definir os líderes de grupos", "Execução", "Instrutor", ""],
        ["Criar os grupos de trabalho", "Execução", "Estudante", ""],
        ["Participar de treinamento sobre o Github", "Execução", "Estudante", ""],
        ["Criar a conta no Github", "Execução", "Estudante", ""],
        ["Instalar o Github Desktop (caso seja necessário)", "Execução", "Estudante", "Github Desktop"],
        ["Criar e compartilhar um repositório no Github (privado) ou um fork do projeto [apenas o líder do grupo] (caso seja necessário)", "Execução", "Estudante", "GitHub"]
      ]);

      // Adicionar atividades de seleção de projeto dinâmicas baseadas na estratégia
      // Sempre adicionar linha de apresentar critérios (base do PDF original)
      const criteriosExecucao = parsedConfigData.criteriosSelecao && parsedConfigData.criteriosSelecao.length > 0 
        ? parsedConfigData.criteriosSelecao.join(', ') 
        : 'critérios de seleção selecionados';
      executionData.push([`Apresentar os critérios de seleção de projetos OSS (caso estratégia de escolha tenha sido Livre escolha) [${criteriosExecucao}]`, "Execução", "Instrutor", "GitHub Trending"]);

      if (parsedConfigData.escolhaProjeto?.includes("Lista") || parsedConfigData.escolhaProjeto === "Lista de escolhas") {
        executionData.push(["Apresentar a lista de projetos selecionados pelo instrutor (caso estratégia de escolha tenha sido Lista de escolha)", "Execução", "Instrutor", ""]);
      }

      // Sempre adicionar linha de seleção de projeto (base do PDF original)
      executionData.push(["Selecionar projeto OSS (caso estratégia de escolha não tenha sido Predefinido)", "Execução", "Estudante", "GitHub Trending ou lista de projetos do professor"]);

      // Adicionar atividades de execução comuns
      executionData.push(...[
        ["Aplicar instrumento sobre reconhecimento do projeto OSS", "Execução", "Instrutor", "Reconhecimento do Projeto OSS"],
        ["Realizar reconhecimento do projeto OSS", "Execução", "Estudante", "Reconhecimento do Projeto OSS"],
        [`Apresentar as tarefas a serem desenvolvidas de acordo com o nível de controle do projeto OSS em SEE [${parsedConfigData.nivelControle || 'nível de controle selecionado'}]`, "Execução", "Instrutor", ""],
        [`Executar as tarefas planejadas para sala de aula [${parsedConfigData.tarefasSala?.join(', ') || 'inserir as atividades indicadas pelo instrutor'}]`, "Execução", "Instrutor", ""],
        [`Aplicar atividade avaliativa [${parsedConfigData.estrategiaAvaliacao || 'estratégia de avaliação selecionada'}]`, "Execução", "Instrutor", ""],
        [`Executar atividade avaliativa [${parsedConfigData.estrategiaAvaliacao || 'estratégia de avaliação selecionada'}]`, "Execução", "Estudante", ""]
      ]);
      autoTable(doc, {
        head: [["ATIVIDADE", "ETAPA", "RESPONSÁVEL", "FERRAMENTA"]],
        body: executionData,
        startY: 40,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
          textColor: colors.dark,
          valign: 'top',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: colors.secondary,
          textColor: colors.white,
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        columnStyles: {
          0: {
            cellWidth: 75,
            fontStyle: 'normal'
          },
          1: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          2: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          3: {
            cellWidth: 45,
            fontSize: 8
          }
        },
        margin: {
          left: 15,
          right: 15
        },
        didParseCell: function (data: any) {
          if (data.column.index === 0) {
            const cellText = data.cell.text.join(' ');
            if (cellText.includes('[') && cellText.includes(']')) {
              // Aplicar destaque sutil para células com conteúdo dinâmico
              data.cell.styles.fillColor = [240, 249, 255];
              data.cell.styles.textColor = [55, 65, 81];
              data.cell.styles.fontStyle = 'italic';
            }
          }
          // Limpar texto da coluna FERRAMENTA para desenhar manualmente
          if (data.column.index === 3 && data.cell.section === 'body') {
            const originalText = data.cell.text.join('\n');
            data.cell.text = []; // Limpar para não renderizar automaticamente
            (data.cell as any).originalToolText = originalText; // Guardar para usar no didDrawCell
          }
        },
        didDrawCell: function (data: any) {
          // Adicionar links clicáveis na coluna FERRAMENTA
          if (data.column.index === 3 && data.cell.section === 'body') {
            const cellText = (data.cell as any).originalToolText || '';
            const tools = cellText.split('\n').map((t: string) => t.trim()).filter((t: string) => t);
            
            doc.setFontSize(8);
            let yOffset = data.cell.y + 4;
            
            tools.forEach((tool: string) => {
              if (toolLinks[tool]) {
                // Ferramenta com link - desenhar em azul com link
                doc.setTextColor(0, 0, 255);
                doc.textWithLink(tool, data.cell.x + 2, yOffset, {
                  url: toolLinks[tool]
                });
                // Adicionar sublinhado
                const textWidth = doc.getTextWidth(tool);
                doc.setDrawColor(0, 0, 255);
                doc.line(data.cell.x + 2, yOffset + 0.5, data.cell.x + 2 + textWidth, yOffset + 0.5);
              } else {
                // Ferramenta sem link - desenhar texto normal
                doc.setTextColor(...colors.dark);
                doc.text(tool, data.cell.x + 2, yOffset);
              }
              yOffset += 4;
            });
          }
        }
      });

      // Adicionar nova página com cabeçalho moderno para avaliação
      doc.addPage();

      // Cabeçalho moderno para página 3
      doc.setFillColor(...colors.accent);
      doc.rect(0, 0, 220, 30, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...colors.white);
      doc.text("FASE DE AVALIAÇÃO", 105, 20, {
        align: "center"
      });
      doc.setTextColor(...colors.dark);

      // Dados de avaliação e acompanhamento - baseados nas imagens fornecidas
      const evaluationData = [
        ["Avaliar a metodologia adotada", "Acompanhamento", "Estudante", "Avaliação da Metodologia Adotada"],
        ["Realizar um relato de experiência", "Acompanhamento", "Instrutor", "Relato de Experiência do Instrutor"],
        ["Analisar o feedback", "Acompanhamento", "Instrutor", "Avaliação da Metodologia Adotada"],
        ["Solucionar o problema apresentado (caso tenha um feedback negativo)", "Acompanhamento", "Instrutor", "Avaliação da Metodologia Adotada"],
        ["Realizar ações corretivas (visando a necessidade de melhoria contínua)", "Avaliação e melhoria contínua", "Instrutor", "Avaliação da Metodologia Adotada"]
      ];
      autoTable(doc, {
        head: [["ATIVIDADE", "ETAPA", "RESPONSÁVEL", "FERRAMENTA"]],
        body: evaluationData,
        startY: 40,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 5,
          lineColor: [220, 220, 220],
          lineWidth: 0.3,
          textColor: colors.dark,
          valign: 'top',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: colors.accent,
          textColor: colors.white,
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250]
        },
        columnStyles: {
          0: {
            cellWidth: 75,
            fontStyle: 'normal'
          },
          1: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          2: {
            cellWidth: 30,
            halign: 'center',
            valign: 'middle'
          },
          3: {
            cellWidth: 45,
            fontSize: 8
          }
        },
        margin: {
          left: 15,
          right: 15
        },
        didParseCell: function (data: any) {
          // Limpar texto da coluna FERRAMENTA para desenhar manualmente
          if (data.column.index === 3 && data.cell.section === 'body') {
            const originalText = data.cell.text.join('\n');
            data.cell.text = []; // Limpar para não renderizar automaticamente
            (data.cell as any).originalToolText = originalText; // Guardar para usar no didDrawCell
          }
        },
        didDrawCell: function (data: any) {
          // Adicionar links clicáveis na coluna FERRAMENTA
          if (data.column.index === 3 && data.cell.section === 'body') {
            const cellText = (data.cell as any).originalToolText || '';
            const tools = cellText.split('\n').map((t: string) => t.trim()).filter((t: string) => t);
            
            doc.setFontSize(8);
            let yOffset = data.cell.y + 4;
            
            tools.forEach((tool: string) => {
              if (toolLinks[tool]) {
                // Ferramenta com link - desenhar em azul com link
                doc.setTextColor(0, 0, 255);
                doc.textWithLink(tool, data.cell.x + 2, yOffset, {
                  url: toolLinks[tool]
                });
                // Adicionar sublinhado
                const textWidth = doc.getTextWidth(tool);
                doc.setDrawColor(0, 0, 255);
                doc.line(data.cell.x + 2, yOffset + 0.5, data.cell.x + 2 + textWidth, yOffset + 0.5);
              } else {
                // Ferramenta sem link - desenhar texto normal
                doc.setTextColor(...colors.dark);
                doc.text(tool, data.cell.x + 2, yOffset);
              }
              yOffset += 4;
            });
          }
        }
      });

      // Adicionar rodapé com estilo moderno
      const pageCount = (doc as any).internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(...colors.primary);
        doc.rect(0, 285, 220, 12, 'F');
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.white);
        doc.text(`Página ${i} de ${pageCount}`, 105, 292, {
          align: "center"
        });
        doc.text("Gerado pela Plataforma FLOSSeed", 190, 292, {
          align: "right"
        });
      }

      // Salvar o PDF com nome de arquivo moderno
      const userName = parsedUserData.name ? `_${parsedUserData.name.replace(/\s+/g, '_')}` : '';
      const currentDate = new Date().toISOString().split('T')[0];
      doc.save(`Guia_OSS_SEE${userName}_${currentDate}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    }
  };
  const handleDownload = () => {
    generatePDF();
  };
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Cabeçalho */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600/95 to-blue-600/95 backdrop-blur-xl border-b border-purple-200/60">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            
            {/* Seletor de Idioma */}
            <div className="w-20 flex justify-end">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-blue-600 mb-8 leading-tight">
            {t('success.title')}
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 font-medium">
            {t('success.description')}
          </p>

          <div className="flex justify-center mb-16">
            <Button onClick={handleDownload} size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              <Download className="mr-3 h-6 w-6" />
              {t('success.download')}
            </Button>
          </div>
        </div>
      </div>

      {/* Barra inferior fixa */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600/95 via-blue-600/95 to-green-600/95 backdrop-blur-xl border-t border-purple-200/60 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/configuracao-projeto")} className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('success.previous.step')}
            </Button>
            
            <Button onClick={() => navigate("/")} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 ring-4 ring-green-300 ring-opacity-50 px-10 py-4 rounded-2xl font-bold transition-all duration-300 transform">
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default SuccessPage;