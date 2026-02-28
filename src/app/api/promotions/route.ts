import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(promotions);
}
