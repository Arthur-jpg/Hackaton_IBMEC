import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; //
import { Home, MessageCircle, BookOpen, ArrowLeft, Heart, Timer as TimerIcon, FileText as TestIcon } from 'lucide-react'; // Added TestIcon
import { cn } from '@/lib/utils'; //
import { usePomodoro } from '../App';  //

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home }, //
  { id: 'chat', label: 'Chat', icon: MessageCircle }, //
  { id: 'study-tools', label: 'Study Tools', icon: BookOpen }, //
  { id: 'tests', label: 'Tests', icon: TestIcon }, // New Test Area item
];

const Sidebar = ({ currentPage, onPageChange }: SidebarProps) => {
  const navigate = useNavigate(); //
  const { pomodoroTime, isPomodoroRunning, isPomodoroBreak, formatTime } = usePomodoro(); //

  const handleReturn = () => {
    navigate('/dashboard'); //
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm shadow-xl border-r border-white/20 flex flex-col">
      <div className="p-6 border-b border-gray-200/50"> {/* */}
        <div className="flex items-center gap-2 mb-6"> {/* */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg"> {/* */}
            <BookOpen className="h-6 w-6 text-white" /> {/* */}
          </div>
          <Heart className="h-4 w-4 text-pink-500 animate-pulse" /> {/* */}
          <span className="font-semibold text-gray-800">StudyHub</span> {/* */}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2"> {/* */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 py-3 transition-all duration-200 hover:scale-105',
                currentPage === item.id
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md'
                  : 'hover:bg-gray-100/50 text-gray-700'
              )} //
              onClick={() => onPageChange(item.id)}
            >
              <Icon className={cn(
                'h-5 w-5',
                currentPage === item.id ? 'text-purple-600' : 'text-gray-600'
              )} /> {/* */}
              <span className="font-medium">{item.label}</span> {/* */}
            </Button>
          );
        })}
      </nav>

      {isPomodoroRunning && ( //
        <div className="p-4 border-t border-gray-200/50 animate-fade-in"> {/* */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg shadow"> {/* */}
            <div className="flex items-center justify-center gap-2 mb-1"> {/* */}
              <TimerIcon className={`h-5 w-5 ${isPomodoroBreak ? 'text-blue-500' : 'text-green-600'}`} /> {/* */}
              <span className={`font-semibold ${isPomodoroBreak ? 'text-blue-700' : 'text-green-700'}`}> {/* */}
                {isPomodoroBreak ? 'Break Time' : 'Focus Time'}
              </span>
            </div>
            <div className="text-center text-2xl font-bold text-gray-800"> {/* */}
              {formatTime(pomodoroTime)}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200/50"> {/* */}
        <Button
          onClick={handleReturn}
          variant="outline"
          className="w-full justify-start gap-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 transition-all duration-200 hover:scale-105" //
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" /> {/* */}
          <span className="font-medium">Return to Dashboard</span> {/* */}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;