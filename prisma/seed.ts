import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

function createSeedClient(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter } as never);
  }
  return new PrismaClient();
}

const prisma = createSeedClient();

async function main() {
  // Clean existing data
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.promotion.deleteMany();

  // === Promotions ===
  const promotions = await Promise.all([
    prisma.promotion.create({
      data: {
        name: "新日本プロレスリング",
        shortName: "新日本",
        slug: "njpw",
        color: "#C41E3A",
        website: "https://www.njpw1972.com",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "全日本プロレス",
        shortName: "全日本",
        slug: "ajpw",
        color: "#003399",
        website: "https://www.all-japan.co.jp",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "プロレスリング・ノア",
        shortName: "NOAH",
        slug: "noah",
        color: "#00A651",
        website: "https://www.noah.co.jp",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "DDTプロレスリング",
        shortName: "DDT",
        slug: "ddt",
        color: "#FF6600",
        website: "https://www.ddtpro.com",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "スターダム",
        shortName: "スターダム",
        slug: "stardom",
        color: "#E91E8C",
        website: "https://wwr-stardom.com",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "GLEAT",
        shortName: "GLEAT",
        slug: "gleat",
        color: "#8B5CF6",
        website: "https://gleat.jp",
      },
    }),
    prisma.promotion.create({
      data: {
        name: "ドラゴンゲート",
        shortName: "Dragon Gate",
        slug: "dragongate",
        color: "#DC2626",
        website: "https://www.gaora.co.jp/dragongate",
      },
    }),
  ]);

  const [njpw, ajpw, noah, ddt, stardom, gleat, dragongate] = promotions;

  // === Venues ===
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: "東京ドーム",
        address: "東京都文京区後楽1-3-61",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.7056,
        longitude: 139.7519,
        capacity: 55000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "両国国技館",
        address: "東京都墨田区横網1-3-28",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.6967,
        longitude: 139.7934,
        capacity: 11098,
      },
    }),
    prisma.venue.create({
      data: {
        name: "後楽園ホール",
        address: "東京都文京区後楽1-3-61",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.7078,
        longitude: 139.7539,
        capacity: 1800,
      },
    }),
    prisma.venue.create({
      data: {
        name: "大阪城ホール",
        address: "大阪府大阪市中央区大阪城3-1",
        prefecture: "大阪府",
        region: "近畿",
        latitude: 34.6873,
        longitude: 135.5262,
        capacity: 16000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "エディオンアリーナ大阪",
        address: "大阪府大阪市浪速区難波中3-4-36",
        prefecture: "大阪府",
        region: "近畿",
        latitude: 34.6597,
        longitude: 135.5023,
        capacity: 10000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "日本武道館",
        address: "東京都千代田区北の丸公園2-3",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.693,
        longitude: 139.75,
        capacity: 14471,
      },
    }),
    prisma.venue.create({
      data: {
        name: "横浜アリーナ",
        address: "神奈川県横浜市港北区新横浜3-10",
        prefecture: "神奈川県",
        region: "関東",
        latitude: 35.5094,
        longitude: 139.6048,
        capacity: 17000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "神戸ワールド記念ホール",
        address: "兵庫県神戸市中央区港島中町6-12-2",
        prefecture: "兵庫県",
        region: "近畿",
        latitude: 34.6614,
        longitude: 135.2122,
        capacity: 8000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "仙台サンプラザ",
        address: "宮城県仙台市宮城野区榴岡5-11-1",
        prefecture: "宮城県",
        region: "東北",
        latitude: 38.2622,
        longitude: 140.8823,
        capacity: 2710,
      },
    }),
    prisma.venue.create({
      data: {
        name: "ドルフィンズアリーナ",
        address: "愛知県名古屋市中区二の丸1-1",
        prefecture: "愛知県",
        region: "中部",
        latitude: 35.1815,
        longitude: 136.9066,
        capacity: 10000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "北海きたえーる",
        address: "北海道札幌市豊平区豊平5条11丁目1-1",
        prefecture: "北海道",
        region: "北海道",
        latitude: 43.0384,
        longitude: 141.3958,
        capacity: 10000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "広島サンプラザ",
        address: "広島県広島市西区商工センター3丁目1-1",
        prefecture: "広島県",
        region: "中国",
        latitude: 34.3785,
        longitude: 132.4148,
        capacity: 3000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "福岡国際センター",
        address: "福岡県福岡市博多区築港本町2-2",
        prefecture: "福岡県",
        region: "九州",
        latitude: 33.5968,
        longitude: 130.4015,
        capacity: 10000,
      },
    }),
    prisma.venue.create({
      data: {
        name: "新宿FACE",
        address: "東京都新宿区歌舞伎町1-20-1",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.694,
        longitude: 139.7005,
        capacity: 500,
      },
    }),
    prisma.venue.create({
      data: {
        name: "大田区総合体育館",
        address: "東京都大田区東蒲田1-11-1",
        prefecture: "東京都",
        region: "関東",
        latitude: 35.5701,
        longitude: 139.7202,
        capacity: 3000,
      },
    }),
  ]);

  const [
    tokyoDome,
    ryogoku,
    korakuen,
    osakaCastle,
    edion,
    budokan,
    yokohamaArena,
    kobeWorld,
    sendai,
    dolphins,
    kitaeru,
    hiroshima,
    fukuoka,
    shinjukuFace,
    ota,
  ] = venues;

  // === Events ===
  // Base date: today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function daysFromNow(days: number): Date {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d;
  }

  const events = [
    // Past events (completed)
    {
      name: "NEW JAPAN ROAD",
      date: daysFromNow(-12),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: njpw.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥7,500 / 自由席 ¥5,000",
      status: "completed",
    },
    {
      name: "NOAH the GLORY 2026",
      date: daysFromNow(-10),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: noah.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥6,800 / 自由席 ¥4,500",
      status: "completed",
    },
    {
      name: "DDT UNIVERSAL",
      date: daysFromNow(-7),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: ddt.id,
      venueId: shinjukuFace.id,
      ticketInfo: "全席指定 ¥4,500",
      status: "completed",
    },
    {
      name: "全日本プロレス チャンピオンカーニバル 開幕戦",
      date: daysFromNow(-5),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: ajpw.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,000",
      status: "completed",
    },
    // Upcoming events
    {
      name: "NEW JAPAN CUP 2026 1回戦",
      date: daysFromNow(2),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: njpw.id,
      venueId: korakuen.id,
      ticketInfo: "リングサイド ¥12,000 / 指定席 ¥8,000 / 自由席 ¥5,000",
    },
    {
      name: "スターダム NEW BLOOD",
      date: daysFromNow(3),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: stardom.id,
      venueId: shinjukuFace.id,
      ticketInfo: "全席指定 ¥5,500",
    },
    {
      name: "GLEAT G-REX vol.12",
      date: daysFromNow(4),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: gleat.id,
      venueId: shinjukuFace.id,
      ticketInfo: "指定席 ¥6,000 / 立見 ¥4,000",
    },
    {
      name: "ドラゴンゲート GATE OF DESTINY",
      date: daysFromNow(5),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: dragongate.id,
      venueId: kobeWorld.id,
      ticketInfo: "指定席A ¥8,000 / 指定席B ¥6,000 / 自由席 ¥4,500",
    },
    {
      name: "NEW JAPAN CUP 2026 2回戦",
      date: daysFromNow(7),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: njpw.id,
      venueId: korakuen.id,
      ticketInfo: "リングサイド ¥12,000 / 指定席 ¥8,000 / 自由席 ¥5,000",
    },
    {
      name: "NOAH NAVIGATE 2026",
      date: daysFromNow(8),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: noah.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,500",
    },
    {
      name: "DDT ピーターパン 2026",
      date: daysFromNow(10),
      startTime: "16:00",
      doorTime: "15:00",
      promotionId: ddt.id,
      venueId: ryogoku.id,
      ticketInfo: "リングサイド ¥15,000 / 指定席S ¥10,000 / 指定席A ¥7,000 / 自由席 ¥5,000",
    },
    {
      name: "全日本プロレス チャンピオンカーニバル 大阪大会",
      date: daysFromNow(12),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: ajpw.id,
      venueId: edion.id,
      ticketInfo: "指定席 ¥7,500 / 自由席 ¥4,500",
    },
    {
      name: "スターダム 5★STAR GP 開幕戦",
      date: daysFromNow(14),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: stardom.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥8,000 / 自由席 ¥5,500",
    },
    {
      name: "NEW JAPAN CUP 2026 準決勝",
      date: daysFromNow(16),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: njpw.id,
      venueId: ota.id,
      ticketInfo: "リングサイド ¥15,000 / 指定席S ¥10,000 / 指定席A ¥8,000",
    },
    {
      name: "GLEAT Ver.8",
      date: daysFromNow(17),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: gleat.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,500",
    },
    {
      name: "ドラゴンゲート TRUTH GATE",
      date: daysFromNow(18),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: dragongate.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,500",
    },
    {
      name: "NEW JAPAN CUP 2026 決勝",
      date: daysFromNow(21),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: njpw.id,
      venueId: ryogoku.id,
      ticketInfo: "リングサイド ¥20,000 / 指定席S ¥12,000 / 指定席A ¥9,000 / 自由席 ¥6,000",
    },
    {
      name: "NOAH GREAT VOYAGE in OSAKA",
      date: daysFromNow(23),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: noah.id,
      venueId: edion.id,
      ticketInfo: "指定席S ¥10,000 / 指定席A ¥7,500 / 自由席 ¥5,000",
    },
    {
      name: "全日本プロレス チャンピオンカーニバル 優勝決定戦",
      date: daysFromNow(25),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: ajpw.id,
      venueId: ryogoku.id,
      ticketInfo: "リングサイド ¥15,000 / 指定席S ¥10,000 / 指定席A ¥7,000",
    },
    {
      name: "スターダム 5★STAR GP 仙台大会",
      date: daysFromNow(28),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: stardom.id,
      venueId: sendai.id,
      ticketInfo: "指定席 ¥7,500 / 自由席 ¥5,000",
    },
    {
      name: "DDT LIVE! Maji Manji",
      date: daysFromNow(30),
      startTime: "19:00",
      doorTime: "18:30",
      promotionId: ddt.id,
      venueId: shinjukuFace.id,
      ticketInfo: "全席指定 ¥4,500",
    },
    {
      name: "新日本プロレス SAKURA GENESIS 2026",
      date: daysFromNow(35),
      startTime: "16:00",
      doorTime: "15:00",
      promotionId: njpw.id,
      venueId: yokohamaArena.id,
      ticketInfo: "リングサイド ¥25,000 / 指定席SS ¥15,000 / 指定席S ¥12,000 / 指定席A ¥9,000",
    },
    {
      name: "NOAH GREAT VOYAGE in NAGOYA",
      date: daysFromNow(38),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: noah.id,
      venueId: dolphins.id,
      ticketInfo: "指定席S ¥9,000 / 指定席A ¥7,000 / 自由席 ¥4,500",
    },
    {
      name: "ドラゴンゲート KOBE WORLD",
      date: daysFromNow(40),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: dragongate.id,
      venueId: kobeWorld.id,
      ticketInfo: "指定席S ¥9,000 / 指定席A ¥7,000 / 自由席 ¥5,000",
    },
    {
      name: "スターダム 5★STAR GP 名古屋大会",
      date: daysFromNow(42),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: stardom.id,
      venueId: dolphins.id,
      ticketInfo: "指定席S ¥9,000 / 指定席A ¥6,500 / 自由席 ¥4,500",
    },
    {
      name: "全日本プロレス 札幌大会",
      date: daysFromNow(45),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: ajpw.id,
      venueId: kitaeru.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,000",
    },
    {
      name: "GLEAT G-REX vol.13",
      date: daysFromNow(48),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: gleat.id,
      venueId: shinjukuFace.id,
      ticketInfo: "指定席 ¥6,000 / 立見 ¥4,000",
    },
    {
      name: "新日本プロレス BEST OF THE SUPER Jr. 開幕戦",
      date: daysFromNow(50),
      startTime: "18:30",
      doorTime: "17:30",
      promotionId: njpw.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥8,000 / 自由席 ¥5,000",
    },
    {
      name: "DDT 後楽園スペシャル",
      date: daysFromNow(52),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: ddt.id,
      venueId: korakuen.id,
      ticketInfo: "指定席 ¥6,500 / 自由席 ¥4,500",
    },
    {
      name: "NOAH DESTINATION 2026",
      date: daysFromNow(55),
      startTime: "16:00",
      doorTime: "15:00",
      promotionId: noah.id,
      venueId: budokan.id,
      ticketInfo: "リングサイド ¥20,000 / 指定席S ¥12,000 / 指定席A ¥9,000 / 自由席 ¥6,000",
    },
    {
      name: "スターダム 5★STAR GP 決勝戦",
      date: daysFromNow(60),
      startTime: "16:00",
      doorTime: "15:00",
      promotionId: stardom.id,
      venueId: ryogoku.id,
      ticketInfo: "リングサイド ¥15,000 / 指定席S ¥10,000 / 指定席A ¥7,500 / 自由席 ¥5,500",
    },
    {
      name: "新日本プロレス DOMINION",
      date: daysFromNow(65),
      startTime: "16:00",
      doorTime: "15:00",
      promotionId: njpw.id,
      venueId: osakaCastle.id,
      ticketInfo: "リングサイド ¥30,000 / 指定席SS ¥18,000 / 指定席S ¥14,000 / 指定席A ¥10,000",
    },
    {
      name: "ドラゴンゲート 広島大会",
      date: daysFromNow(68),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: dragongate.id,
      venueId: hiroshima.id,
      ticketInfo: "指定席 ¥7,000 / 自由席 ¥4,500",
    },
    {
      name: "全日本プロレス 福岡大会",
      date: daysFromNow(70),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: ajpw.id,
      venueId: fukuoka.id,
      ticketInfo: "指定席 ¥7,500 / 自由席 ¥4,500",
    },
    {
      name: "DDT SWEET DREAMS",
      date: daysFromNow(75),
      startTime: "17:00",
      doorTime: "16:00",
      promotionId: ddt.id,
      venueId: ota.id,
      ticketInfo: "リングサイド ¥12,000 / 指定席S ¥8,000 / 指定席A ¥6,000 / 自由席 ¥4,500",
    },
    // Cancelled event for demo
    {
      name: "GLEAT 大阪大会（中止）",
      date: daysFromNow(20),
      startTime: "18:00",
      doorTime: "17:00",
      promotionId: gleat.id,
      venueId: edion.id,
      ticketInfo: "払い戻し対応中",
      status: "cancelled",
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log(`Seeded ${promotions.length} promotions`);
  console.log(`Seeded ${venues.length} venues`);
  console.log(`Seeded ${events.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
