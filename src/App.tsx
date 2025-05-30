import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster, toast } from "@/components/ui/sonner"; 
import { TooltipProvider } from "@/components/ui/tooltip"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 
import SubjectHub from "./pages/SubjectHub"; 
import NotFound from "./pages/NotFound"; 
import { FilePenLine } from 'lucide-react'; // Or any other icon you prefer
import NotesInterface from './components/NotesInterface'
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface PomodoroContextType {
  pomodoroTime: number;
  isPomodoroRunning: boolean;
  isPomodoroBreak: boolean;
  togglePomodoro: () => void;
  resetPomodoro: () => void;
  formatTime: (seconds: number) => string;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};

// User's queryClient
const queryClient = new QueryClient();

const App = () => {
  // Pomodoro State and Logic (integrated from the selected code)
  const WORK_DURATION = 0.1 * 60; // 25 minutes in seconds
  const BREAK_DURATION = 1 * 60;  // 5 minutes in seconds

  const [pomodoroTime, setPomodoroTime] = useState(WORK_DURATION);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [isPomodoroBreak, setIsPomodoroBreak] = useState(false);
  
  const [isNotesInterfaceOpen, setIsNotesInterfaceOpen] = useState(false);

  // Pomodoro Timer Core Logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (isPomodoroRunning && pomodoroTime > 0) {
      // If timer is running and there's time left, decrement every second
      intervalId = setInterval(() => {
        setPomodoroTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPomodoroRunning && pomodoroTime === 0) {
      // If timer is running and time is up, switch session (work/break)
      setIsPomodoroBreak((prevIsBreak) => {
        const nextIsBreak = !prevIsBreak;
        setPomodoroTime(nextIsBreak ? BREAK_DURATION : WORK_DURATION);
        // Notify user about session switch using Sonner
        toast.info(nextIsBreak ? "Time for a break! 🧘" : "Back to focus! 🚀");
        return nextIsBreak;
      });
      setIsPomodoroRunning(true); // Keep it running for the new session unless explicitly paused
    }
    // If timer is not running (isPomodoroRunning is false), or time is 0 and not running, 
    // the interval will not be set or will be cleared by the cleanup function.

    // Cleanup function: clear interval when component unmounts or dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPomodoroRunning, pomodoroTime, WORK_DURATION, BREAK_DURATION]); // Dependencies for the effect

  // Callback to toggle timer state (play/pause)
  const togglePomodoro = useCallback(() => {
    setIsPomodoroRunning((prevIsRunning) => !prevIsRunning);
  }, []);

  // Callback to reset timer to initial work session state
  const resetPomodoro = useCallback(() => {
    setIsPomodoroRunning(false);
    setIsPomodoroBreak(false); 
    setPomodoroTime(WORK_DURATION);
  }, [WORK_DURATION]);

  // Callback to format time from seconds to MM:SS string
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Value object to be passed to the PomodoroContext.Provider
  const pomodoroContextValue: PomodoroContextType = {
    pomodoroTime,
    isPomodoroRunning,
    isPomodoroBreak,
    togglePomodoro,
    resetPomodoro,
    formatTime,
  };

  // User's App structure with PomodoroContext.Provider wrapping the routes
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster richColors position="top-right" /> {/* */}
        <PomodoroContext.Provider value={pomodoroContextValue}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} /> {/* */}
              <Route path="/dashboard" element={<Dashboard />} /> {/* */}
              <Route path="/subject/:subjectId" element={<SubjectHub />} /> {/* */}
              <Route path="*" element={<NotFound />} /> {/* */}
            </Routes>
          </BrowserRouter>
        </PomodoroContext.Provider>

        {/* Floating Action Button for Notes Interface */}
        <Button
          onClick={() => setIsNotesInterfaceOpen(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:scale-110 transition-transform duration-200 z-50"
          aria-label="Open Notes"
          size="icon"
        >
          <FilePenLine size={24} />
        </Button>

        {/* Notes Interface Modal */}
        <NotesInterface
          isOpen={isNotesInterfaceOpen}
          onOpenChange={setIsNotesInterfaceOpen}
        />

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
