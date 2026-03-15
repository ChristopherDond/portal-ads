import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";

const prisma = new PrismaClient();

const COOKIE_NAME = "portal_verified";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function signCode(code: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!)
    .update(code.trim().toUpperCase())
    .digest("hex");
}

async function getAccessCode(): Promise<string> {
  const setting = await prisma.setting.findUnique({
    where: { key: "access_code" },
  });

  if (!setting) {
    await prisma.setting.create({
      data: { key: "access_code", value: "SENAC2026" },
    });
    return "SENAC2026";
  }

  return setting.value;
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return NextResponse.json({ verified: false });

  const currentCode = await getAccessCode();
  const expected = signCode(currentCode);
  return NextResponse.json({ verified: cookie === expected });
}

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code)
    return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });

  const currentCode = await getAccessCode();

  if (code.trim().toUpperCase() !== currentCode.trim().toUpperCase()) {
    return NextResponse.json({ error: "Código incorreto" }, { status: 401 });
  }

  const token = signCode(currentCode);

  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}