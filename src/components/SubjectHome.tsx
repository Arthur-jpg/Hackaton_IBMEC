
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, BookOpen } from 'lucide-react';

interface SubjectHomeProps {
  subjectId: string | undefined;
}

const subjectData: Record<string, any> = {
  electronics: {
    name: 'Electronics',
    description: 'Master the fundamentals of electronic circuits and systems',
    topics: [
      { id: 1, title: 'Basic Circuit Theory', description: 'Ohm\'s law, Kirchhoff\'s laws, and basic circuit analysis' },
      { id: 2, title: 'Diodes and Rectifiers', description: 'Understanding diode behavior and rectifier circuits' },
      { id: 3, title: 'Transistors', description: 'BJT and FET transistor operation and applications' },
      { id: 4, title: 'Operational Amplifiers', description: 'Op-amp circuits and applications' },
      { id: 5, title: 'Digital Logic', description: 'Boolean algebra and digital circuit design' },
    ]
  },
  'software-development': {
    name: 'Software Development',
    description: 'Learn programming fundamentals and software engineering principles',
    topics: [
      { id: 1, title: 'Programming Basics', description: 'Variables, data types, and control structures' },
      { id: 2, title: 'Object-Oriented Programming', description: 'Classes, objects, inheritance, and polymorphism' },
      { id: 3, title: 'Data Structures', description: 'Arrays, linked lists, stacks, and queues' },
      { id: 4, title: 'Algorithms', description: 'Sorting, searching, and algorithm analysis' },
      { id: 5, title: 'Software Design Patterns', description: 'Common design patterns and best practices' },
    ]
  },
  calculus: {
    name: 'Calculus I',
    description: 'Explore limits, derivatives, and integrals',
    topics: [
      { id: 1, title: 'Limits and Continuity', description: 'Understanding limits and continuous functions' },
      { id: 2, title: 'Derivatives', description: 'Differentiation rules and applications' },
      { id: 3, title: 'Applications of Derivatives', description: 'Optimization and related rates' },
      { id: 4, title: 'Integrals', description: 'Antiderivatives and definite integrals' },
      { id: 5, title: 'Applications of Integrals', description: 'Area, volume, and other applications' },
    ]
  },
  'engineering-data': {
    name: 'Engineering Data',
    description: 'Data analysis and statistical methods for engineers',
    topics: [
      { id: 1, title: 'Data Collection Methods', description: 'Sampling techniques and data gathering' },
      { id: 2, title: 'Descriptive Statistics', description: 'Mean, median, mode, and variance' },
      { id: 3, title: 'Probability Distributions', description: 'Normal, binomial, and other distributions' },
      { id: 4, title: 'Hypothesis Testing', description: 'Statistical significance and testing methods' },
      { id: 5, title: 'Regression Analysis', description: 'Linear and multiple regression' },
    ]
  }
};

const SubjectHome = ({ subjectId }: SubjectHomeProps) => {
  const subject = subjectData[subjectId || ''] || subjectData.electronics;
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {subject.name}
        </h1>
        <p className="text-gray-600 text-lg mb-6">{subject.description}</p>
      </div>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Topics</h2>
        {subject.topics.map((topic: any, index: number) => (
          <Card 
            key={topic.id} 
            className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl text-gray-800">{topic.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectHome;
