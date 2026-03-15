import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SessionUserWithRole {
  role?: string;
}

export async function GET() {
  const session = await auth();
  if ((session?.user as SessionUserWithRole)?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const setting = await prisma.setting.findUnique({
    where: { key: "access_code" },
  });

  return NextResponse.json({ code: setting?.value ?? "SENAC2026" });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if ((session?.user as SessionUserWithRole)?.role !== "admin")
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { code } = await req.json();

  if (!code || code.trim().length < 4)
    return NextResponse.json(
      { error: "Código deve ter pelo menos 4 caracteres" },
      { status: 400 }
    );

  const updated = await prisma.setting.upsert({
    where: { key: "access_code" },
    update: { value: code.trim().toUpperCase() },
    create: { key: "access_code", value: code.trim().toUpperCase() },
  });

  return NextResponse.json({ code: updated.value });
}