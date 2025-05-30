// src/pages/Dashboard.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react'; 
import EventCalendar from '@/components/EventCalendar'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Zap = ({ className = "" }: { className?: string }) => <svg className={className} />;
const Code = ({ className = "" }: { className?: string }) => <svg className={className} />;
const Calculator = ({ className = "" }: { className?: string }) => <svg className={className} />;
const BookOpen = ({ className = "" }: { className?: string }) => <svg className={className} />;

const subjects = [ 
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    description: 'Circuit analysis, digital systems, and electronic components',
  },
  {
    id: 'software-development',
    name: 'Software Development',
    icon: Code,
    color: 'from-green-400 to-blue-500',
    description: 'Programming fundamentals, algorithms, and software design',
  },
  {
    id: 'calculus',
    name: 'Calculus I',
    icon: Calculator,
    color: 'from-purple-400 to-pink-500',
    description: 'Limits, derivatives, integrals, and applications',
  },
  {
    id: 'engineering-data',
    name: 'Engineering Data',
    icon: BookOpen,
    color: 'from-blue-400 to-indigo-500',
    description: 'Data analysis, statistics, and engineering applications',
  },
];


const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); //
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, Hudson! 👋
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2">Manage your schedule and important dates.</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Hudson Student</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90 text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-10">
          <EventCalendar />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
                const IconComponent = subject.icon;
                return (
                    <Card key={subject.id} className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white/70 backdrop-blur-sm border-0" onClick={() => navigate(`/subject/${subject.id}`)}>
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