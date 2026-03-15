"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2, Trash2, Star, StarOff, Users, LayoutGrid,
  ShieldBan, ShieldCheck, ShieldPlus, ShieldMinus, UserX,
} from "lucide-react";

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
  banned: boolean;
  projects: { id: string }[];
}

interface SessionUserWithRole {
  id?: string;
  role?: string;
}

function ConfirmAction({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  danger = false,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs animate-in">
      <span className="text-zinc-300">{message}</span>
      <button
        onClick={onConfirm}
        className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
          danger
            ? "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
            : "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30"
        }`}
      >
        {confirmLabel}
      </button>
      <button
        onClick={onCancel}
        className="px-2.5 py-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 font-semibold transition-all"
      >
        Cancelar
      </button>
    </div>
  );
}

function UserRow({
  user,
  currentUserId,
  onAction,
}: {
  user: User;
  currentUserId: string;
  onAction: (userId: string, action: "ban" | "unban" | "promote" | "demote" | "delete") => Promise<void>;
}) {
  const [confirm, setConfirm] = useState<null | "ban" | "unban" | "promote" | "demote" | "delete">(null);
  const [loading, setLoading] = useState(false);
  const isSelf = user.id === currentUserId;

  async function execute(action: "ban" | "unban" | "promote" | "demote" | "delete") {
    setLoading(true);
    setConfirm(null);
    await onAction(user.id, action);
    setLoading(false);
  }

  const confirmMessages: Record<string, string> = {
    ban:     `Suspender ${user.name}?`,
    unban:   `Reativar ${user.name}?`,
    promote: `Tornar ${user.name} admin?`,
    demote:  `Remover admin de ${user.name}?`,
    delete:  `Deletar ${user.name} e todos os projetos?`,
  };

  return (
    <div
      className={`p-4 bg-zinc-900 border rounded-xl transition-all ${
        user.banned
          ? "border-red-500/30 bg-red-950/10"
          : "border-zinc-800"
      }`}
    >

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className={`w-9 h-9 rounded-full border ${
                user.banned ? "border-red-500/50 grayscale" : "border-zinc-700"
              }`}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 text-xs font-bold">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-semibold text-sm ${user.banned ? "text-zinc-500 line-through" : "text-white"}`}>
                {user.name}
              </p>
              {user.role === "admin" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-medium">
                  Admin
                </span>
              )}
              {user.banned && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-medium flex items-center gap-1">
                  <ShieldBan size={10} /> Suspenso
                </span>
              )}
              {isSelf && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 font-medium">
                  Você
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-xs mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-600 text-xs">
            {user.projects.length} projeto{user.projects.length !== 1 ? "s" : ""}
          </span>

          {!isSelf && (
            <div className="flex items-center gap-1">
              {loading ? (
                <Loader2 size={14} className="text-zinc-500 animate-spin" />
              ) : (
                <>

                  {user.banned ? (
                    <ActionButton
                      icon={<ShieldCheck size={14} />}
                      label="Reativar conta"
                      color="text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => setConfirm("unban")}
                    />
                  ) : (
                    <ActionButton
                      icon={<ShieldBan size={14} />}
                      label="Suspender conta"
                      color="text-amber-400 hover:bg-amber-500/10"
                      onClick={() => setConfirm("ban")}
                    />
                  )}

                  {user.role !== "admin" ? (
                    <ActionButton
                      icon={<ShieldPlus size={14} />}
                      label="Promover a admin"
                      color="text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => setConfirm("promote")}
                    />
                  ) : (
                    <ActionButton
                      icon={<ShieldMinus size={14} />}
                      label="Remover admin"
                      color="text-zinc-400 hover:bg-zinc-700"
                      onClick={() => setConfirm("demote")}
                    />
                  )}

                  <ActionButton
                    icon={<UserX size={14} />}
                    label="Deletar usuário"
                    color="text-red-400 hover:bg-red-500/10"
                    onClick={() => setConfirm("delete")}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {confirm && (
        <div className="mt-3">
          <ConfirmAction
            message={confirmMessages[confirm]}
            confirmLabel={confirm === "delete" ? "Deletar" : "Confirmar"}
            danger={confirm === "delete" || confirm === "ban"}
            onConfirm={() => execute(confirm)}
            onCancel={() => setConfirm(null)}
          />
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2 rounded-lg transition-all text-zinc-500 ${color}`}
    >
      {icon}
    </button>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<"projects" | "users">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const sessionUser = session?.user as SessionUserWithRole;
  const isAdmin = sessionUser?.role === "admin";

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    const loadData = async () => {
      if (isAdmin) {
        await fetchProjects();
        await fetchUsers();
      }
    };
    loadData();
  }, [isAdmin, fetchProjects, fetchUsers]);

  async function handleDeleteProject(id: string) {
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

  async function handleUserAction(
    userId: string,
    action: "ban" | "unban" | "promote" | "demote" | "delete"
  ) {
    if (action === "delete") {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        await fetchUsers();
        await fetchProjects();
      }
    } else {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
        );
      }
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="text-cyan-400 animate-spin" size={32} />
      </div>
    );
  }

  const bannedCount = users.filter((u) => u.banned).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/6 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">

        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Admin</span>
            </div>
            <h1 className="text-3xl font-black text-white">Painel de Controle</h1>
          </div>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Portal
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<LayoutGrid size={18} className="text-cyan-400" />} label="Projetos" value={projects.length} />
          <StatCard icon={<Users size={18} className="text-indigo-400" />} label="Usuários" value={users.length} />
          <StatCard icon={<Star size={18} className="text-amber-400" />} label="Destaques" value={projects.filter((p) => p.featured).length} />
          <StatCard icon={<ShieldBan size={18} className="text-red-400" />} label="Suspensos" value={bannedCount} />
        </div>

        <div className="flex gap-2 mb-6">
          {(["projects", "users"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t === "projects" ? "Projetos" : "Usuários"}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-8">Nenhum projeto ainda.</p>
            )}
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {p.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium">
                      ★ Destaque
                    </span>
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">{p.projectTitle}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {p.studentName} · {p.technologies.slice(0, 3).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    title={p.featured ? "Remover destaque" : "Destacar projeto"}
                    className={`p-2 rounded-lg transition-all ${
                      p.featured
                        ? "text-amber-400 hover:bg-amber-500/10"
                        : "text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10"
                    }`}
                  >
                    {p.featured ? <StarOff size={15} /> : <Star size={15} />}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    title="Deletar projeto"
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">

            <div className="flex flex-wrap gap-3 px-1 mb-2 text-xs text-zinc-600">
              <span className="flex items-center gap-1.5"><ShieldBan size={12} className="text-amber-400" /> Suspender</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-400" /> Reativar</span>
              <span className="flex items-center gap-1.5"><ShieldPlus size={12} className="text-cyan-400" /> Promover a admin</span>
              <span className="flex items-center gap-1.5"><ShieldMinus size={12} className="text-zinc-400" /> Remover admin</span>
              <span className="flex items-center gap-1.5"><UserX size={12} className="text-red-400" /> Deletar usuário</span>
            </div>

            {users.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-8">Nenhum usuário ainda.</p>
            )}
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                currentUserId={sessionUser?.id ?? ""}
                onAction={handleUserAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-zinc-400 text-sm">{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}