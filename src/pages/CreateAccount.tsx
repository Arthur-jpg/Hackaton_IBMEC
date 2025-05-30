import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookOpen, Heart, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateAccount = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Informações Faltando", // Translated
        description: "Por favor, preencha todos os campos.", // Translated
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas Não Coincidem", // Translated
        description: "As senhas não coincidem. Por favor, digite novamente.", // Translated
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        toast({
            title: "Email Inválido", // Translated
            description: "Por favor, insira um endereço de email válido.", // Translated
            variant: "destructive",
        });
        return;
    }

    console.log('Tentativa de criação de conta:', { fullName, email, password }); // "Account creation attempt" -> "Tentativa de criação de conta"
    toast({
      title: "Conta Criada! 🎉", // Translated
      description: "Bem-vindo ao StudyHub! Agora você pode fazer login.", // Translated
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <p className="text-gray-600 mt-2">Junte-se ao seu adorável companheiro de aprendizado</p> {/* Translated */}
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-3">
                <UserPlus className="h-8 w-8 text-purple-600"/>
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">Crie Sua Conta</CardTitle> {/* Translated */}
            <CardDescription className="text-gray-600">Vamos começar sua jornada de aprendizado!</CardDescription> {/* Translated */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Nome Completo</Label> {/* Translated */}
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Digite seu nome completo" // Translated
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
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
                  placeholder="Crie uma senha" // Translated
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Senha</Label> {/* Translated */}
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite novamente sua senha" // Translated
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Criar Conta {/* Translated */}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center block mt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '} {/* Translated */}
              <Link to="/" className="font-medium text-purple-600 hover:text-purple-700 hover:underline">
                Entrar {/* Translated */}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateAccount;