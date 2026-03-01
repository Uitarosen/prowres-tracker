import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  fetchPuwotaSchedule,
  parseEvents,
  getTargetMonths,
  type ScrapedEvent,
} from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Hobby plan max

export async function GET(request: NextRequest) {
  // Vercel Cron認証チェック
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const months = getTargetMonths();

    // 3ヶ月分を並列でfetch & 解析
    const results = await Promise.all(
      months.map(async (month) => {
        const html = await fetchPuwotaSchedule(month);
        return parseEvents(html, month);
      })
    );
    const allScraped: ScrapedEvent[] = results.flat();

    // DB内の団体・会場一覧を一括取得
    const [promotions, existingVenues] = await Promise.all([
      prisma.promotion.findMany(),
      prisma.venue.findMany(),
    ]);
    const promotionMap = new Map(promotions.map((p) => [p.slug, p]));
    const venueCache = new Map(existingVenues.map((v) => [v.name, v]));

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // 会場の一括作成（新規会場を先にまとめて作成）
    const newVenueNames = new Set<string>();
    for (const scraped of allScraped) {
      if (promotionMap.has(scraped.promotionSlug) && !venueCache.has(scraped.venueName)) {
        newVenueNames.add(scraped.venueName);
      }
    }

    // 新規会場をバッチ作成
    for (const venueName of newVenueNames) {
      const scraped = allScraped.find((e) => e.venueName === venueName)!;
      const venue = await prisma.venue.create({
        data: {
          name: venueName,
          prefecture: scraped.prefecture,
          region: scraped.region,
          latitude: 0,
          longitude: 0,
        },
      });
      venueCache.set(venueName, venue);
    }

    // イベントをバッチでupsert
    for (const scraped of allScraped) {
      const promotion = promotionMap.get(scraped.promotionSlug);
      if (!promotion) {
        skipped++;
        continue;
      }

      const venue = venueCache.get(scraped.venueName);
      if (!venue) {
        skipped++;
        continue;
      }

      const eventName = `${promotion.shortName} ${scraped.venueName}大会`;

      try {
        const existing = await prisma.event.findUnique({
          where: {
            date_promotionId_venueId: {
              date: scraped.date,
              promotionId: promotion.id,
              venueId: venue.id,
            },
          },
          select: { id: true },
        });

        if (existing) {
          await prisma.event.update({
            where: { id: existing.id },
            data: {
              startTime: scraped.startTime,
              sourceId: scraped.sourceUrl,
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
    await prisma.event.updateMany({
      where: {
        date: { lt: new Date() },
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
