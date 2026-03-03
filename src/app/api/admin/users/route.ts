import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, image: true, role: true, projects: { select: { id: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(users);
}