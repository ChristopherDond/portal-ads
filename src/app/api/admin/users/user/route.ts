import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SessionUserWithRole {
  id?: string;
  role?: string;
}

export async function GET() {
  const session = await auth();
  if ((session?.user as SessionUserWithRole)?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      banned: true,
      projects: { select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const sessionUser = session?.user as SessionUserWithRole;

  if (sessionUser?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await req.json();
  const { userId, action } = body as { userId?: string; action?: string };

  if (!userId || !action)
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  if (userId === sessionUser?.id)
    return NextResponse.json(
      { error: "Você não pode alterar sua própria conta por aqui." },
      { status: 400 }
    );

  const validActions = ["ban", "unban", "promote", "demote"];
  if (!validActions.includes(action))
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });

  const dataMap: Record<string, object> = {
    ban:     { banned: true },
    unban:   { banned: false },
    promote: { role: "admin" },
    demote:  { role: "user" },
  };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: dataMap[action],
    select: { id: true, name: true, email: true, role: true, banned: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const sessionUser = session?.user as SessionUserWithRole;

  if (sessionUser?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await req.json();
  const { userId } = body as { userId?: string };

  if (!userId)
    return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

  if (userId === sessionUser?.id)
    return NextResponse.json(
      { error: "Você não pode deletar sua própria conta." },
      { status: 400 }
    );

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}