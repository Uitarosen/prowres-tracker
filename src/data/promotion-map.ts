// Puwota上の団体名 → DBのslugへのマッピング
// Puwotaでは英語名で表示されるため、各バリエーションをカバー

export const PROMOTION_NAME_TO_SLUG: Record<string, string> = {
  // 新日本プロレス
  "New Japan": "njpw",
  "NJPW": "njpw",
  "New Japan Pro-Wrestling": "njpw",

  // 全日本プロレス
  "All Japan": "ajpw",
  "AJPW": "ajpw",
  "All Japan Pro Wrestling": "ajpw",

  // プロレスリング・ノア
  "Noah": "noah",
  "NOAH": "noah",
  "Pro Wrestling Noah": "noah",

  // DDTプロレスリング
  "DDT": "ddt",
  "DDT Pro-Wrestling": "ddt",

  // スターダム
  "Stardom": "stardom",
  "STARDOM": "stardom",

  // GLEAT
  "GLEAT": "gleat",
  "Gleat": "gleat",

  // ドラゴンゲート
  "Dragon Gate": "dragongate",
  "DRAGON GATE": "dragongate",
  "Dragongate": "dragongate",
};

// 都道府県の英語名 → 日本語名マッピング
export const PREFECTURE_EN_TO_JA: Record<string, string> = {
  "Hokkaido": "北海道",
  "Aomori": "青森県",
  "Iwate": "岩手県",
  "Miyagi": "宮城県",
  "Akita": "秋田県",
  "Yamagata": "山形県",
  "Fukushima": "福島県",
  "Ibaraki": "茨城県",
  "Tochigi": "栃木県",
  "Gunma": "群馬県",
  "Saitama": "埼玉県",
  "Chiba": "千葉県",
  "Tokyo": "東京都",
  "Kanagawa": "神奈川県",
  "Niigata": "新潟県",
  "Toyama": "富山県",
  "Ishikawa": "石川県",
  "Fukui": "福井県",
  "Yamanashi": "山梨県",
  "Nagano": "長野県",
  "Gifu": "岐阜県",
  "Shizuoka": "静岡県",
  "Aichi": "愛知県",
  "Mie": "三重県",
  "Shiga": "滋賀県",
  "Kyoto": "京都府",
  "Osaka": "大阪府",
  "Hyogo": "兵庫県",
  "Nara": "奈良県",
  "Wakayama": "和歌山県",
  "Tottori": "鳥取県",
  "Shimane": "島根県",
  "Okayama": "岡山県",
  "Hiroshima": "広島県",
  "Yamaguchi": "山口県",
  "Tokushima": "徳島県",
  "Kagawa": "香川県",
  "Ehime": "愛媛県",
  "Kochi": "高知県",
  "Fukuoka": "福岡県",
  "Saga": "佐賀県",
  "Nagasaki": "長崎県",
  "Kumamoto": "熊本県",
  "Oita": "大分県",
  "Miyazaki": "宮崎県",
  "Kagoshima": "鹿児島県",
  "Okinawa": "沖縄県",
};

// 都道府県 → 地域マッピング
export const PREFECTURE_TO_REGION: Record<string, string> = {
  "北海道": "北海道",
  "青森県": "東北", "岩手県": "東北", "宮城県": "東北", "秋田県": "東北", "山形県": "東北", "福島県": "東北",
  "茨城県": "関東", "栃木県": "関東", "群馬県": "関東", "埼玉県": "関東", "千葉県": "関東", "東京都": "関東", "神奈川県": "関東",
  "新潟県": "中部", "富山県": "中部", "石川県": "中部", "福井県": "中部", "山梨県": "中部", "長野県": "中部", "岐阜県": "中部", "静岡県": "中部", "愛知県": "中部", "三重県": "中部",
  "滋賀県": "近畿", "京都府": "近畿", "大阪府": "近畿", "兵庫県": "近畿", "奈良県": "近畿", "和歌山県": "近畿",
  "鳥取県": "中国", "島根県": "中国", "岡山県": "中国", "広島県": "中国", "山口県": "中国",
  "徳島県": "四国", "香川県": "四国", "愛媛県": "四国", "高知県": "四国",
  "福岡県": "九州", "佐賀県": "九州", "長崎県": "九州", "熊本県": "九州", "大分県": "九州", "宮崎県": "九州", "鹿児島県": "九州", "沖縄県": "九州",
};
