export interface PromotionData {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  color: string | null;
  website: string | null;
}

export interface VenueData {
  id: string;
  name: string;
  address: string | null;
  prefecture: string;
  region: string;
  latitude: number;
  longitude: number;
  capacity: number | null;
}

export interface EventData {
  id: string;
  name: string;
  description: string | null;
  date: string;
  startTime: string | null;
  doorTime: string | null;
  status: string;
  ticketUrl: string | null;
  ticketInfo: string | null;
  promotion: PromotionData;
  venue: VenueData;
}

export interface EventsResponse {
  events: EventData[];
  total: number;
  page: number;
  limit: number;
}

export type ViewMode = "list" | "calendar" | "map";
