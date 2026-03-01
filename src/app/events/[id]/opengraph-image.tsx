import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const alt = "イベント情報";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
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
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#030712",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Event Not Found
        </div>
      ),
      { ...size }
    );
  }

  const dateStr = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(event.date);

  const promotionColor = event.promotion.color || "#6B7280";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#030712",
          padding: "0",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "8px",
            backgroundColor: promotionColor,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "48px 64px",
            justifyContent: "space-between",
          }}
        >
          {/* Promotion badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "8px 24px",
                borderRadius: "8px",
                backgroundColor: `${promotionColor}30`,
                color: promotionColor,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {event.promotion.name}
            </div>
            {event.status === "cancelled" && (
              <div
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#7f1d1d",
                  color: "#fca5a5",
                  fontSize: 24,
                }}
              >
                中止
              </div>
            )}
          </div>

          {/* Event name */}
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: event.name.length > 20 ? 48 : 56,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {event.name}
          </div>

          {/* Date and Venue */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#d1d5db",
                fontSize: 32,
              }}
            >
              📅 {dateStr}
              {event.startTime && ` ${event.startTime}開始`}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#d1d5db",
                fontSize: 32,
              }}
            >
              📍 {event.venue.name}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #374151",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#9ca3af",
                fontSize: 24,
              }}
            >
              🔥 ジャパン プロレスマニア
            </div>
            <div
              style={{
                display: "flex",
                color: "#6b7280",
                fontSize: 20,
              }}
            >
              JAPAN PRO WRESTLING MANIA
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
