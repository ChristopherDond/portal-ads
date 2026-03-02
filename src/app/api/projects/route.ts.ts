import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/projects — retorna todos os projetos
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { postedAt: "desc" },
    });

    // Converte technologies de string JSON para array
    const parsed = projects.map((p) => ({
      ...p,
      technologies: JSON.parse(p.technologies),
      links: {
        github: p.github,
        linkedin: p.linkedin,
        instagram: p.instagram,
        projectUrl: p.projectUrl,
      },
      postedAt: p.postedAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar projetos" }, { status: 500 });
  }
}

// POST /api/projects — cria um novo projeto
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { studentName, projectTitle, description, technologies, github, linkedin, instagram, projectUrl } = body;

    if (!studentName || !projectTitle || !description || !technologies?.length) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        studentName,
        projectTitle,
        description,
        technologies: JSON.stringify(technologies),
        github: github || null,
        linkedin: linkedin || null,
        instagram: instagram || null,
        projectUrl: projectUrl || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar projeto" }, { status: 500 });
  }
}
