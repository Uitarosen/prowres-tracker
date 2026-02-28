import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createEvents, type EventAttributes } from "ics";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const eventId = searchParams.get("eventId");
  const eventIds = searchParams.get("eventIds");

  let ids: string[] = [];
  if (eventId) ids = [eventId];
  if (eventIds) ids = eventIds.split(",");

  if (ids.length === 0) {
    return NextResponse.json({ error: "No event IDs provided" }, { status: 400 });
  }

  const events = await prisma.event.findMany({
    where: { id: { in: ids } },
    include: { promotion: true, venue: true },
  });

  const icsEvents: EventAttributes[] = events.map((event) => {
    const d = new Date(event.date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    let startHour = 18;
    let startMinute = 0;
    if (event.startTime) {
      const [h, m] = event.startTime.split(":").map(Number);
      startHour = h;
      startMinute = m;
    }

    return {
      title: `${event.promotion.shortName} ${event.name}`,
      start: [year, month, day, startHour, startMinute],
      duration: { hours: 3 },
      location: `${event.venue.name}${event.venue.address ? ` (${event.venue.address})` : ""}`,
      description: event.ticketInfo || "",
      geo: { lat: event.venue.latitude, lon: event.venue.longitude },
    };
  });

  const { error, value } = createEvents(icsEvents);

  if (error) {
    return NextResponse.json({ error: "Failed to create ICS" }, { status: 500 });
  }

  return new NextResponse(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="prowres-events.ics"',
    },
  });
}
