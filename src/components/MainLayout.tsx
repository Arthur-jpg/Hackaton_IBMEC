// src/components/MainLayout.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; //
import { FilePenLine } from 'lucide-react'; //
import NotesInterface from './NotesInterface'; // Assuming NotesInterface.tsx is in the same components folder

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isNotesInterfaceOpen, setIsNotesInterfaceOpen] = useState(false);

  return (
    <div className="flex-1">
      {children} 

      <Button
        onClick={() => setIsNotesInterfaceOpen(true)}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Open Notes"
        size="icon"
      >
        <FilePenLine size={24} />
      </Button>

      <NotesInterface
        isOpen={isNotesInterfaceOpen}
        onOpenChange={setIsNotesInterfaceOpen}
      />
    </div>
  );
};

export default MainLayout;