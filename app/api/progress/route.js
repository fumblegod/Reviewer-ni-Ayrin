import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

function normalizeProgress(progress) {
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) {
    return {};
  }

  return progress;
}

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const record = await prisma.quizProgress.findUnique({
      where: { id: userId },
      select: { progress: true },
    });

    return Response.json({ progress: record?.progress || {} });
  } catch (error) {
    return Response.json({ error: "Could not load quiz progress" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const progress = normalizeProgress(body.progress);

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    await prisma.quizProgress.upsert({
      where: { id: userId },
      update: { progress },
      create: { id: userId, progress },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Could not save quiz progress" }, { status: 500 });
  }
}