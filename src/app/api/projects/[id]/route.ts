import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  const user = session.user as { id: string; role?: string };
  const isAdmin = user.role === "admin";

  if (project.userId !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.project.update({
    where: { id },
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
      ...(isAdmin && { featured: body.featured }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  const user = session.user as { id: string; role?: string };
  const isAdmin = user.role === "admin";

  if (project.userId !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });
  
  return NextResponse.json({ success: true });
}