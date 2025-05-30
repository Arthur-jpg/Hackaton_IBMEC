import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Timer, BookOpen } from 'lucide-react';
import { usePomodoro } from '../App'; // Assuming App.tsx is in the same directory or adjust path

// Flashcard data remains local to this component or could also be lifted if needed
const flashcardData: Record<string, any[]> = {
  electronics: [
    { id: 1, front: "What is Ohm's Law?", back: "V = I × R (Voltage = Current × Resistance)" },
    { id: 2, front: "What is Kirchhoff's Current Law?", back: "The sum of currents entering a node equals the sum of currents leaving the node" },
    { id: 3, front: "What is a diode?", back: "A semiconductor device that allows current to flow in only one direction" },
  ],
  'software-development': [
    { id: 1, front: "What is a variable?", back: "A storage location with an associated name that contains data" },
    { id: 2, front: "What is inheritance?", back: "A mechanism where a class inherits properties and methods from another class" },
    { id: 3, front: "What is an algorithm?", back: "A step-by-step procedure for solving a problem or completing a task" },
  ],
  calculus: [
    { id: 1, front: "What is a limit?", back: "The value that a function approaches as the input approaches a particular value" },
    { id: 2, front: "What is a derivative?", back: "The rate of change of a function with respect to its variable" },
    { id: 3, front: "What is an integral?", back: "The reverse of differentiation; represents the area under a curve" },
  ],
  'engineering-data': [
    { id: 1, front: "What is the mean?", back: "The average of a set of numbers" },
    { id: 2, front: "What is standard deviation?", back: "A measure of the spread of data points from the mean" },
    { id: 3, front: "What is hypothesis testing?", back: "A statistical method to test assumptions about a population parameter" },
  ]
};

interface StudyToolsProps {
  subjectId: string | undefined; // For flashcard data
  // Pomodoro props are now removed as they will be consumed from context
}

const StudyTools = ({ subjectId }: StudyToolsProps) => {
  // Consume Pomodoro context
  const { 
    pomodoroTime, 
    isPomodoroRunning, 
    isPomodoroBreak, 
    togglePomodoro,  
    resetPomodoro,   
    formatTime       
  } = usePomodoro();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'pomodoro'>('flashcards');
  
  // Flashcard state (remains local)
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const flashcards = flashcardData[subjectId || 'electronics'] || flashcardData.electronics;
  
  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  // Constants for display, could also be part of context if they need to be configurable globally

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Study Tools
        </h1>
        <p className="text-gray-600 text-lg">Choose your preferred study method to enhance your learning experience</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'flashcards' ? 'default' : 'outline'}
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 ${
            activeTab === 'flashcards' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
              : 'hover:bg-purple-50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Flashcards
        </Button>
        <Button
          variant={activeTab === 'pomodoro' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pomodoro')}
          className={`flex items-center gap-2 ${
            activeTab === 'pomodoro' 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
              : 'hover:bg-purple-50'
          }`}
        >
          <Timer className="h-4 w-4" />
          Pomodoro Timer
        </Button>
      </div>

      {activeTab === 'flashcards' && (
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Card {currentCardIndex + 1} of {flashcards.length}
              </Badge>
              <CardTitle className="text-2xl text-gray-800">Flashcards</CardTitle>
              <div className="w-24" /> {/* Adjusted Spacer for centering */}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div 
              className="min-h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-6 flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  {showAnswer ? "Answer:" : "Question:"}
                </p>
                <p className="text-xl text-gray-700">
                  {showAnswer ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
                </p>
                {!showAnswer && (
                  <p className="text-sm text-gray-500 mt-4">Click to reveal answer</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevCard}
                className="flex items-center gap-2 hover:bg-purple-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-700"
              >
                {showAnswer ? 'Show Question' : 'Show Answer'}
              </Button>
              
              <Button
                variant="outline"
                onClick={nextCard}
                className="flex items-center gap-2 hover:bg-purple-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'pomodoro' && (
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Pomodoro Timer</CardTitle>
            <p className="text-gray-600">
              {isPomodoroBreak ? 'Break Time - Take a rest!' : 'Focus Time - Stay concentrated!'}
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-full w-64 h-64 mx-auto flex items-center justify-center mb-6 shadow-lg">
                <div className="text-6xl font-bold text-gray-800">
                  {formatTime(pomodoroTime)}
                </div>
              </div>
              
              <Badge 
                variant="secondary" 
                className={`text-lg px-6 py-2 ${
                  isPomodoroBreak ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {isPomodoroBreak ? 'Break Session' : 'Work Session'}
              </Badge>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={togglePomodoro} // Consumed from context
                className={`flex items-center gap-2 px-8 py-3 text-lg text-white ${
                  isPomodoroRunning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {isPomodoroRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPomodoroRunning ? 'Pause' : 'Start'}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetPomodoro} // Consumed from context
                className="flex items-center gap-2 px-8 py-3 text-lg hover:bg-gray-50"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyTools;
