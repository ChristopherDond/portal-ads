"use client";

import { useState } from "react";
import {
  Github, Linkedin, Instagram, ExternalLink,
  Calendar, X, Code2, Mail, Phone
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  studentName: string;
  projectTitle: string;
  description: string;
  technologies: string[];
  links: {
    github?: string | null;
    linkedin?: string | null;
    instagram?: string | null;
    projectUrl?: string | null;
    email?: string | null;
    whatsapp?: string | null;
  };
  postedAt: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

// ─── Mapa de cores por tecnologia ─────────────────────────────────────────────

const TECH_COLORS: Record<string, string> = {
  Python:             "bg-cyan-950 text-cyan-300 border-cyan-700",
  Java:               "bg-indigo-950 text-indigo-300 border-indigo-700",
  React:              "bg-sky-950 text-sky-300 border-sky-700",
  "React Native":     "bg-sky-950 text-sky-300 border-sky-700",
  "Node.js":          "bg-emerald-950 text-emerald-300 border-emerald-700",
  API:                "bg-violet-950 text-violet-300 border-violet-700",
  Docker:             "bg-blue-950 text-blue-300 border-blue-700",
  MongoDB:            "bg-green-950 text-green-300 border-green-700",
  PostgreSQL:         "bg-slate-800 text-slate-300 border-slate-600",
  Angular:            "bg-red-950 text-red-300 border-red-700",
  "Vue.js":           "bg-teal-950 text-teal-300 border-teal-700",
  WebSocket:          "bg-amber-950 text-amber-300 border-amber-700",
  "Machine Learning": "bg-purple-950 text-purple-300 border-purple-700",
  FastAPI:            "bg-cyan-950 text-cyan-300 border-cyan-700",
  "Spring Boot":      "bg-green-950 text-green-300 border-green-700",
};

const DEFAULT_TECH_COLOR = "bg-zinc-800 text-zinc-300 border-zinc-600";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function formatWhatsapp(raw: string): string {
  // Remove everything but digits
  return raw.replace(/\D/g, "");
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { studentName, projectTitle, description, technologies, links, postedAt } = project;

  const whatsappUrl = links.whatsapp
    ? `https://wa.me/${formatWhatsapp(links.whatsapp)}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-700
                            flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {getInitials(studentName)}
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{studentName}</p>
              <p className="text-cyan-400 font-semibold text-sm mt-0.5">{projectTitle}</p>
              <div className="flex items-center gap-1.5 mt-1 text-zinc-500 text-xs">
                <Calendar size={11} />
                <span>{formatDate(postedAt)}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-zinc-300 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="px-6 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <Code2 size={13} className="text-zinc-500" />
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className={`text-xs px-3 py-1 rounded-full border font-medium ${TECH_COLORS[tech] ?? DEFAULT_TECH_COLOR}`}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Contatos */}
        {(links.email || links.whatsapp) && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={13} className="text-zinc-500" />
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">Contato</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.email && (
                <a href={`mailto:${links.email}`}
                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                              text-cyan-300 bg-cyan-500/10 border border-cyan-500/25
                              hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all">
                  <Mail size={13} />
                  {links.email}
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
                              text-green-300 bg-green-500/10 border border-green-500/25
                              hover:bg-green-500/20 hover:border-green-500/50 transition-all">
                  {/* WhatsApp icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {links.whatsapp}
                </a>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-6 py-4 border-t border-zinc-800 bg-zinc-950/50 flex-wrap">
          {links.github    && <LinkButton href={links.github}    icon={<Github size={15} />}    label="GitHub" />}
          {links.linkedin  && <LinkButton href={links.linkedin}  icon={<Linkedin size={15} />}  label="LinkedIn" />}
          {links.instagram && <LinkButton href={links.instagram} icon={<Instagram size={15} />} label="Instagram" />}
          {links.projectUrl && (
            <a href={links.projectUrl} target="_blank" rel="noopener noreferrer"
               className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                          bg-cyan-500/15 border border-cyan-500/30 text-cyan-400
                          hover:bg-cyan-500/25 hover:border-cyan-500/50 transition-all">
              Ver projeto <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function LinkButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700
                  border border-zinc-700 hover:border-zinc-500 transition-all">
      {icon}{label}
    </a>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { studentName, projectTitle, description, technologies, links, postedAt } = project;

  const whatsappUrl = links.whatsapp
    ? `https://wa.me/${formatWhatsapp(links.whatsapp)}`
    : null;

  return (
    <>
      <article
        className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden
                   cursor-pointer transition-all duration-300 ease-out
                   hover:border-cyan-500/60 hover:shadow-[0_0_28px_rgba(6,182,212,0.13)]
                   hover:-translate-y-1.5"
        style={{ animation: `fadeSlideIn 0.4s ease-out both`, animationDelay: `${index * 60}ms` }}
        onClick={() => setModalOpen(true)}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-zinc-800">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-700
                          flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-md">
            {getInitials(studentName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-snug break-words">{studentName}</p>
            <p className="text-cyan-400 text-xs font-medium mt-0.5">{projectTitle}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {links.github    && <SocialIcon href={links.github}    label="GitHub"><Github size={14} /></SocialIcon>}
            {links.linkedin  && <SocialIcon href={links.linkedin}  label="LinkedIn"><Linkedin size={14} /></SocialIcon>}
            {links.instagram && <SocialIcon href={links.instagram} label="Instagram"><Instagram size={14} /></SocialIcon>}
            {links.email && (
              <SocialIcon href={`mailto:${links.email}`} label="Email">
                <Mail size={14} />
              </SocialIcon>
            )}
            {whatsappUrl && (
              <SocialIcon href={whatsappUrl} label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </SocialIcon>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div className="px-5 py-4 flex-1">
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{description}</p>
        </div>

        {/* Tecnologias */}
        <div className="px-5 pb-4">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-2">Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span key={tech} className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${TECH_COLORS[tech] ?? DEFAULT_TECH_COLOR}`}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
            <Calendar size={12} />
            <span>{formatDate(postedAt)}</span>
          </div>
          <span className="text-xs text-zinc-600 group-hover:text-cyan-500 transition-colors font-medium">
            Ver detalhes →
          </span>
        </div>

        <div className="absolute inset-0 rounded-2xl pointer-events-none
                        bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </article>

      {modalOpen && <ProjectModal project={project} onClose={() => setModalOpen(false)} />}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
       className="p-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-150">
      {children}
    </a>
  );
}