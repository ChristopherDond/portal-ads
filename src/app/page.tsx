"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { Search, ArrowUpDown, X, LayoutGrid, Layers, Plus, LogIn } from "lucide-react";
import ProjectCard, { Project } from "@/components/ProjectCard";

type SortMode = "az" | "date-desc" | "date-asc";

export default function HomePage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]         = useState("");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [sortMode, setSortMode]     = useState<SortMode>("date-desc");

  // Carrega projetos da API
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const mapped = Array.isArray(data)
          ? data.filter(Boolean).map((p) => ({
              ...p,
              links: {
                github:     p.github     ?? null,
                linkedin:   p.linkedin   ?? null,
                instagram:  p.instagram  ?? null,
                projectUrl: p.projectUrl ?? null,
                email:      p.email      ?? null,
                whatsapp:   p.whatsapp   ?? null,
              },
              userImage: p.userImage ?? null,
            }))
          : [];
        setProjects(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allTechnologies = useMemo(() =>
    Array.from(new Set(projects.flatMap((p) => p.technologies))).sort(),
    [projects]
  );

  const techCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => p.technologies.forEach((t) => { counts[t] = (counts[t] ?? 0) + 1; }));
    return counts;
  }, [projects]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return projects
      .filter((p) => {
        if (!term) return true;
        return p.studentName.toLowerCase().includes(term) || p.projectTitle.toLowerCase().includes(term);
      })
      .filter((p) => techFilter === "all" || p.technologies.includes(techFilter))
      .sort((a, b) => {
        if (sortMode === "az")        return a.studentName.localeCompare(b.studentName, "pt-BR");
        if (sortMode === "date-desc") return b.postedAt.localeCompare(a.postedAt);
        return a.postedAt.localeCompare(b.postedAt);
      });
  }, [projects, search, techFilter, sortMode]);

  const hasActiveFilters = search || techFilter !== "all" || sortMode !== "date-desc";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <header className="py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8
                          bg-zinc-900 border border-zinc-700 rounded-full">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-zinc-300 text-xs font-semibold tracking-[0.2em] uppercase">
              Senac ADS — Turma
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="text-white">Portal de</span>
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Projetos
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-px
                               bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed mt-8">
            Explore os projetos desenvolvidos pelos alunos do curso de{" "}
            <span className="text-zinc-200">Análise e Desenvolvimento de Sistemas</span>.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <Stat value={projects.length} label="Projetos" icon={<LayoutGrid size={15} />} />
            <div className="w-px h-8 bg-zinc-800" />
            <Stat value={allTechnologies.length} label="Tecnologias" icon={<Layers size={15} />} />
          </div>

          {/* Botão publicar / login */}
          <div className="mt-8">
            {session ? (
              <a href="/dashboard"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                            bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm
                            transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <Plus size={16} /> Publicar meu projeto
              </a>
            ) : (
              <button
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm
                           border border-zinc-700 hover:border-zinc-500 transition-all"
              >
                <LogIn size={16} /> Entrar para publicar
              </button>
            )}
          </div>
        </header>

        {/* ── Filtros ── */}
        <div className="mb-10 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por aluno ou projeto..."
                className="w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-xl
                           text-sm text-white placeholder-zinc-500
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20
                           transition-all duration-200"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative">
              <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="h-full bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white
                           pl-8 pr-4 focus:outline-none focus:border-cyan-500/60 transition-colors"
              >
                <option value="date-desc">Mais recente</option>
                <option value="date-asc">Mais antigo</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>

          {/* Pills de tecnologia */}
          {allTechnologies.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mr-1">Tech:</span>
              <TechPill label="Todas" count={projects.length} active={techFilter === "all"} onClick={() => setTechFilter("all")} />
              {allTechnologies.map((tech) => (
                <TechPill key={tech} label={tech} count={techCounts[tech] ?? 0}
                  active={techFilter === tech} onClick={() => setTechFilter(tech)} />
              ))}
              {hasActiveFilters && (
                <button
                  onClick={() => { setSearch(""); setTechFilter("all"); setSortMode("date-desc"); }}
                  className="flex items-center gap-1 ml-2 px-3 py-1 rounded-full text-xs
                             text-red-400 hover:text-red-300 border border-red-500/20
                             bg-red-500/5 hover:bg-red-500/10 transition-all"
                >
                  <X size={11} /> Limpar
                </button>
              )}
            </div>
          )}

          <p className="text-zinc-600 text-sm">
            {loading ? "Carregando projetos..." : `${filtered.length} projeto${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}${filtered.length !== projects.length ? ` de ${projects.length}` : ""}`}
          </p>
        </div>

        {/* ── Cards ── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-28 text-center pb-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Search size={24} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium mb-1">
              {projects.length === 0 ? "Nenhum projeto publicado ainda." : "Nenhum projeto encontrado"}
            </p>
            <p className="text-zinc-600 text-sm mb-4">
              {projects.length === 0 ? "Seja o primeiro a publicar!" : "Tente ajustar os filtros."}
            </p>
            {projects.length === 0 && session && (
              <a href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                Publicar projeto →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 text-cyan-400">
        {icon}
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
      <span className="text-zinc-500 text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

function TechPill({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200
        ${active ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"}`}
    >
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-cyan-500/30 text-cyan-300" : "bg-zinc-800 text-zinc-500"}`}>
        {count}
      </span>
    </button>
  );
}