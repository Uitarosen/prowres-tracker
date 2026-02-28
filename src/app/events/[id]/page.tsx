import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EventDetailClient from "./EventDetailClient";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      promotion: true,
      venue: true,
    },
  });

  if (!event) {
    notFound();
  }

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

  return <EventDetailClient event={serializedEvent} />;
}
