// src/components/TestArea.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { testData, Question as TestQuestion, QuestionOption } from '@/lib/testData'; // Assuming testData.ts is in src/lib
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestAreaProps {
  subjectId: string | undefined;
}

const TestArea: React.FC<TestAreaProps> = ({ subjectId }) => {
  const [currentQuestions, setCurrentQuestions] = useState<TestQuestion[]>([]);
  const [testTitle, setTestTitle] = useState<string>('Test Area');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // { questionId: selectedOptionId }
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (subjectId && testData[subjectId]) {
      setCurrentQuestions(testData[subjectId].questions);
      setTestTitle(testData[subjectId].name);
    } else {
      // Fallback or handle case where subjectId is not found
      setCurrentQuestions(testData['electronics']?.questions || []); // Default to electronics or empty
      setTestTitle(testData['electronics']?.name || 'Sample Test');
    }
    // Reset state for a new test
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  }, [subjectId]);

  const currentQuestion = useMemo(() => {
    return currentQuestions[currentQuestionIndex];
  }, [currentQuestions, currentQuestionIndex]);

  const handleAnswerSelect = (optionId: string) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleSubmitTest = () => {
    let calculatedScore = 0;
    currentQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionId) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setShowResults(true);
    toast({
        title: "Test Submitted!",
        description: `You scored ${calculatedScore} out of ${currentQuestions.length}.`,
    });
  };

  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
    toast({ title: "Test Reset", description: "Good luck on your next attempt!"});
  };

  const progressPercentage = currentQuestions.length > 0 ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0;

  if (currentQuestions.length === 0) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>No Test Available</AlertTitle>
          <AlertDescription>Sorry, there are no questions available for this subject yet.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-8 max-w-3xl mx-auto animate-fade-in">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Test Results</CardTitle>
            <p className="text-gray-600">{testTitle}</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex flex-col items-center">
                <Award className="h-24 w-24 text-yellow-500 mb-4" />
                <p className="text-5xl font-bold text-purple-600">
                  {score} / {currentQuestions.length}
                </p>,
                <p className="text-xl text-gray-700 mt-2">
                  You answered {((score / currentQuestions.length) * 100).toFixed(0)}% correctly!
                </p>
            </div>
            
            <div className="space-y-3 text-left max-h-96 overflow-y-auto p-1">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Review Your Answers:</h3>
                {currentQuestions.map((q, index) => (
                    <div key={q.id} className={`p-3 rounded-md ${userAnswers[q.id] === q.correctOptionId ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                        <p className="font-medium text-gray-800">{index + 1}. {q.text}</p>
                        <p className="text-sm mt-1">
                            Your answer: <span className="font-semibold">{q.options.find(opt => opt.id === userAnswers[q.id])?.text || "Not answered"}</span>
                            {userAnswers[q.id] !== q.correctOptionId && (
                                <span className="ml-2 text-green-700">(Correct: {q.options.find(opt => opt.id === q.correctOptionId)?.text})</span>
                            )}
                        </p>
                    </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={handleRetakeTest} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!currentQuestion) {
    // This case should ideally not be reached if currentQuestions has items
    return <div className="p-8">Loading question or test finished...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800 mb-1">{testTitle}</CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
            <Progress value={progressPercentage} className="w-1/3 h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[200px]">
          <p className="text-lg font-medium text-gray-700">{currentQuestion.text}</p>
          <RadioGroup
            value={userAnswers[currentQuestion.id] || ''}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {currentQuestion.options.map(option => (
              <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50/50 hover:bg-gray-100/70 rounded-md transition-colors cursor-pointer has-[:checked]:bg-purple-50 has-[:checked]:border-purple-400 border border-transparent">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="text-gray-700 flex-1 cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="hover:bg-gray-100/70"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex < currentQuestions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1))}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
                onClick={handleSubmitTest}
                disabled={Object.keys(userAnswers).length !== currentQuestions.length}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Submit Test
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestArea;