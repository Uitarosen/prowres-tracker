import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  fetchPuwotaSchedule,
  parseEvents,
  getTargetMonths,
  type ScrapedEvent,
} from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Vercel Hobby plan limit

export async function GET(request: NextRequest) {
  // Vercel Cron認証チェック
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const months = getTargetMonths();
    let allScraped: ScrapedEvent[] = [];

    // 3ヶ月分のスケジュールを取得・解析
    for (const month of months) {
      const html = await fetchPuwotaSchedule(month);
      const events = parseEvents(html, month);
      allScraped = allScraped.concat(events);
    }

    // DB内の団体一覧を取得
    const promotions = await prisma.promotion.findMany();
    const promotionMap = new Map(promotions.map((p) => [p.slug, p]));

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const scraped of allScraped) {
      const promotion = promotionMap.get(scraped.promotionSlug);
      if (!promotion) {
        skipped++;
        continue;
      }

      // 会場を検索 or 作成
      let venue = await prisma.venue.findFirst({
        where: { name: scraped.venueName },
      });

      if (!venue) {
        venue = await prisma.venue.create({
          data: {
            name: scraped.venueName,
            prefecture: scraped.prefecture,
            region: scraped.region,
            latitude: 0,
            longitude: 0,
          },
        });
      }

      // イベントの名前を生成
      const eventName = `${promotion.shortName} ${scraped.venueName}大会`;

      // upsert (date + promotionId + venueId でユニーク)
      try {
        const existing = await prisma.event.findUnique({
          where: {
            date_promotionId_venueId: {
              date: scraped.date,
              promotionId: promotion.id,
              venueId: venue.id,
            },
          },
        });

        if (existing) {
          await prisma.event.update({
            where: { id: existing.id },
            data: {
              startTime: scraped.startTime || existing.startTime,
              sourceId: scraped.sourceUrl || existing.sourceId,
            },
          });
          updated++;
        } else {
          await prisma.event.create({
            data: {
              name: eventName,
              date: scraped.date,
              startTime: scraped.startTime,
              promotionId: promotion.id,
              venueId: venue.id,
              sourceId: scraped.sourceUrl,
              status: scraped.date < new Date() ? "completed" : "scheduled",
            },
          });
          created++;
        }
      } catch {
        skipped++;
      }
    }

    // 過去イベントのステータスを "completed" に更新
    const now = new Date();
    await prisma.event.updateMany({
      where: {
        date: { lt: now },
        status: "scheduled",
      },
      data: { status: "completed" },
    });

    return NextResponse.json({
      success: true,
      months,
      totalScraped: allScraped.length,
      created,
      updated,
      skipped,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron update-events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
