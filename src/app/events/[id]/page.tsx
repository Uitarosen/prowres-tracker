import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatEventDate } from "@/lib/format";
import EventDetailClient from "./EventDetailClient";

async function getEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      promotion: true,
      venue: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "イベントが見つかりません" };
  }

  const dateStr = formatEventDate(event.date);
  const title = event.name;
  const description = `${dateStr} ${event.venue.name}で開催 - ${event.promotion.name}の興行情報`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ジャパン プロレスマニア`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ジャパン プロレスマニア`,
      description,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  // JSON-LD構造化データ (Schema.org Event)
  const eventStatus =
    event.status === "cancelled"
      ? "https://schema.org/EventCancelled"
      : event.status === "completed"
        ? "https://schema.org/EventPostponed"
        : "https://schema.org/EventScheduled";

  const startDateTime = event.startTime
    ? `${event.date.toISOString().split("T")[0]}T${event.startTime}:00+09:00`
    : event.date.toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: startDateTime,
    eventStatus,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.venue.prefecture,
        addressRegion: event.venue.region,
        addressCountry: "JP",
        ...(event.venue.address ? { streetAddress: event.venue.address } : {}),
      },
      ...(event.venue.latitude && event.venue.longitude
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.venue.latitude,
              longitude: event.venue.longitude,
            },
          }
        : {}),
    },
    organizer: {
      "@type": "Organization",
      name: event.promotion.name,
      ...(event.promotion.website ? { url: event.promotion.website } : {}),
    },
    ...(event.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticketUrl,
            availability: "https://schema.org/InStock",
            priceCurrency: "JPY",
          },
        }
      : {}),
  };

  // Serialize dates for client component
  const serializedEvent = {
    ...event,
    date: event.date.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    promotion: {
      ...event.promotion,
      createdAt: event.promotion.createdAt.toISOString(),
      updatedAt: event.promotion.updatedAt.toISOString(),
    },
    venue: {
      ...event.venue,
      createdAt: event.venue.createdAt.toISOString(),
      updatedAt: event.venue.updatedAt.toISOString(),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={serializedEvent} />
    </>
  );
}
