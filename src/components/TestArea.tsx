// src/components/TestArea.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'; //
import { Button } from '@/components/ui/button'; //
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; //
import { Label } from '@/components/ui/label'; //
import { Progress } from '@/components/ui/progress'; //
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; //
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; //
import { testData, Question as TestQuestion, TopicTest, SubjectTests } from '@/lib/testData';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft, ArrowRight, Award, ListChecks, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; //

interface TestAreaProps {
  subjectId: string | undefined;
}

interface LastGrade {
    score: number;
    totalQuestions: number;
    date: string; // ISO string date
}

const TestArea: React.FC<TestAreaProps> = ({ subjectId }) => {
  const [currentSubjectData, setCurrentSubjectData] = useState<SubjectTests | null>(null);
  const [availableTopics, setAvailableTopics] = useState<TopicTest[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicTest | null>(null);
  
  const [currentQuestions, setCurrentQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [lastGrade, setLastGrade] = useState<LastGrade | null>(null);

  const { toast } = useToast();

  const getGradeLocalStorageKey = useCallback((sId: string, tId: string) => {
    return `testGrade_${sId}_${tId}`;
  }, []);

  // Load subject and topic data
  useEffect(() => {
    const SId = subjectId || 'electronics'; // Default subject
    const subjectTestData = testData[SId];
    if (subjectTestData) {
      setCurrentSubjectData(subjectTestData);
      setAvailableTopics(subjectTestData.topics);
      setSelectedTopic(null); // Reset selected topic when subject changes
      setCurrentQuestions([]); // Reset questions
      setShowResults(false); // Hide results
    } else {
      setCurrentSubjectData(null);
      setAvailableTopics([]);
      setSelectedTopic(null);
      setCurrentQuestions([]);
    }
  }, [subjectId]);

  // Load last grade when a topic is selected
  useEffect(() => {
    if (subjectId && selectedTopic) {
      const gradeKey = getGradeLocalStorageKey(subjectId, selectedTopic.topicId);
      const storedGrade = localStorage.getItem(gradeKey);
      if (storedGrade) {
        setLastGrade(JSON.parse(storedGrade));
      } else {
        setLastGrade(null);
      }
      // Reset test state for the new topic
      setCurrentQuestions(selectedTopic.questions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
    }
  }, [selectedTopic, subjectId, getGradeLocalStorageKey]);


  const currentQuestion = useMemo(() => {
    return currentQuestions[currentQuestionIndex];
  }, [currentQuestions, currentQuestionIndex]);

  const handleAnswerSelect = (optionId: string) => {
    if (!currentQuestion) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleSubmitTest = () => {
    if (!subjectId || !selectedTopic) return;

    let calculatedScore = 0;
    currentQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionId) calculatedScore++;
    });
    setScore(calculatedScore);
    setShowResults(true);

    const newGrade: LastGrade = {
        score: calculatedScore,
        totalQuestions: currentQuestions.length,
        date: new Date().toISOString(),
    };
    localStorage.setItem(getGradeLocalStorageKey(subjectId, selectedTopic.topicId), JSON.stringify(newGrade));
    setLastGrade(newGrade); // Update last grade displayed

    toast({
        title: "Test Submitted!",
        description: `You scored ${calculatedScore} out of ${currentQuestions.length}.`,
    });
  };

  const handleStartTest = (topicId: string) => {
    const topic = availableTopics.find(t => t.topicId === topicId);
    if (topic) {
      setSelectedTopic(topic);
    }
  };
  
  const handleGoToTopicSelection = () => {
    setSelectedTopic(null);
    setCurrentQuestions([]);
    setShowResults(false);
    setLastGrade(null); // Clear last grade when going back to topic selection
  };

  const progressPercentage = currentQuestions.length > 0 ? ((currentQuestionIndex + 1) / currentQuestions.length) * 100 : 0;

  if (!currentSubjectData) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Alert variant="destructive"><AlertTitle>No Test Data</AlertTitle><AlertDescription>Test data for this subject is not available.</AlertDescription></Alert>
      </div>
    );
  }

  // Topic Selection Screen
  if (!selectedTopic) {
    return (
      <div className="p-8 max-w-3xl mx-auto animate-fade-in">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 mb-2 flex items-center">
                <ListChecks className="mr-3 h-7 w-7 text-purple-600"/>
                Select a Topic for Your Test
            </CardTitle>
            <CardDescription>{currentSubjectData.subjectName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTopics.length > 0 ? availableTopics.map(topic => {
                const gradeKey = getGradeLocalStorageKey(subjectId || 'electronics', topic.topicId);
                const storedGrade = localStorage.getItem(gradeKey);
                let topicLastGrade: LastGrade | null = null;
                if (storedGrade) topicLastGrade = JSON.parse(storedGrade);

                return (
                    <Card key={topic.topicId} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">{topic.topicName}</h3>
                                <p className="text-sm text-gray-500">{topic.questions.length} questions</p>
                                {topicLastGrade && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        Last Grade: {topicLastGrade.score}/{topicLastGrade.totalQuestions} 
                                        <span className="text-gray-400 ml-1">({new Date(topicLastGrade.date).toLocaleDateString()})</span>
                                    </p>
                                )}
                            </div>
                            <Button onClick={() => handleStartTest(topic.topicId)}>Start Test</Button>
                        </div>
                    </Card>
                );
            }) : <p className="text-gray-500">No topics available for this subject.</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test Results Screen
  if (showResults) {
    return (
      <div className="p-8 max-w-3xl mx-auto animate-fade-in">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Test Results</CardTitle>
            <p className="text-gray-600">{selectedTopic.topicName} - {currentSubjectData.subjectName}</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* ... (Results display as before, ensure it uses score and currentQuestions.length) ... */}
            <div className="flex flex-col items-center">
                <Award className="h-24 w-24 text-yellow-500 mb-4" />
                <p className="text-5xl font-bold text-purple-600">
                  {score} / {currentQuestions.length}
                </p>
                <p className="text-xl text-gray-700 mt-2">
                  You answered {((score / currentQuestions.length) * 100).toFixed(0)}% correctly!
                </p>
            </div>
            <div className="space-y-3 text-left max-h-80 overflow-y-auto p-1">
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
          <CardFooter className="justify-center space-x-3">
            <Button variant="outline" onClick={handleGoToTopicSelection}> <ListChecks className="mr-2 h-4 w-4" /> Select Another Topic</Button>
            <Button onClick={() => { setSelectedTopic(null); handleStartTest(selectedTopic.topicId); }} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake This Test
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Test Taking Screen
  if (!currentQuestion) return <div className="p-8">Loading question...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <Button variant="link" onClick={handleGoToTopicSelection} className="p-0 h-auto text-sm text-purple-600 hover:underline mb-2">
            &larr; Back to Topic Selection
          </Button>
          <CardTitle className="text-xl text-gray-800 mb-1">{selectedTopic.topicName} Test</CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {currentQuestions.length}</p>
            <Progress value={progressPercentage} className="w-1/3 h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[200px]">
          {/* ... (Question display as before) ... */}
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
          {/* ... (Navigation buttons as before) ... */}
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
                disabled={Object.keys(userAnswers).length !== currentQuestions.length} // Ensure all questions are answered
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Submit Test
            </Button>
          )}
        </CardFooter>
      </Card>
       {lastGrade && !showResults && (
            <Alert className="mt-6 bg-blue-50 border-blue-300 text-blue-700">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <AlertTitle className="font-semibold">Your Last Attempt on this Topic</AlertTitle>
                <AlertDescription>
                    You scored {lastGrade.score}/{lastGrade.totalQuestions} on {new Date(lastGrade.date).toLocaleDateString()}.
                </AlertDescription>
            </Alert>
        )}
    </div>
  );
};

export default TestArea;