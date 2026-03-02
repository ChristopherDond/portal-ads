"use client";

import { signIn } from "next-auth/react";
import { Github, Chrome } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">

      {/* Blobs decorativos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Card de login */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

          <div className="p-8">
            {/* Logo / Título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4
                              bg-zinc-800 border border-zinc-700 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-zinc-400 text-xs font-semibold tracking-widest uppercase">
                  Senac ADS
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">
                Entrar no Portal
              </h1>
              <p className="text-zinc-500 text-sm">
                Faça login para publicar seu projeto
              </p>
            </div>

            {/* Botões de login */}
            <div className="space-y-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm
                           transition-all duration-200 hover:shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>

              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm
                           border border-zinc-700 hover:border-zinc-600
                           transition-all duration-200"
              >
                <Github size={20} />
                Continuar com GitHub
              </button>
            </div>

            <p className="text-center text-zinc-600 text-xs mt-6">
              Ao entrar, você concorda em publicar seu projeto no portal da turma.
            </p>
          </div>
        </div>

        {/* Link voltar */}
        <div className="text-center mt-4">
          <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Voltar para o portal
          </a>
        </div>
      </div>
    </div>
  );
}
