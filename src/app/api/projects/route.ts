import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseTechnologies(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { postedAt: "desc" },
    include: { user: { select: { image: true } } },
  });

  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      userImage: p.user?.image ?? null,
      technologies: parseTechnologies(p.technologies),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();

  if (!body.studentName || !body.projectTitle || !body.description || !body.technologies?.length)
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      studentName: body.studentName,
      projectTitle: body.projectTitle,
      description: body.description,
      technologies: JSON.stringify(body.technologies),
      github: body.github || null,
      linkedin: body.linkedin || null,
      instagram: body.instagram || null,
      projectUrl: body.projectUrl || null,
      email: body.email || null,
      whatsapp: body.whatsapp || null,
      userId: session.user.id,
    },
  });

  return NextResponse.json({
    ...project,
    technologies: parseTechnologies(project.technologies),
  });
}