import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const promotion = searchParams.get("promotion");
  const region = searchParams.get("region");
  const prefecture = searchParams.get("prefecture");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const bookmarked = searchParams.get("bookmarked");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (promotion) {
    const slugs = promotion.split(",");
    where.promotion = { slug: { in: slugs } };
  }

  if (region) {
    where.venue = { ...where.venue, region };
  }

  if (prefecture) {
    where.venue = { ...where.venue, prefecture };
  }

  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  if (status) {
    where.status = status;
  }

  if (bookmarked) {
    const ids = bookmarked.split(",");
    where.id = { in: ids };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        promotion: true,
        venue: true,
      },
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({
    events,
    total,
    page,
    limit,
  });
}
