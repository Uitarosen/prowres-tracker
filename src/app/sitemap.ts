import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://prowres-tracker.vercel.app";

  // 全イベントのID・更新日を取得
  const events = await prisma.event.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { date: "desc" },
  });

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...eventUrls,
  ];
}
