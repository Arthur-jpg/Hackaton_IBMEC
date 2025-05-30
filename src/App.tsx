// src/App.tsx
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
import CreateAccount from "./pages/CreateAccount";
import MainLayout from './components/MainLayout';
import ProfilePage from './pages/ProfilePage';

import { AuthProvider } from './components/contexts/authContext'; // ✅ Importado corretamente

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

const queryClient = new QueryClient();

const App = () => {
  const WORK_DURATION = 0.1 * 60;
  const BREAK_DURATION = 1 * 60;

  const [pomodoroTime, setPomodoroTime] = useState(WORK_DURATION);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [isPomodoroBreak, setIsPomodoroBreak] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (isPomodoroRunning && pomodoroTime > 0) {
      intervalId = setInterval(() => {
        setPomodoroTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isPomodoroRunning && pomodoroTime === 0) {
      setIsPomodoroBreak((prevIsBreak) => {
        const nextIsBreak = !prevIsBreak;
        setPomodoroTime(nextIsBreak ? BREAK_DURATION : WORK_DURATION);
        toast.info(nextIsBreak ? "Time for a break! 🧘" : "Back to focus! 🚀");
        return nextIsBreak;
      });
      setIsPomodoroRunning(true);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPomodoroRunning, pomodoroTime]);

  const togglePomodoro = useCallback(() => {
    setIsPomodoroRunning((prevIsRunning) => !prevIsRunning);
  }, []);

  const resetPomodoro = useCallback(() => {
    setIsPomodoroRunning(false);
    setIsPomodoroBreak(false);
    setPomodoroTime(WORK_DURATION);
  }, [WORK_DURATION]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const pomodoroContextValue: PomodoroContextType = {
    pomodoroTime,
    isPomodoroRunning,
    isPomodoroBreak,
    togglePomodoro,
    resetPomodoro,
    formatTime,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster richColors position="top-right" />
        <AuthProvider> {/* ✅ Adicionado o AuthProvider aqui */}
          <PomodoroContext.Provider value={pomodoroContextValue}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/subject/:subjectId"
                  element={
                    <MainLayout>
                      <SubjectHub />
                    </MainLayout>
                  }
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PomodoroContext.Provider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
