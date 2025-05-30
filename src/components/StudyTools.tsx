import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Timer, BookOpen, Sparkles } from 'lucide-react';
import { usePomodoro } from '../App'; // Assuming App.tsx is in the same directory or adjust path
import { Input } from '@/components/ui/input'; // Importar o componente Input
import { Label } from '@/components/ui/label'; // Importar o componente Label
import { toast } from 'sonner'; // Adicionado para notificações (se estiver usando shadcn/ui com sonner)

// Definindo a interface para os flashcards, que o n8n retornará
interface Flashcard {
  id?: number; // O ID pode ser gerado no frontend se não vier do backend
  front: string;
  back: string;
}

// Dados de flashcards estáticos (mantidos para fallback/exemplo)
const staticFlashcardData: Record<string, Flashcard[]> = {
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

// URL do seu webhook do n8n para geração de flashcards
// **MUITO IMPORTANTE:** Substitua esta URL pela URL REAL do seu webhook do n8n.
const N8N_FLASHCARDS_WEBHOOK_URL = 'https://n8n.arthurschiller.com.br/webhook-test/generate-flashcards';

interface StudyToolsProps {
  subjectId: string | undefined; // Para dados de flashcard estáticos ou como sugestão de tópico
}

const StudyTools = ({ subjectId }: StudyToolsProps) => {
  // Consumir contexto Pomodoro
  const {
    pomodoroTime,
    isPomodoroRunning,
    isPomodoroBreak,
    togglePomodoro,
    resetPomodoro,
    formatTime
  } = usePomodoro();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'pomodoro'>('flashcards');

  // Estados para flashcards
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Novo estado para flashcards gerados dinamicamente
  const [dynamicFlashcards, setDynamicFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [flashcardsError, setFlashcardsError] = useState<string | null>(null);
  const [flashcardTopicInput, setFlashcardTopicInput] = useState<string>(subjectId || '');
  const [numFlashcardsInput, setNumFlashcardsInput] = useState<number>(5);


  // Determina qual conjunto de flashcards usar: dinâmico (se existir) ou estático
  const flashcardsToDisplay = dynamicFlashcards.length > 0 
    ? dynamicFlashcards 
    : (staticFlashcardData[subjectId || 'electronics'] || staticFlashcardData.electronics);

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcardsToDisplay.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcardsToDisplay.length) % flashcardsToDisplay.length);
    setShowAnswer(false);
  };

  // Função para chamar o webhook do n8n para gerar flashcards
  const handleGenerateFlashcards = async () => {
    if (!flashcardTopicInput.trim()) {
      toast.error('Por favor, digite um tópico para gerar os flashcards.');
      console.warn('Geração de flashcards abortada: Tópico vazio.');
      return;
    }

    setFlashcardsLoading(true);
    setFlashcardsError(null);
    setDynamicFlashcards([]); // Limpa flashcards anteriores
    setCurrentCardIndex(0);
    setShowAnswer(false);

    // Adicionando um AbortController para timeout explícito no frontend
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 25000); // Define um timeout de 15 segundos

    try {
      console.log('Iniciando requisição para n8n...');
      const startTime = Date.now(); // Marca o tempo de início

      const response = await fetch('https://n8n.arthurschiller.com.br/webhook/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: flashcardTopicInput,
          numFlashcards: numFlashcardsInput,
          // Opcional: Adicionar um sessionId aqui se estiver usando no n8n para memória
          // sessionId: 'seu_id_de_sessao_aqui', 
        }),
        signal: controller.signal, // Associa o AbortController à requisição
      });

      clearTimeout(id); // Limpa o timeout se a resposta chegar antes

      const endTime = Date.now(); // Marca o tempo de fim
      const duration = (endTime - startTime) / 1000; // Duração em segundos
      console.log(`Requisição para n8n finalizada em ${duration.toFixed(2)} segundos.`);      if (!response.ok) {
        const errorText = await response.text(); // Tenta ler a resposta como texto para depuração
        console.error(`Erro HTTP ${response.status}:`, errorText);
        throw new Error(`Erro HTTP ${response.status}: ${errorText.substring(0, 100)}...`); // Limita o texto para o erro
      }
      
      const data = await response.json();
      console.log('Resposta bruta (JSON) do n8n:', data); // Log para depuração do JSON completo      // Função auxiliar para extrair flashcards de diferentes formatos de resposta
      const extractFlashcards = (responseData: any): Flashcard[] => {
        let parsedFlashcards;
        
        // Formato Novo: Array direto de objetos flashcard
        if (Array.isArray(responseData) && responseData.length > 0 && 
            typeof responseData[0] === 'object' && responseData[0].front && responseData[0].back) {
          parsedFlashcards = responseData;
        } 
        // Formato 1: Array com item que tem propriedade 'output' (formato antigo)
        else if (Array.isArray(responseData) && responseData.length > 0 && responseData[0] && typeof responseData[0].output === 'string') {
          parsedFlashcards = JSON.parse(responseData[0].output);
        } 
        // Formato 2: Objeto com propriedade 'functionality' e 'flashcards' (formato intermediário)
        else if (responseData && responseData.functionality === 'returnFlashcards' && typeof responseData.flashcards === 'string') {
          // Primeiro parseamos a string JSON dentro da propriedade flashcards
          const flashcardsObj = JSON.parse(responseData.flashcards);
          
          // Depois parseamos a string JSON dentro da propriedade output
          if (flashcardsObj && typeof flashcardsObj.output === 'string') {
            parsedFlashcards = JSON.parse(flashcardsObj.output);
          }
        }
        
        if (!parsedFlashcards || !Array.isArray(parsedFlashcards)) {
          throw new Error("O conteúdo não é um array JSON de flashcards válido.");
        }
        
        return parsedFlashcards;
      };

      try {
        // Tenta extrair os flashcards do formato de resposta
        const parsedFlashcards = extractFlashcards(data);
        
        const generatedCards: Flashcard[] = parsedFlashcards.map((card: any, index: number) => ({
          id: index + 1, // Gerar um ID local, ou usar um ID vindo do backend se for o caso
          front: card.front,
          back: card.back,
        }));

        setDynamicFlashcards(generatedCards);
        toast.success('Flashcards gerados com sucesso pela IA!');
        console.log('Flashcards processados:', generatedCards);
      } catch (parseError: any) {
        console.error('Erro de parqusing JSON nos dados recebidos:', parseError);
        setFlashcardsError(`Erro ao analisar os flashcards da IA: ${parseError.message}. Verifique o formato JSON retornado pelo n8n.`);
        toast.error('Erro ao processar flashcards: Formato inválido da IA.');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Requisição para n8n abortada por timeout (15s):', error);
        setFlashcardsError('Tempo limite excedido para gerar os flashcards. O servidor do Estuda.ia pode estar demorando a responder. Por favor, tente novamente ou com um tópico mais simples.');
        toast.error('Geração de flashcards: Tempo limite excedido!');
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Erro de rede (Failed to fetch) ao chamar n8n:', error);
        setFlashcardsError('Erro de conexão com o servidor do Estuda.ia. Verifique sua conexão com a internet ou a URL do webhook.');
        toast.error('Erro de rede ao gerar flashcards!');
      } else {
        console.error('Erro desconhecido na requisição para n8n:', error);
        setFlashcardsError(`Ocorreu um erro: ${error.message}. Verifique a URL do webhook ou a configuração do n8n.`);
        toast.error('Erro geral ao gerar flashcards: ' + error.message);
      }
    } finally {
      setFlashcardsLoading(false);
      console.log('Requisição finalizada.');
    }
  };

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
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Card {currentCardIndex + 1} of {flashcardsToDisplay.length || 0}
              </Badge>
              <CardTitle className="text-2xl text-gray-800">Flashcards</CardTitle>
              <div className="w-24" /> {/* Adjusted Spacer for centering */}
            </div>
            
            {/* Seção para Geração de Flashcards */}
            <div className="flex flex-col gap-4 p-4 border-t border-gray-200 mt-4">
                <Label htmlFor="flashcard-topic">Tópico para Flashcards (Ex: "Leis de Newton", "Custo de Oportunidade")</Label>
                <Input
                    id="flashcard-topic"
                    placeholder="Digite o tópico desejado"
                    value={flashcardTopicInput}
                    onChange={(e) => setFlashcardTopicInput(e.target.value)}
                    className="w-full"
                />
                <Label htmlFor="num-flashcards">Número de Flashcards (opcional, padrão 5)</Label>
                <Input
                    id="num-flashcards"
                    type="number"
                    min="1"
                    max="20" // Limite razoável para o hackathon
                    placeholder="Ex: 5"
                    value={numFlashcardsInput}
                    onChange={(e) => setNumFlashcardsInput(parseInt(e.target.value) || 0)} // Parse para int, ou 0 se vazio/inválido
                    className="w-full"
                />
                <Button
                    onClick={handleGenerateFlashcards}
                    disabled={flashcardsLoading}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
                >
                    {flashcardsLoading ? 'Gerando...' : 'Gerar Flashcards com IA'}
                    <Sparkles className="h-4 w-4" />
                </Button>
                {flashcardsError && (
                    <p className="text-red-500 text-sm mt-2">{flashcardsError}</p>
                )}
                {flashcardsLoading && (
                     <p className="text-gray-500 text-sm mt-2">Buscando e processando informações... isso pode levar alguns segundos.</p>
                )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {flashcardsToDisplay.length > 0 ? (
              <>
                <div 
                  className="min-h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 mb-6 flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800 mb-4">
                      {showAnswer ? "Answer:" : "Questão:"}
                    </p>
                    <p className="text-xl text-gray-700">
                      {showAnswer ? flashcardsToDisplay[currentCardIndex].back : flashcardsToDisplay[currentCardIndex].front}
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
              </>
            ) : (
                <div className="min-h-64 flex items-center justify-center text-gray-500">
                    {flashcardsLoading ? (
                        <p>Carregando flashcards...</p>
                    ) : (
                        <p>Nenhum flashcard disponível. Digite um tópico acima e clique em "Gerar Flashcards com IA" para começar!</p>
                    )}
                </div>
            )}
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