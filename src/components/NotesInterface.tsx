import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, FilePenLine, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

interface NotesInterfaceProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const LOCAL_STORAGE_KEY = 'studyHubNotes_v2'; // Changed key in case of structure changes

const NotesInterface: React.FC<NotesInterfaceProps> = ({ isOpen, onOpenChange }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const getNoteTitle = useCallback((content: string): string => {
    const firstLine = content.split('\n')[0].trim();
    return firstLine.substring(0, 40) || 'New Note'
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log("NotesInterface: Dialog opened, loading notes.");
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        try {
          const parsedNotes: Note[] = JSON.parse(storedNotes);
          setNotes(parsedNotes.sort((a,b) => b.lastModified - a.lastModified));
          if (parsedNotes.length > 0 && !selectedNoteId) {
          } else if (selectedNoteId) {
            const selected = parsedNotes.find(n => n.id === selectedNoteId);
            setCurrentContent(selected ? selected.content : '');
          }
        } catch (e) {
          console.error("Failed to parse notes from localStorage", e);
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    }
  
  }, [isOpen]); 
  useEffect(() => {
     if (isOpen) { 
        console.log("NotesInterface: notes state changed, saving to localStorage.", notes);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
     }
  }, [notes, isOpen]);

  // Update currentContent when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId) {
      const selected = notes.find(n => n.id === selectedNoteId);
      setCurrentContent(selected ? selected.content : '');
      console.log("NotesInterface: Selected note changed to:", selectedNoteId);
    } else {
      setCurrentContent('');
    }
  }, [selectedNoteId, notes]);


  const updateNoteInState = useCallback((noteId: string, newContent: string) => {
    setNotes(prevNotes => {
      const noteToUpdate = prevNotes.find(n => n.id === noteId);
      const newTitle = getNoteTitle(newContent);

      if (noteToUpdate && noteToUpdate.content === newContent && noteToUpdate.title === newTitle) {
        return prevNotes;
      }
      
      console.log("NotesInterface: Updating note in state:", noteId);
      return prevNotes
        .map(n =>
          n.id === noteId
            ? { ...n, content: newContent, title: newTitle, lastModified: Date.now() }
            : n
        )
        .sort((a, b) => b.lastModified - a.lastModified);
    });
  }, [getNoteTitle]);

  // Debounced auto-save for textarea content changes
  useEffect(() => {
    if (!selectedNoteId || !isOpen) return;

    const handler = setTimeout(() => {
      console.log("NotesInterface: Debounced save triggered for note:", selectedNoteId);
      updateNoteInState(selectedNoteId, currentContent);
    }, 1500); // Auto-save after 1.5 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [currentContent, selectedNoteId, isOpen, updateNoteInState]);


  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastModified: Date.now(),
    };
    setNotes(prevNotes => [newNote, ...prevNotes].sort((a,b)=>b.lastModified - a.lastModified));
    setSelectedNoteId(newNote.id);
    setCurrentContent(''); // Editor is now blank for the new note
    toast({ title: 'New Note Created! 🗒️' });
    console.log("NotesInterface: New note created:", newNote.id);
  };

  const handleSelectNote = (noteId: string) => {
    if (selectedNoteId && selectedNoteId !== noteId) {
      const currentNoteFromState = notes.find(n => n.id === selectedNoteId);
      if (currentNoteFromState && currentNoteFromState.content !== currentContent) {
        console.log("NotesInterface: Saving note before switch:", selectedNoteId);
        updateNoteInState(selectedNoteId, currentContent); 
      }
    }
    setSelectedNoteId(noteId);
  };

  const handleDeleteNote = () => {
    if (!selectedNoteId) return;
    console.log("NotesInterface: Deleting note:", selectedNoteId);
    setNotes(prevNotes => prevNotes.filter(n => n.id !== selectedNoteId));
    const remainingNotes = notes.filter(n => n.id !== selectedNoteId);
    if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes.sort((a,b) => b.lastModified - a.lastModified)[0].id);
    } else {
        setSelectedNoteId(null);
    }
    setCurrentContent(''); // Clear editor
    toast({ title: 'Note Deleted! 🗑️', variant: 'destructive' });
  };

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [notes, searchTerm]);

  const handleDialogStateChange = (openState: boolean) => {
    if (!openState && selectedNoteId) {
      console.log("NotesInterface: Dialog closing, saving current note:", selectedNoteId);
      const currentNoteFromState = notes.find(n => n.id === selectedNoteId);
       if (currentNoteFromState && currentNoteFromState.content !== currentContent) {
         updateNoteInState(selectedNoteId, currentContent);
       }
    }
    onOpenChange(openState); 
  };

  const selectedNoteDetails = selectedNoteId ? notes.find(n => n.id === selectedNoteId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0 bg-gray-50 dark:bg-neutral-900 backdrop-blur-md border-gray-200 dark:border-neutral-800 shadow-2xl rounded-lg">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleNewNote} aria-label="New Note">
                    <PlusCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
                {selectedNoteId && (
                    <Button variant="ghost" size="icon" onClick={handleDeleteNote} aria-label="Delete Note">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                {selectedNoteDetails ? `Editing: ${selectedNoteDetails.title}` : 'All Notes'}
            </span>
            <Button variant="ghost" size="icon" onClick={() => handleDialogStateChange(false)} aria-label="Close Notes">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-2/5 md:w-1/3 min-w-[220px] max-w-[320px] bg-gray-100/90 dark:bg-neutral-800/90 border-r border-gray-200 dark:border-neutral-700 flex flex-col">
            <div className="p-2.5 border-b border-gray-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm h-9 bg-white dark:bg-neutral-700 border-gray-300 dark:border-neutral-600 rounded-md"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700/60 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 outline-none",
                        selectedNoteId === note.id ? "bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-200" : "text-gray-800 dark:text-gray-100"
                      )}
                    >
                      <div className="font-semibold text-sm truncate">{note.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 h-8 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                        {note.content || "Empty note"}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-500 mt-1.5">
                        {new Date(note.lastModified).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? "No notes match your search." : "No notes yet. Create one!"}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-850">
            {selectedNoteId && selectedNoteDetails ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-neutral-700 shrink-0">
                    <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">{selectedNoteDetails.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last Modified: {new Date(selectedNoteDetails.lastModified).toLocaleString()}
                    </div>
                </div>
                <Textarea
                  key={selectedNoteId} // Force re-render of textarea on note switch to clear undo/redo stack
                  placeholder="Start writing your note..."
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="flex-1 w-full h-full p-5 text-base border-0 rounded-none resize-none focus:ring-0 focus-visible:ring-0 bg-transparent dark:text-gray-50 selection:bg-purple-200 dark:selection:bg-purple-500/50"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6 text-center">
                <FilePenLine size={52} className="mb-5 opacity-40" />
                <p className="text-xl font-medium mb-1">Select a note to view or edit</p>
                <p className="text-sm mb-5">Or, create a new one to get started!</p>
                <Button onClick={handleNewNote} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Note
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesInterface;