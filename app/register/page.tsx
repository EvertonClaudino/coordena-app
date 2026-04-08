"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { UserPlus, ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing-page/navbar";
import { Footer } from "@/components/landing-page/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          role: "COORDENADOR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      toast.success("Conta criada com sucesso! Redirecionando...");
      
      // Pequeno delay para o utilizador ver a mensagem de sucesso
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-blue-100 selection:text-blue-900 border-none!">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32 relative overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none relative">
            
            {/* Top Glow */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="flex flex-col items-center gap-5 mb-10 text-center">
              <div className="h-16 w-16 rounded-[1.25rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Junte-se ao Coordena
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  Crie a sua conta de <span className="text-blue-600 dark:text-blue-400 font-bold">Coordenador</span> e <br/> transforme a gestão da sua formação.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="nome" className="text-slate-700 dark:text-slate-300 ml-1">Nome Completo</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="ex: Manuel dos Santos"
                    required
                    className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-[15px]"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 ml-1">E-mail Profissional</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@empresa.com"
                    required
                    className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-[15px]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="senha" className="text-slate-700 dark:text-slate-300 ml-1">Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-[15px]"
                    value={formData.senha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirmarSenha" className="text-slate-700 dark:text-slate-300 ml-1">Confirmar Senha</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-12 h-12 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-[15px]"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-13 rounded-2xl font-bold shadow-xl shadow-blue-600/25 transition-all active:scale-[0.97] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Criar Conta Gratuita
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-[15px] font-medium">
                Já faz parte da plataforma?{" "}
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors font-bold underline underline-offset-4 decoration-blue-600/30">
                  Fazer Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
