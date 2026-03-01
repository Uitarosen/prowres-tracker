import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import {
  PROMOTION_NAME_TO_SLUG,
  PREFECTURE_EN_TO_JA,
  PREFECTURE_TO_REGION,
} from "@/data/promotion-map";

export interface ScrapedEvent {
  promotionSlug: string;
  promotionName: string;
  date: Date;
  startTime: string | null;
  venueName: string;
  prefecture: string; // 日本語
  region: string;
  sourceUrl: string | null;
}

/**
 * Puwotaの月別スケジュールページをfetchしてHTMLを返す
 */
export async function fetchPuwotaSchedule(yearMonth: string): Promise<string> {
  const url = `https://en.puwota.com/index.cgi?${yearMonth}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "JapanProWrestleMania/1.0 (Event Tracker)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Puwota: ${response.status}`);
  }

  return response.text();
}

/**
 * PuwotaのHTMLからイベントデータを抽出
 *
 * HTML構造:
 * - 各日はカレンダーセル内の `div.d-none.d-sm-block` にデスクトップ表示
 * - 日付は `div.border-bottom.nml_h` に "1 ", "2 " のように入っている
 * - 各イベントは `div.oneshow` クラスのrow
 *   - 団体名: `div.col-12.color01/color02/color04` のテキスト
 *   - 時間+都道府県: `div.left-side` 内の `<a>` テキスト (例: "14:00 Tokyo")
 *   - 会場名: `div.left-side` の親の後の `div.col-12` テキスト
 *   - Google Calendar リンクからも日時を取得可能
 */
export function parseEvents(
  html: string,
  yearMonth: string
): ScrapedEvent[] {
  const $ = cheerio.load(html);
  const events: ScrapedEvent[] = [];
  const year = parseInt(yearMonth.slice(0, 4));
  const month = parseInt(yearMonth.slice(4, 6));

  // デスクトップ表示のカレンダーセルを走査
  $("div.d-none.d-sm-block").each((_cellIdx, cell) => {
    // 日付を取得
    const dateHeader = $(cell).find("div.border-bottom").first();
    const dayText = dateHeader.text().trim();
    const day = parseInt(dayText);
    if (isNaN(day) || day < 1 || day > 31) return;

    const eventDate = new Date(Date.UTC(year, month - 1, day));

    // 各イベント (div.oneshow) を処理
    $(cell).find("div.oneshow").each((_eventIdx, eventEl) => {
      try {
        const parsed = parseOneEvent($, eventEl, eventDate);
        if (parsed) {
          events.push(parsed);
        }
      } catch {
        // パース失敗したイベントはスキップ
      }
    });
  });

  return events;
}

function parseOneEvent(
  $: cheerio.CheerioAPI,
  eventEl: AnyNode,
  eventDate: Date
): ScrapedEvent | null {
  // 団体名を取得 (div.col-12 with color class)
  const promotionEl = $(eventEl).find(
    "div.col-12[class*='color0']"
  );
  const promotionName = promotionEl.text().trim();
  if (!promotionName) return null;

  // 団体名をslugにマッピング
  const slug = PROMOTION_NAME_TO_SLUG[promotionName];
  if (!slug) return null; // 対象外の団体はスキップ

  // 時間と都道府県を取得 (left-side内のaタグテキスト)
  const leftSide = $(eventEl).find("div.left-side");
  const leftText = leftSide.text().trim();

  // "14:00 Tokyo" or "TBD Kanagawa" のようなフォーマット
  let startTime: string | null = null;
  let prefectureEn = "";

  const timeMatch = leftText.match(/^(\d{1,2}:\d{2})\s+(.+)$/);
  if (timeMatch) {
    startTime = timeMatch[1];
    prefectureEn = timeMatch[2].trim();
  } else {
    // "TBD Location" のケース
    const parts = leftText.split(/\s+/);
    prefectureEn = parts[parts.length - 1] || "";
  }

  // "overseas" はスキップ
  if (prefectureEn.toLowerCase() === "overseas") return null;

  // 都道府県の英語→日本語変換
  const prefecture = PREFECTURE_EN_TO_JA[prefectureEn] || prefectureEn;
  const region = PREFECTURE_TO_REGION[prefecture] || "その他";

  // 会場名を取得
  // left-sideの<a>の閉じタグの後にある div.col-12 のテキスト
  // HTML構造上、会場名はleft-side親の隣のdiv.col-12にある
  const venueEl = $(eventEl).find(
    "div.left-side"
  ).closest("div.row").next("div.col-12");
  let venueName = venueEl.text().trim();

  // venueNameが空の場合、別の取得方法を試みる
  if (!venueName) {
    // oneshow内の2番目のcol-12を探す
    const cols = $(eventEl).find("div.col-12");
    if (cols.length >= 2) {
      // 最初は団体名、一連のdiv.col-12の中から会場名を探す
      cols.each((_i, col) => {
        const text = $(col).text().trim();
        if (
          text &&
          text !== promotionName &&
          !text.includes(":") &&
          !text.includes("%")
        ) {
          if (!venueName) venueName = text;
        }
      });
    }
  }

  if (!venueName) return null;

  // ソースURLを取得
  const sourceUrl =
    leftSide.find("a").first().attr("href") || null;

  return {
    promotionSlug: slug,
    promotionName,
    date: eventDate,
    startTime,
    venueName,
    prefecture,
    region,
    sourceUrl,
  };
}

/**
 * 当月・翌月・翌々月のYYYYMM文字列を返す
 */
export function getTargetMonths(): string[] {
  const now = new Date();
  const months: string[] = [];

  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${y}${m}`);
  }

  return months;
}
