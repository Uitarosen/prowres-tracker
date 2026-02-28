"use client";
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Link from "next/link";
import { formatEventDate, formatTime } from "@/lib/format";
import type { EventData } from "@/types";

function createColoredIcon(color: string) {
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgTemplate,
    className: "custom-marker",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

interface MapContainerProps {
  events: EventData[];
}

export default function MapContainerComponent({ events }: MapContainerProps) {
  // Group events by venue
  const venueMap = new Map<
    string,
    { venue: EventData["venue"]; events: EventData[] }
  >();
  events.forEach((event) => {
    const key = event.venue.id;
    if (!venueMap.has(key)) {
      venueMap.set(key, { venue: event.venue, events: [] });
    }
    venueMap.get(key)!.events.push(event);
  });

  return (
    <LeafletMapContainer
      center={[36.5, 138.0]}
      zoom={6}
      className="h-[600px] w-full rounded-lg"
      style={{ background: "#1f2937" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {Array.from(venueMap.values()).map(({ venue, events: venueEvents }) => {
        const primaryColor = venueEvents[0].promotion.color || "#6B7280";
        return (
          <Marker
            key={venue.id}
            position={[venue.latitude, venue.longitude]}
            icon={createColoredIcon(primaryColor)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{venue.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{venue.prefecture}</p>
                <div className="space-y-2">
                  {venueEvents.slice(0, 5).map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block text-xs hover:text-blue-600"
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1"
                        style={{
                          backgroundColor: event.promotion.color || "#6B7280",
                        }}
                      />
                      <strong>{event.promotion.shortName}</strong>{" "}
                      {event.name}
                      <br />
                      <span className="text-gray-500">
                        {formatEventDate(event.date)}
                        {event.startTime
                          ? ` ${formatTime(event.startTime)}`
                          : ""}
                      </span>
                    </Link>
                  ))}
                  {venueEvents.length > 5 && (
                    <p className="text-xs text-gray-400">
                      他 {venueEvents.length - 5}件
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </LeafletMapContainer>
  );
}
