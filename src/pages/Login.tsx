import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast({
        title: "Bem-vindo(a) de volta!", // Translated
        description: "Login efetuado com sucesso em sua plataforma de estudos.", // Translated
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Informações faltando", // Translated
        description: "Por favor, insira o email e a senha.", // Translated
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Cabeçalho existente */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            StudyHub {/* Brand name, can remain or be translated if desired */}
          </h1>
          <p className="text-gray-600 mt-2">Seu adorável companheiro de aprendizado</p> {/* Translated */}
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">Bem-vindo(a) de volta!</CardTitle> {/* Translated */}
            <CardDescription className="text-gray-600">Faça login para continuar sua jornada de aprendizado</CardDescription> {/* Translated */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label> {/* Email is commonly used, or "Correio Eletrônico" */}
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email" // Translated
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label> {/* Translated */}
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha" // Translated
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Entrar {/* Translated */}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 mt-4">
            <p className="text-sm text-gray-600">
              Demonstração: Use qualquer email e senha para continuar. {/* Translated */}
            </p>
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '} {/* Translated */}
              <Link to="/create-account" className="font-medium text-purple-600 hover:text-purple-700 hover:underline">
                Crie uma {/* Translated */}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;