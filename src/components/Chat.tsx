import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { marked } from 'marked'; // You'll need to install this package

interface ChatProps {
  subjectId: string | undefined;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rawText?: string; // For storing original markdown
}

const subjectNames: Record<string, string> = {
  electronics: 'Electronics',
  'software-development': 'Software Development',
  calculus: 'Calculus I',
  'engineering-data': 'Engineering Data'
};

// General webhook endpoint
const WEBHOOK_URL = 'https://n8n.arthurschiller.com.br/webhook/e885d569-93ad-424d-ae33-402c7cbead80/chat';

const Chat = ({ subjectId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Tenta recuperar as mensagens do localStorage
    const savedMessages = localStorage.getItem(`chat_history_${subjectId}`);
    if (savedMessages) {
      try {
        // Converte as datas de string para objeto Date
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Erro ao carregar histórico de chat:", e);
      }
    }
    // Se não existir histórico ou ocorrer um erro, retorna a mensagem inicial
    return [
      {
        id: 1,
        text: `Hello! I'm your ${subjectNames[subjectId || 'electronics']} study assistant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
    
    // Salvar mensagens no localStorage sempre que houver alterações
    if (messages.length > 0) {
      localStorage.setItem(`chat_history_${subjectId}`, JSON.stringify(messages));
    }
  }, [messages, subjectId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Send request to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputValue,
          chatId: 'session-' + Date.now(),
          subject: subjectId || 'electronics'
        })
      });

      const data = await response.json();
      const botResponseText = data.output || "I'm sorry, I couldn't process your request.";
      
      // Parse markdown to HTML
      let formattedText;
      try {
        formattedText = marked(botResponseText);
      } catch (error) {
        console.error("Markdown parsing error:", error);
        formattedText = botResponseText;
      }

      const botResponse: Message = {
        id: messages.length + 2,
        text: formattedText,
        rawText: botResponseText, // Store original markdown
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("API error:", error);
      
      const errorResponse: Message = {
        id: messages.length + 2,
        text: "Sorry, I couldn't connect to the server. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {subjectNames[subjectId || 'electronics']} Assistant
        </h1>
        <p className="text-gray-600">Ask questions about {subjectNames[subjectId || 'electronics']} and get instant help!</p>
      </div>

      <Card className="flex-1 bg-white/70 backdrop-blur-sm shadow-lg border-0 flex flex-col">
        <CardContent className="flex-1 p-6 flex flex-col">
          <div ref={chatBodyRef} className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-fade-in ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <p className="text-sm">{message.text}</p>
                  ) : (
                    <div 
                      className="text-sm message-content" 
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                  <p className="text-sm">
                    <span className="typing-indicator">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
        {/* Optional: Add some CSS for the typing indicator */}
      <style>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #888;
          margin: 0 2px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Chat;