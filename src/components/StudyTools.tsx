// src/components/StudyTools.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Timer, BookOpen, Sparkles } from 'lucide-react';
import { usePomodoro } from '../App';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Flashcard {
  id?: number;
  front: string;
  back: string;
}

const staticFlashcardData: Record<string, Flashcard[]> = {
  electronics: [
    { id: 1, front: "O que é a Lei de Ohm?", back: "V = I × R (Tensão = Corrente × Resistência)" }, // Translated
    { id: 2, front: "O que é a Lei de Kirchhoff para Correntes?", back: "A soma das correntes que entram em um nó é igual à soma das correntes que saem do nó" }, // Translated
    { id: 3, front: "O que é um diodo?", back: "Um dispositivo semicondutor que permite que a corrente flua em apenas uma direção" }, // Translated
  ],
  'software-development': [
    { id: 1, front: "O que é uma variável?", back: "Um local de armazenamento com um nome associado que contém dados" }, // Translated
    { id: 2, front: "O que é herança?", back: "Um mecanismo onde uma classe herda propriedades e métodos de outra classe" }, // Translated
    { id: 3, front: "O que é um algoritmo?", back: "Um procedimento passo a passo para resolver um problema ou completar uma tarefa" }, // Translated
  ],
  calculus: [
    { id: 1, front: "O que é um limite?", back: "O valor ao qual uma função se aproxima à medida que a entrada se aproxima de um valor particular" }, // Translated
    { id: 2, front: "O que é uma derivada?", back: "A taxa de variação de uma função em relação à sua variável" }, // Translated
    { id: 3, front: "O que é uma integral?", back: "O inverso da diferenciação; representa a área sob uma curva" }, // Translated
  ],
  'engineering-data': [
    { id: 1, front: "O que é a média?", back: "A média de um conjunto de números" }, // Translated
    { id: 2, front: "O que é desvio padrão?", back: "Uma medida da dispersão dos pontos de dados em relação à média" }, // Translated
    { id: 3, front: "O que é teste de hipóteses?", back: "Um método estatístico para testar suposições sobre um parâmetro populacional" }, // Translated
  ]
};

const N8N_FLASHCARDS_WEBHOOK_URL = 'https://n8n.arthurschiller.com.br/webhook-test/generate-flashcards'; // No translation needed

interface StudyToolsProps {
  subjectId: string | undefined;
}

const StudyTools = ({ subjectId }: StudyToolsProps) => {
  const {
    pomodoroTime,
    isPomodoroRunning,
    isPomodoroBreak,
    togglePomodoro,
    resetPomodoro,
    formatTime
  } = usePomodoro();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'pomodoro'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dynamicFlashcards, setDynamicFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [flashcardsError, setFlashcardsError] = useState<string | null>(null);
  const [flashcardTopicInput, setFlashcardTopicInput] = useState<string>(subjectId || '');
  const [numFlashcardsInput, setNumFlashcardsInput] = useState<number>(5);

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

  const handleGenerateFlashcards = async () => {
    if (!flashcardTopicInput.trim()) {
      toast.error('Por favor, digite um tópico para gerar os flashcards.'); // Already PT
      console.warn('Geração de flashcards abortada: Tópico vazio.'); // Already PT
      return;
    }

    setFlashcardsLoading(true);
    setFlashcardsError(null);
    setDynamicFlashcards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 25000);

    try {
      console.log('Iniciando requisição para n8n...'); // Already PT
      const startTime = Date.now();

      const response = await fetch('https://n8n.arthurschiller.com.br/webhook/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          topic: flashcardTopicInput,
          numFlashcards: numFlashcardsInput,
        }),
        signal: controller.signal,
      });

      clearTimeout(id);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log(`Requisição para n8n finalizada em ${duration.toFixed(2)} segundos.`); // Already PT
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro HTTP ${response.status}:`, errorText);
        throw new Error(`Erro HTTP ${response.status}: ${errorText.substring(0, 100)}...`);
      }

      const data = await response.json();
      console.log('Resposta bruta (JSON) do n8n:', data); // Already PT

      const extractFlashcards = (responseData: any): Flashcard[] => {
        let parsedFlashcards;
        if (Array.isArray(responseData) && responseData.length > 0 && typeof responseData[0] === 'object' && responseData[0].front && responseData[0].back) {
          parsedFlashcards = responseData;
        } else if (Array.isArray(responseData) && responseData.length > 0 && responseData[0] && typeof responseData[0].output === 'string') {
          parsedFlashcards = JSON.parse(responseData[0].output);
        } else if (responseData && responseData.functionality === 'returnFlashcards' && typeof responseData.flashcards === 'string') {
          const flashcardsObj = JSON.parse(responseData.flashcards);
          if (flashcardsObj && typeof flashcardsObj.output === 'string') {
            parsedFlashcards = JSON.parse(flashcardsObj.output);
          }
        }
        if (!parsedFlashcards || !Array.isArray(parsedFlashcards)) {
          throw new Error("O conteúdo não é um array JSON de flashcards válido."); // Already PT
        }
        return parsedFlashcards;
      };

      try {
        const parsedFlashcards = extractFlashcards(data);
        const generatedCards: Flashcard[] = parsedFlashcards.map((card: any, index: number) => ({
          id: index + 1,
          front: card.front,
          back: card.back,
        }));
        setDynamicFlashcards(generatedCards);
        toast.success('Flashcards gerados com sucesso pela IA!'); // Already PT
        console.log('Flashcards processados:', generatedCards); // Already PT
      } catch (parseError: any) {
        console.error('Erro de parsing JSON nos dados recebidos:', parseError); // Corrected "parqusing", "Erro de parsing..."
        setFlashcardsError(`Erro ao analisar os flashcards da IA: ${parseError.message}. Verifique o formato JSON retornado pelo n8n.`); // Already PT
        toast.error('Erro ao processar flashcards: Formato inválido da IA.'); // Already PT
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Requisição para n8n abortada por timeout (25s):', error); // Updated timeout
        setFlashcardsError('Tempo limite excedido para gerar os flashcards. O servidor do Estuda.ia pode estar demorando a responder. Por favor, tente novamente ou com um tópico mais simples.'); // Already PT
        toast.error('Geração de flashcards: Tempo limite excedido!'); // Already PT
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Erro de rede (Failed to fetch) ao chamar n8n:', error);
        setFlashcardsError('Erro de conexão com o servidor do Estuda.ia. Verifique sua conexão com a internet ou a URL do webhook.'); // Already PT
        toast.error('Erro de rede ao gerar flashcards!'); // Already PT
      } else {
        console.error('Erro desconhecido na requisição para n8n:', error);
        setFlashcardsError(`Ocorreu um erro: ${error.message}. Verifique a URL do webhook ou a configuração do n8n.`); // Already PT
        toast.error('Erro geral ao gerar flashcards: ' + error.message); // Dynamic error message, "Erro geral..." part is PT
      }
    } finally {
      setFlashcardsLoading(false);
      console.log('Requisição finalizada.'); // Already PT
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Ferramentas de Estudo {/* Translated */}
        </h1>
        <p className="text-gray-600 text-lg">Escolha seu método de estudo preferido para aprimorar sua experiência de aprendizado</p> {/* Translated */}
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'flashcards' ? 'default' : 'outline'}
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 ${ activeTab === 'flashcards' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'hover:bg-purple-50' }`}
        >
          <BookOpen className="h-4 w-4" />
          Flashcards
        </Button>
        <Button
          variant={activeTab === 'pomodoro' ? 'default' : 'outline'}
          onClick={() => setActiveTab('pomodoro')}
          className={`flex items-center gap-2 ${ activeTab === 'pomodoro' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'hover:bg-purple-50' }`}
        >
          <Timer className="h-4 w-4" />
          Cronômetro Pomodoro {/* Translated */}
        </Button>
      </div>

      {activeTab === 'flashcards' && (
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Cartão {flashcardsToDisplay.length > 0 ? currentCardIndex + 1 : 0} de {flashcardsToDisplay.length || 0} {/* Translated "Card", "of" */}
              </Badge>
              <CardTitle className="text-2xl text-gray-800">Flashcards</CardTitle>
              <div className="w-24" />
            </div>

            <div className="flex flex-col gap-4 p-4 border-t border-gray-200 mt-4">
              <Label htmlFor="flashcard-topic">Tópico para Flashcards (Ex: "Leis de Newton", "Custo de Oportunidade")</Label> {/* Already PT */}
              <Input
                id="flashcard-topic"
                placeholder="Digite o tópico desejado" // Already PT
                value={flashcardTopicInput}
                onChange={(e) => setFlashcardTopicInput(e.target.value)}
                className="w-full"
              />
              <Label htmlFor="num-flashcards">Número de Flashcards (opcional, padrão 5)</Label> {/* Already PT */}
              <Input
                id="num-flashcards"
                type="number"
                min="1"
                max="20"
                placeholder="Ex: 5" // Already PT
                value={numFlashcardsInput}
                onChange={(e) => setNumFlashcardsInput(parseInt(e.target.value) || 0)}
                className="w-full"
              />
              <Button
                onClick={handleGenerateFlashcards}
                disabled={flashcardsLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white"
              >
                {flashcardsLoading ? 'Gerando...' : 'Gerar Flashcards com IA'} {/* Already PT */}
                <Sparkles className="h-4 w-4" />
              </Button>
              {flashcardsError && (
                <p className="text-red-500 text-sm mt-2">{flashcardsError}</p> // Error messages are mostly PT already
              )}
              {flashcardsLoading && (
                <p className="text-gray-500 text-sm mt-2">Buscando e processando informações... isso pode levar alguns segundos.</p> // Already PT
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
                      {showAnswer ? "Resposta:" : "Questão:"} {/* Translated "Answer", "Questão" is PT */}
                    </p>
                    <p className="text-xl text-gray-700">
                      {showAnswer ? flashcardsToDisplay[currentCardIndex].back : flashcardsToDisplay[currentCardIndex].front}
                    </p>
                    {!showAnswer && (
                      <p className="text-sm text-gray-500 mt-4">Clique para revelar a resposta</p> 
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={prevCard} className="flex items-center gap-2 hover:bg-purple-50" >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior {/* Translated */}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)} className="bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-gray-700" >
                    {showAnswer ? 'Mostrar Questão' : 'Mostrar Resposta'} {/* Translated */}
                  </Button>
                  <Button variant="outline" onClick={nextCard} className="flex items-center gap-2 hover:bg-purple-50" >
                    Próximo {/* Translated */}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="min-h-64 flex items-center justify-center text-gray-500">
                {flashcardsLoading ? (
                  <p>Carregando flashcards...</p> // Already PT
                ) : (
                  <p>Nenhum flashcard disponível. Digite um tópico acima e clique em "Gerar Flashcards com IA" para começar!</p> // Already PT
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'pomodoro' && (
        <Card className="bg-white/70 backdrop-blur-sm shadow-xl border-0 animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Cronômetro Pomodoro</CardTitle> {/* Translated */}
            <p className="text-gray-600">
              {isPomodoroBreak ? 'Pausa - Descanse um pouco!' : 'Foco Total - Mantenha a concentração!'} {/* Translated */}
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-full w-64 h-64 mx-auto flex items-center justify-center mb-6 shadow-lg">
                <div className="text-6xl font-bold text-gray-800">
                  {formatTime(pomodoroTime)}
                </div>
              </div>
              <Badge variant="secondary" className={`text-lg px-6 py-2 ${ isPomodoroBreak ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800' }`} >
                {isPomodoroBreak ? 'Sessão de Pausa' : 'Sessão de Trabalho'} {/* Translated */}
              </Badge>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={togglePomodoro} className={`flex items-center gap-2 px-8 py-3 text-lg text-white ${ isPomodoroRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' }`} >
                {isPomodoroRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPomodoroRunning ? 'Pausar' : 'Iniciar'} {/* Translated */}
              </Button>
              <Button variant="outline" onClick={resetPomodoro} className="flex items-center gap-2 px-8 py-3 text-lg hover:bg-gray-50" >
                <RotateCcw className="h-5 w-5" />
                Reiniciar {/* Translated */}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyTools;