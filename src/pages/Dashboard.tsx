// src/pages/Dashboard.tsx
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import EventCalendar from '@/components/EventCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy SVG components (as provided)
const Zap = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const Code = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l-4 4m0 0l-4 4m4-4H6" />
  </svg>
);
const Calculator = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
  </svg>
);
const BookOpen = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m0 0A7.5 7.5 0 0019.5 12H4.5A7.5 7.5 0 0012 17.747m0-11.494A7.5 7.5 0 004.5 12h15A7.5 7.5 0 0012 6.253z" />
  </svg>
);


const subjects = [
  {
    id: 'electronics',
    name: 'Eletrônica',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    description: 'Análise de circuitos, sistemas digitais e componentes eletrônicos',
  },
  {
    id: 'software-development',
    name: 'Desenvolvimento de Software',
    icon: Code,
    color: 'from-green-400 to-blue-500',
    description: 'Fundamentos de programação, algoritmos e design de software',
  },
  {
    id: 'calculus',
    name: 'Cálculo I',
    icon: Calculator,
    color: 'from-purple-400 to-pink-500',
    description: 'Limites, derivadas, integrais e aplicações',
  },
  {
    id: 'engineering-data',
    name: 'Dados de Engenharia',
    icon: BookOpen,
    color: 'from-blue-400 to-indigo-500',
    description: 'Análise de dados, estatísticas e aplicações em engenharia',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bem-vindo de volta, Hudson! 👋
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">Gerencie sua agenda e datas importantes.</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Updated this section to be a Link */}
            <Link
              to="/profile"
              className="group flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-white/90 transition-colors duration-150 cursor-pointer"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 group-hover:text-purple-700 transition-colors duration-150" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors duration-150">
                Estudante Hudson
              </span>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="mb-10">
          <EventCalendar />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Suas Matérias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card
                  key={subject.id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-0"
                  onClick={() => navigate(`/subject/${subject.id}`)}
                >
                  <CardHeader>
                    <div className={`p-3 rounded-lg inline-block bg-gradient-to-r ${subject.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-md font-semibold text-gray-800 group-hover:text-purple-600">{subject.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-1">{subject.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;