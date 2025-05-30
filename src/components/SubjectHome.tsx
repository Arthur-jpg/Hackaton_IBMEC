// src/components/SubjectHome.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge'; // Not used in the provided snippet
// import { Progress } from '@/components/ui/progress'; // Not used
// import { CheckCircle, Clock, BookOpen } from 'lucide-react'; // Not used

interface SubjectHomeProps {
  subjectId: string | undefined;
}

// Os dados do placeholder devem ser traduzidos aqui ou movidos para um arquivo de localização/i18n
const subjectData: Record<string, any> = {
  electronics: {
    name: 'Eletrônica', // Translated
    description: 'Domine os fundamentos de circuitos e sistemas eletrônicos', // Translated
    topics: [
      { id: 1, title: 'Teoria Básica de Circuitos', description: 'Lei de Ohm, leis de Kirchhoff e análise básica de circuitos' }, // Translated
      { id: 2, title: 'Diodos e Retificadores', description: 'Compreensão do comportamento de diodos e circuitos retificadores' }, // Translated
      { id: 3, title: 'Transistores', description: 'Operação e aplicações de transistores BJT e FET' }, // Translated
      { id: 4, title: 'Amplificadores Operacionais', description: 'Circuitos e aplicações de amp-ops' }, // Translated
      { id: 5, title: 'Lógica Digital', description: 'Álgebra booleana e design de circuitos digitais' }, // Translated
    ]
  },
  'software-development': {
    name: 'Desenvolvimento de Software', // Translated
    description: 'Aprenda fundamentos de programação e princípios de engenharia de software', // Translated
    topics: [
      { id: 1, title: 'Conceitos Básicos de Programação', description: 'Variáveis, tipos de dados e estruturas de controle' }, // Translated
      { id: 2, title: 'Programação Orientada a Objetos', description: 'Classes, objetos, herança e polimorfismo' }, // Translated
      { id: 3, title: 'Estruturas de Dados', description: 'Arrays, listas ligadas, pilhas e filas' }, // Translated
      { id: 4, title: 'Algoritmos', description: 'Ordenação, busca e análise de algoritmos' }, // Translated
      { id: 5, title: 'Padrões de Design de Software', description: 'Padrões de design comuns e melhores práticas' }, // Translated
    ]
  },
  calculus: {
    name: 'Cálculo I', // Translated
    description: 'Explore limites, derivadas e integrais', // Translated
    topics: [
      { id: 1, title: 'Limites e Continuidade', description: 'Compreensão de limites e funções contínuas' }, // Translated
      { id: 2, title: 'Derivadas', description: 'Regras de diferenciação e aplicações' }, // Translated
      { id: 3, title: 'Aplicações de Derivadas', description: 'Otimização e taxas relacionadas' }, // Translated
      { id: 4, title: 'Integrais', description: 'Antiderivadas e integrais definidas' }, // Translated
      { id: 5, title: 'Aplicações de Integrais', description: 'Área, volume e outras aplicações' }, // Translated
    ]
  },
  'engineering-data': {
    name: 'Dados de Engenharia', // Translated
    description: 'Análise de dados e métodos estatísticos para engenheiros', // Translated
    topics: [
      { id: 1, title: 'Métodos de Coleta de Dados', description: 'Técnicas de amostragem e coleta de dados' }, // Translated
      { id: 2, title: 'Estatística Descritiva', description: 'Média, mediana, moda e variância' }, // Translated
      { id: 3, title: 'Distribuições de Probabilidade', description: 'Distribuições normal, binomial e outras' }, // Translated
      { id: 4, title: 'Teste de Hipóteses', description: 'Significância estatística e métodos de teste' }, // Translated
      { id: 5, title: 'Análise de Regressão', description: 'Regressão linear e múltipla' }, // Translated
    ]
  }
};

const SubjectHome = ({ subjectId }: SubjectHomeProps) => {
  const subject = subjectData[subjectId || ''] || subjectData.electronics;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {subject.name} {/* Uses translated name from subjectData */}
        </h1>
        <p className="text-gray-600 text-lg mb-6">{subject.description}</p> {/* Uses translated description */}
      </div>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tópicos do Curso</h2> {/* Translated */}
        {subject.topics.map((topic: any, index: number) => (
          <Card
            key={topic.id}
            className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl text-gray-800">{topic.title}</CardTitle> {/* Uses translated title */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{topic.description}</p> {/* Uses translated description */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectHome;