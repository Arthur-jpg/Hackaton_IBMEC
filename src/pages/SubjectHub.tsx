// src/pages/SubjectHub.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/Sidebar'; //
import SubjectHome from '@/components/SubjectHome'; //
import Chat from '@/components/Chat'; //
import StudyTools from '@/components/StudyTools'; //
import TestArea from '@/components/TestArea'; // Add this import

const SubjectHub = () => {
  const { subjectId } = useParams();
  const [currentPage, setCurrentPage] = useState('home'); // Default to home

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <SubjectHome subjectId={subjectId} />;
      case 'chat':
        return <Chat subjectId={subjectId} />;
      case 'study-tools':
        return <StudyTools subjectId={subjectId} />;
      case 'tests': // Add this case
        return <TestArea subjectId={subjectId} />;
      default:
        return <SubjectHome subjectId={subjectId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 transition-all duration-300 overflow-y-auto"> {/* Added overflow-y-auto */}
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default SubjectHub;