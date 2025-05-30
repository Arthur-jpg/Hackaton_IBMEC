
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

interface ChatProps {
  subjectId: string | undefined;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const subjectNames: Record<string, string> = {
  electronics: 'Electronics',
  'software-development': 'Software Development',
  calculus: 'Calculus I',
  'engineering-data': 'Engineering Data'
};

const Chat = ({ subjectId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your ${subjectNames[subjectId || 'electronics']} study assistant. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue, subjectId),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue('');
  };

  const getBotResponse = (userInput: string, subject: string | undefined): string => {
    const responses: Record<string, string[]> = {
      electronics: [
        "That's a great question about electronics! Let me help you understand this concept better.",
        "In electronics, this relates to fundamental circuit principles. Would you like me to explain further?",
        "This is an important topic in electronics. Let me break it down for you step by step."
      ],
      'software-development': [
        "Excellent programming question! Let me help you solve this coding challenge.",
        "This is a common software development concept. Here's how I'd approach it...",
        "Great question about programming! Let me explain this with some examples."
      ],
      calculus: [
        "This is a fundamental calculus concept! Let me walk you through the solution.",
        "Calculus can be tricky, but I'll help you understand this step by step.",
        "That's an interesting calculus problem. Let me show you the approach to solve it."
      ],
      'engineering-data': [
        "This relates to data analysis in engineering. Let me explain the statistical approach.",
        "Good question about engineering data! Here's how we can analyze this...",
        "This is an important concept in engineering statistics. Let me break it down."
      ]
    };

    const subjectResponses = responses[subject || 'electronics'];
    return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
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
          Chat Assistant
        </h1>
        <p className="text-gray-600">Ask questions about {subjectNames[subjectId || 'electronics']} and get instant help!</p>
      </div>

      <Card className="flex-1 bg-white/70 backdrop-blur-sm shadow-lg border-0 flex flex-col">
        <CardContent className="flex-1 p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
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
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 bg-white/50 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
