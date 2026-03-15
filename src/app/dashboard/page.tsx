"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, X, LogOut, CheckCircle2, Loader2, Pencil, Trash2, ShieldBan } from "lucide-react";

const TECH_OPTIONS = [
  "Python", "Java", "React", "React Native", "Node.js", "API",
  "Docker", "MongoDB", "PostgreSQL", "Angular", "Vue.js",
  "WebSocket", "Machine Learning", "FastAPI", "Spring Boot",
  "TypeScript", "Next.js", "MySQL", "Redis", "GraphQL",
];

interface Project {
  id: string;
  studentName: string;
  projectTitle: string;
  description: string;
  technologies: string[];
  github?: string;
  linkedin?: string;
  instagram?: string;
  projectUrl?: string;
  email?: string;
  whatsapp?: string;
  featured: boolean;
  postedAt: string;
  userId: string;
}

interface SessionUserWithRole {
  role?: string;
}

const emptyForm = {
  studentName: "", projectTitle: "", description: "",
  github: "", linkedin: "", instagram: "", projectUrl: "",
  email: "", whatsapp: "",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const isAdmin = (session?.user as SessionUserWithRole)?.role === "admin";

  const fetchMyProjects = useCallback(async () => {
    setLoadingProjects(true);
    const res = await fetch("/api/projects");
    const all = await res.json();
    const mine = all.filter((p: Project) => p.userId === session?.user?.id);
    setMyProjects(mine);
    setLoadingProjects(false);
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchMyProjects();
  }, [status, fetchMyProjects]);

  function toggleTech(tech: string) {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      studentName: project.studentName,
      projectTitle: project.projectTitle,
      description: project.description,
      github: project.github || "",
      linkedin: project.linkedin || "",
      instagram: project.instagram || "",
      projectUrl: project.projectUrl || "",
      email: project.email || "",
      whatsapp: project.whatsapp || "",
    });
    setSelectedTechs(project.technologies);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedTechs([]);
    setShowForm(false);
    setError("");
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar este projeto?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) fetchMyProjects();
    else setError("Erro ao deletar projeto.");
  }

  async function handleSubmit() {
    if (!form.studentName || !form.projectTitle || !form.description || selectedTechs.length === 0) {
      setError("Preencha nome, título, descrição e pelo menos uma tecnologia.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, technologies: selectedTechs }),
      });

      if (!res.ok) {
        const data = await res.json();
        // Detecta conta suspensa
        if (data?.code === "ACCOUNT_SUSPENDED") {
          setIsBanned(true);
          setShowForm(false);
          return;
        }
        throw new Error(data?.error || "Erro ao salvar");
      }

      if (!editingId) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); cancelEdit(); fetchMyProjects(); }, 2000);
      } else {
        cancelEdit();
        fetchMyProjects();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="text-cyan-400 animate-spin" size={32} />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <CheckCircle2 size={56} className="text-cyan-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-bold mb-2">Projeto publicado!</h2>
        <p className="text-zinc-400">Atualizando...</p>
      </div>
    </div>
  );

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
              <Image src={session.user.image} alt="avatar" width={40} height={40}
                className="w-10 h-10 rounded-full border-2 border-zinc-700" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-sm">{session?.user?.name}</p>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                Painel Admin
              </Link>
            )}
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">← Portal</Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-400 bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-all">
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>

        {/* Banner de conta suspensa */}
        {isBanned && (
          <div className="flex items-start gap-3 p-4 mb-8 bg-red-500/10 border border-red-500/30 rounded-xl">
            <ShieldBan size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm">Conta suspensa</p>
              <p className="text-red-400/70 text-xs mt-0.5">
                Sua conta foi suspensa pelo administrador. Você pode visualizar seus projetos existentes,
                mas não pode publicar novos. Entre em contato com o admin para mais informações.
              </p>
            </div>
          </div>
        )}

        {/* Meus projetos */}
        {!loadingProjects && myProjects.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white font-bold text-lg mb-4">Meus Projetos</h2>
            <div className="space-y-3">
              {myProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div>
                    <p className="text-white font-semibold text-sm">{p.projectTitle}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{p.technologies.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(p)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão abrir formulário — oculto se suspenso */}
        {!showForm && !isBanned && (
          <button onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40
                       text-zinc-400 hover:text-cyan-400 font-semibold text-sm
                       transition-all duration-200 mb-8">
            <Plus size={16} /> Publicar novo projeto
          </button>
        )}

        {/* Formulário */}
        {showForm && !isBanned && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-white">
                {editingId ? "Editar Projeto" : "Publicar Projeto"}
              </h1>
              {editingId && (
                <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
                  Cancelar
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Seu nome completo *">
                  <input type="text" placeholder="Ex: Ana Beatriz Silva"
                    value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className={inputClass} />
                </Field>
                <Field label="Título do projeto *">
                  <input type="text" placeholder="Ex: SyncFlow API"
                    value={form.projectTitle} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
                    className={inputClass} />
                </Field>
              </div>

              <Field label="Descrição *">
                <textarea rows={4} placeholder="Descreva o que seu projeto faz..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass + " resize-none"} />
              </Field>

              <Field label="Tecnologias *">
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl min-h-[56px]">
                  {TECH_OPTIONS.map((tech) => (
                    <button key={tech} type="button" onClick={() => toggleTech(tech)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                        ${selectedTechs.includes(tech)
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                      {selectedTechs.includes(tech) && <span className="mr-1">✓</span>}
                      {tech}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Links sociais */}
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

              {/* Contatos */}
              <div className="pt-1">
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">
                  Contato (opcional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="E-mail">
                    <input type="email" placeholder="seu@email.com"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass} />
                  </Field>
                  <Field label="WhatsApp">
                    <input type="tel" placeholder="+55 11 99999-9999"
                      value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      className={inputClass} />
                  </Field>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <X size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm
                             transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                    : <><Plus size={16} /> {editingId ? "Salvar alterações" : "Publicar projeto"}</>}
                </button>
                {editingId && (
                  <button onClick={cancelEdit}
                    className="px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white font-semibold text-sm transition-all">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass = `w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl
  text-sm text-white placeholder-zinc-500
  focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20
  transition-all duration-200`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}