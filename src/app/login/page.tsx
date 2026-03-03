"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4
                              bg-zinc-800 border border-zinc-700 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-zinc-400 text-xs font-semibold tracking-widest uppercase">
                  Senac ADS
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mb-2">Entrar no Portal</h1>
              <p className="text-zinc-500 text-sm">Faça login para publicar seu projeto</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm
                           border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
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

        <div className="text-center mt-4">
          <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Voltar para o portal
          </a>
        </div>
      </div>
    </div>
  );
}
