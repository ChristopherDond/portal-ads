"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Star, StarOff, Users, LayoutGrid } from "lucide-react";

interface Project {
  id: string;
  studentName: string;
  projectTitle: string;
  technologies: string[];
  featured: boolean;
  postedAt: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  projects: { id: string }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<"projects" | "users">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin]);

  useEffect(() => {
    if (isAdmin) { fetchProjects(); fetchUsers(); }
  }, [isAdmin]);

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  async function handleDelete(id: string) {
    if (!confirm("Deletar este projeto?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  async function handleToggleFeatured(project: Project) {
    await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: project.studentName,
        projectTitle: project.projectTitle,
        description: "",
        technologies: project.technologies,
        featured: !project.featured,
      }),
    });
    fetchProjects();
  }

  if (status === "loading" || loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="text-cyan-400 animate-spin" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2
                            bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Admin</span>
            </div>
            <h1 className="text-3xl font-black text-white">Painel de Controle</h1>
          </div>
          <a href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Portal
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid size={18} className="text-cyan-400" />
              <span className="text-zinc-400 text-sm">Total de Projetos</span>
            </div>
            <p className="text-3xl font-black text-white">{projects.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users size={18} className="text-indigo-400" />
              <span className="text-zinc-400 text-sm">Total de Usuários</span>
            </div>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("projects")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${tab === "projects"
                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
            Projetos
          </button>
          <button onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${tab === "users"
                ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
            Usuários
          </button>
        </div>

        {/* Lista de projetos */}
        {tab === "projects" && (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  {p.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium">
                      ★ Destaque
                    </span>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{p.projectTitle}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{p.studentName} · {p.technologies.slice(0, 3).join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleFeatured(p)}
                    className={`p-2 rounded-lg transition-all
                      ${p.featured
                        ? "text-amber-400 hover:bg-amber-500/10"
                        : "text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10"}`}>
                    {p.featured ? <StarOff size={15} /> : <Star size={15} />}
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lista de usuários */}
        {tab === "users" && (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id}
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-3">
                  {u.image && (
                    <img src={u.image} alt={u.name}
                      className="w-9 h-9 rounded-full border border-zinc-700" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{u.name}</p>
                      {u.role === "admin" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5">{u.email}</p>
                  </div>
                </div>
                <span className="text-zinc-500 text-xs">
                  {u.projects.length} projeto{u.projects.length !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}