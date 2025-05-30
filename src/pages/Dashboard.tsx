
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Code, Zap, User, LogOut } from 'lucide-react';

const subjects = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    description: 'Circuit analysis, digital systems, and electronic components',
    progress: 75,
  },
  {
    id: 'software-development',
    name: 'Software Development',
    icon: Code,
    color: 'from-green-400 to-blue-500',
    description: 'Programming fundamentals, algorithms, and software design',
    progress: 60,
  },
  {
    id: 'calculus',
    name: 'Calculus I',
    icon: Calculator,
    color: 'from-purple-400 to-pink-500',
    description: 'Limits, derivatives, integrals, and applications',
    progress: 40,
  },
  {
    id: 'engineering-data',
    name: 'Engineering Data',
    icon: BookOpen,
    color: 'from-blue-400 to-indigo-500',
    description: 'Data analysis, statistics, and engineering applications',
    progress: 85,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, Hudson! 👋
            </h1>
            <p className="text-gray-600 mt-2">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Hudson Student</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/70 backdrop-blur-sm border-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleSubjectSelect(subject.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-r ${subject.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 inline-block">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Keep up the great work! 🌟</h3>
            <p className="text-gray-600">You're making excellent progress across all subjects.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
