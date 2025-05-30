import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit3, CalendarDays, X } from 'lucide-react';
import { format, parseISO, isValid, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Import pt-BR locale for date formatting

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  type?: 'Exam' | 'Assignment' | 'Study Session' | 'Other'; // Types can be translated if they appear directly in UI, or map to translated values
}

const LOCAL_STORAGE_EVENTS_KEY = 'studyHubCalendarEvents';

// Helper for event type translation if needed (can be expanded)
const eventTypeTranslations: Record<NonNullable<CalendarEvent['type']>, string> = {
    'Exam': 'Prova',
    'Assignment': 'Entrega de Trabalho',
    'Study Session': 'Sessão de Estudo',
    'Other': 'Outro'
};


const EventCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<CalendarEvent> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents));
      } catch (e) {
        console.error("Falha ao analisar eventos do localStorage", e); // Translated
        setEvents([]);
      }
    }
  }, []);

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
      setCurrentEvent({ date: format(new Date(), 'yyyy-MM-dd'), title: '', type: 'Other' });
    }
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!currentEvent || !currentEvent.title || !currentEvent.date) {
      toast({ title: "Informações Faltando", description: "Por favor, forneça um título e data para o evento.", variant: "destructive" }); // Translated
      return;
    }

    const targetDate = parseISO(currentEvent.date);
    if (!isValid(targetDate)) {
        toast({ title: "Data Inválida", description: "A data do evento não é válida.", variant: "destructive" }); // Translated
        return;
    }
    const eventToSave: CalendarEvent = {
        id: currentEvent.id || Date.now().toString(),
        title: currentEvent.title,
        date: currentEvent.date,
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

    toast({ title: "Evento Salvo!", description: `"${eventToSave.title}" foi salvo.` }); // Translated
    setIsEventDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    toast({ title: "Evento Excluído!", variant: "destructive" }); // Translated
  };

  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return events.filter(event => event.date === formattedSelectedDate).sort((a,b) => a.title.localeCompare(b.title));
  }, [events, selectedDate]);

  const datesWithEvents = useMemo(() => {
    return events.map(event => startOfDay(parseISO(event.date)));
  }, [events]);

  const eventDayModifier = { hasEvent: datesWithEvents };
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
                Calendário de Eventos {/* Translated */}
            </CardTitle>
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => openEventDialog()} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Evento {/* Translated */}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                    <DialogTitle>{currentEvent?.id ? 'Editar Evento' : 'Adicionar Novo Evento'}</DialogTitle> {/* Translated */}
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-title" className="text-right">Título</Label> {/* Translated */}
                        <Input
                            id="event-title"
                            value={currentEvent?.title || ''}
                            onChange={(e) => setCurrentEvent(prev => ({...prev, title: e.target.value}))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-date" className="text-right">Data</Label> {/* Translated */}
                        <Input
                            id="event-date"
                            type="date"
                            value={currentEvent?.date || ''}
                            onChange={(e) => setCurrentEvent(prev => ({...prev, date: e.target.value}))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-type" className="text-right">Tipo</Label> {/* Translated */}
                        <Select
                            value={currentEvent?.type || 'Other'}
                            onValueChange={(value) => setCurrentEvent(prev => ({...prev, type: value as CalendarEvent['type']}))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o tipo de evento" /> {/* Translated */}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Exam">{eventTypeTranslations['Exam']}</SelectItem> {/* Translated */}
                                <SelectItem value="Assignment">{eventTypeTranslations['Assignment']}</SelectItem> {/* Translated */}
                                <SelectItem value="Study Session">{eventTypeTranslations['Study Session']}</SelectItem> {/* Translated */}
                                <SelectItem value="Other">{eventTypeTranslations['Other']}</SelectItem> {/* Translated */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="event-description" className="text-right">Descrição</Label> {/* Translated */}
                        <Textarea
                            id="event-description"
                            value={currentEvent?.description || ''}
                            onChange={(e) => setCurrentEvent(prev => ({...prev, description: e.target.value}))}
                            className="col-span-3 min-h-[80px]"
                            placeholder="(Opcional)" // Translated
                        />
                    </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button> {/* Translated */}
                        </DialogClose>
                        <Button onClick={handleSaveEvent}>Salvar Evento</Button> {/* Translated */}
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
                modifiers={eventDayModifier}
                modifiersStyles={calendarModifiersStyles}
                locale={ptBR} // Added locale for calendar month/day names
            />
        </div>
        <div className="flex-1 w-full mt-6 md:mt-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            Eventos para: {selectedDate ? format(selectedDate, 'd \'de\' MMMM \'de\' yyyy', { locale: ptBR }) : 'Nenhuma data selecionada'} {/* Translated "Events for", "No date selected", and used ptBR locale for date format */}
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
                            {eventTypeTranslations[event.type || 'Other']} {/* Display translated type */}
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
            <p className="text-gray-500 text-sm">Nenhum evento para esta data.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;