import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { postedAt: "desc" }],
  });
  const parsed = projects.map((p) => ({
    ...p,
    technologies: JSON.parse(p.technologies),
    postedAt: p.postedAt.toISOString().split("T")[0],
  }));
  return NextResponse.json(parsed);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const { studentName, projectTitle, description, technologies, github, linkedin, instagram, projectUrl } = body;

  if (!studentName || !projectTitle || !description || !technologies?.length)
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      studentName, projectTitle, description,
      technologies: JSON.stringify(technologies),
      github: github || null, linkedin: linkedin || null,
      instagram: instagram || null, projectUrl: projectUrl || null,
      userId: session.user.id,
    },
  });
  return NextResponse.json(project, { status: 201 });
}