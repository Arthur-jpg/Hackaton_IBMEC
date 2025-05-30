// src/components/EventCalendar.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar'; //
import { Button } from '@/components/ui/button'; //
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'; //
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'; //
import { Input } from '@/components/ui/input'; //
import { Textarea } from '@/components/ui/textarea'; //
import { Label } from '@/components/ui/label'; //
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; //
import { useToast } from '@/hooks/use-toast'; //
import { PlusCircle, Trash2, Edit3, CalendarDays, X } from 'lucide-react';
import { format, parseISO, isValid, startOfDay } from 'date-fns'; // For date manipulation

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  type?: 'Exam' | 'Assignment' | 'Study Session' | 'Other';
}

const LOCAL_STORAGE_EVENTS_KEY = 'studyHubCalendarEvents';

const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | null>(null); // For add/edit
  const { toast } = useToast();

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch (e) {
        console.error("Failed to parse events from localStorage", e);
        setEvents([]);
      }
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const openEventDialog = (eventToEdit?: CalendarEvent) => {
    if (eventToEdit) {
      setCurrentEvent(eventToEdit);
    } else if (selectedDate) {
      setCurrentEvent({ date: format(selectedDate, 'yyyy-MM-dd'), title: '', type: 'Other' });
    } else {
        // If no date selected, default to today for new event
        setCurrentEvent({ date: format(new Date(), 'yyyy-MM-dd'), title: '', type: 'Other' });
    }
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!currentEvent || !currentEvent.title || !currentEvent.date) {
      toast({ title: "Missing Information", description: "Please provide a title and date for the event.", variant: "destructive" });
      return;
    }
    
    const targetDate = parseISO(currentEvent.date);
    if (!isValid(targetDate)) {
        toast({ title: "Invalid Date", description: "The event date is not valid.", variant: "destructive" });
        return;
    }
    // Ensure date is stored consistently (start of day in UTC might be safer, but YYYY-MM-DD string is fine for this)
    const eventToSave: CalendarEvent = {
        id: currentEvent.id || Date.now().toString(),
        title: currentEvent.title,
        date: currentEvent.date, // Already in YYYY-MM-DD from form
        description: currentEvent.description,
        type: currentEvent.type || 'Other',
    };

    setEvents(prevEvents => {
      const existingEventIndex = prevEvents.findIndex(e => e.id === eventToSave.id);
      if (existingEventIndex > -1) {
        const updatedEvents = [...prevEvents];
        updatedEvents[existingEventIndex] = eventToSave;
        return updatedEvents;
      }
      return [...prevEvents, eventToSave];
    });

    toast({ title: "Event Saved!", description: `"${eventToSave.title}" has been saved.` });
    setIsEventDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    toast({ title: "Event Deleted!", variant: "destructive" });
  };

  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return events.filter(event => event.date === formattedSelectedDate).sort((a,b) => a.title.localeCompare(b.title));
  }, [events, selectedDate]);

  const datesWithEvents = useMemo(() => {
    return events.map(event => startOfDay(parseISO(event.date))); // Ensure we compare dates correctly
  }, [events]);

  const eventDayModifier = { hasEvent: datesWithEvents };
  const eventDayModifierStyles = {
    hasEvent: {
      position: 'relative' as React.CSSProperties['position'],
       '&::after': { 
        content: '""',
        display: 'block',
        position: 'absolute' as React.CSSProperties['position'],
        left: '50%',
        bottom: '4px',
        transform: 'translateX(-50%)',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: 'hsl(var(--primary))',
      }
    }
  };
   const calendarModifiersStyles = {
    hasEvent: {
      fontWeight: "bold",
      color: "hsl(var(--primary))" 
    }
  };


  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <CalendarDays className="mr-3 h-7 w-7 text-purple-600"/>
                Event Calendar
            </CardTitle>
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => openEventDialog()} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                    <DialogTitle>{currentEvent?.id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-title" className="text-right">Title</Label>
                        <Input 
                            id="event-title" 
                            value={currentEvent?.title || ''} 
                            onChange={(e) => setCurrentEvent(prev => ({...prev, title: e.target.value}))}
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-date" className="text-right">Date</Label>
                        <Input 
                            id="event-date" 
                            type="date" 
                            value={currentEvent?.date || ''} 
                            onChange={(e) => setCurrentEvent(prev => ({...prev, date: e.target.value}))}
                            className="col-span-3" 
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-type" className="text-right">Type</Label>
                        <Select 
                            value={currentEvent?.type || 'Other'}
                            onValueChange={(value) => setCurrentEvent(prev => ({...prev, type: value as CalendarEvent['type']}))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Exam">Exam</SelectItem>
                                <SelectItem value="Assignment">Assignment Due</SelectItem>
                                <SelectItem value="Study Session">Study Session</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-description" className="text-right">Description</Label>
                        <Textarea 
                            id="event-description" 
                            value={currentEvent?.description || ''}
                            onChange={(e) => setCurrentEvent(prev => ({...prev, description: e.target.value}))}
                            className="col-span-3 min-h-[80px]" 
                            placeholder="(Optional)"
                        />
                    </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSaveEvent}>Save Event</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-auto md:min-w-[280px] flex justify-center">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border p-3 bg-white/50"
                modifiers={eventDayModifier} // For marking days
                modifiersStyles={calendarModifiersStyles} // For styling marked days
            />
        </div>
        <div className="flex-1 w-full mt-6 md:mt-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            Events for: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected'}
          </h3>
          {eventsOnSelectedDate.length > 0 ? (
            <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {eventsOnSelectedDate.map(event => (
                <li key={event.id} className="p-3 bg-gray-100/70 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                            event.type === 'Exam' ? 'bg-red-500' :
                            event.type === 'Assignment' ? 'bg-blue-500' :
                            event.type === 'Study Session' ? 'bg-green-500' : 'bg-gray-500'
                        }`}>
                            {event.type}
                        </span>
                        <h4 className="font-medium text-gray-800 mt-1">{event.title}</h4>
                        {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEventDialog(event)}>
                            <Edit3 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No events for this date.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;