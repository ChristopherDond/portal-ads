"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, X, LogOut, CheckCircle2, Loader2 } from "lucide-react";

const TECH_OPTIONS = [
  "Python", "Java", "React", "React Native", "Node.js", "API",
  "Docker", "MongoDB", "PostgreSQL", "Angular", "Vue.js",
  "WebSocket", "Machine Learning", "FastAPI", "Spring Boot",
  "TypeScript", "Next.js", "MySQL", "Redis", "GraphQL",
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    studentName: "",
    projectTitle: "",
    description: "",
    github: "",
    linkedin: "",
    instagram: "",
    projectUrl: "",
  });
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Redireciona se não estiver logado
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="text-cyan-400 animate-spin" size={32} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  function toggleTech(tech: string) {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  async function handleSubmit() {
    if (!form.studentName || !form.projectTitle || !form.description || selectedTechs.length === 0) {
      setError("Preencha nome, título, descrição e pelo menos uma tecnologia.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, technologies: selectedTechs }),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 size={56} className="text-cyan-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Projeto publicado!</h2>
          <p className="text-zinc-400">Redirecionando para o portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar"
                   className="w-10 h-10 rounded-full border-2 border-zinc-700" />
            )}
            <div>
              <p className="text-white font-semibold text-sm">{session?.user?.name}</p>
              <p className="text-zinc-500 text-xs">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Portal
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                         text-zinc-400 hover:text-red-400 bg-zinc-900 border border-zinc-800
                         hover:border-red-500/30 transition-all"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Publicar Projeto</h1>
          <p className="text-zinc-400 text-sm">Preencha as informações do seu projeto para exibi-lo no portal.</p>
        </div>

        {/* Formulário */}
        <div className="space-y-5">

          {/* Nome e título */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Seu nome completo *">
              <input
                type="text"
                placeholder="Ex: Ana Beatriz Silva"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Título do projeto *">
              <input
                type="text"
                placeholder="Ex: SyncFlow API"
                value={form.projectTitle}
                onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Descrição */}
          <Field label="Descrição do projeto *">
            <textarea
              rows={4}
              placeholder="Descreva o que seu projeto faz, quais problemas resolve..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass + " resize-none"}
            />
          </Field>

          {/* Tecnologias */}
          <Field label="Tecnologias usadas *">
            <div className="flex flex-wrap gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl
                            focus-within:border-cyan-500/60 transition-colors min-h-[56px]">
              {TECH_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${selectedTechs.includes(tech)
                      ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"}`}
                >
                  {selectedTechs.includes(tech) && <span className="mr-1">✓</span>}
                  {tech}
                </button>
              ))}
            </div>
          </Field>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub">
              <input type="url" placeholder="https://github.com/..."
                value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                className={inputClass} />
            </Field>
            <Field label="LinkedIn">
              <input type="url" placeholder="https://linkedin.com/in/..."
                value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className={inputClass} />
            </Field>
            <Field label="Instagram">
              <input type="url" placeholder="https://instagram.com/..."
                value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className={inputClass} />
            </Field>
            <Field label="Link do projeto">
              <input type="url" placeholder="https://..."
                value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
                className={inputClass} />
            </Field>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <X size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Publicando...</>
            ) : (
              <><Plus size={16} /> Publicar projeto</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass = `
  w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl
  text-sm text-white placeholder-zinc-500
  focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20
  transition-all duration-200
`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
