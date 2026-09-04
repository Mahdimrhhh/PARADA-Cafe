import type { Sql } from "@/lib/db";
import { createHash } from "node:crypto";

function hashPin(pin: string): string {
  return createHash("sha256").update(pin).digest("hex");
}

type SeedCategory = {
  slug: string;
  nameFa: string;
  nameEn: string;
  sortOrder: number;
  iconKey: string;
};

type SeedItem = {
  categorySlug: string;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  priceToman: number;
  imageUrl: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  sortOrder: number;
};

const CATEGORIES: SeedCategory[] = [
  { slug: "espresso", nameFa: "اسپرسو بار", nameEn: "Espresso Bar", sortOrder: 1, iconKey: "espresso" },
  { slug: "milk", nameFa: "بر پایهٔ شیر", nameEn: "Milk Bar", sortOrder: 2, iconKey: "milk" },
  { slug: "cold", nameFa: "سرد و آیس", nameEn: "Cold", sortOrder: 3, iconKey: "cold" },
  { slug: "tea", nameFa: "چای و دمنوش", nameEn: "Tea", sortOrder: 4, iconKey: "tea" },
  { slug: "pastry", nameFa: "شیرینی خانه", nameEn: "Pastry", sortOrder: 5, iconKey: "pastry" },
  { slug: "breakfast", nameFa: "صبحانه پارادا", nameEn: "Breakfast", sortOrder: 6, iconKey: "breakfast" },
];

const ITEMS: SeedItem[] = [
  { categorySlug: "espresso", nameFa: "اسپرسو", nameEn: "Espresso", descriptionFa: "شات خالص، کرمای مخملی و پایان شکلاتی.", priceToman: 95000, imageUrl: "/menu/espresso.jpg", isFeatured: true, sortOrder: 1 },
  { categorySlug: "espresso", nameFa: "اسپرسو دبل", nameEn: "Doppio", descriptionFa: "دو شات برای کسانی که توقف کوتاه‌تری می‌خواهند.", priceToman: 120000, imageUrl: null, sortOrder: 2 },
  { categorySlug: "espresso", nameFa: "ریسترتو", nameEn: "Ristretto", descriptionFa: "عصارهٔ کوتاه‌تر، شیرین‌تر و غلیظ‌تر.", priceToman: 95000, imageUrl: null, sortOrder: 3 },
  { categorySlug: "espresso", nameFa: "لونگو", nameEn: "Lungo", descriptionFa: "عصارهٔ بلندتر با بدنه‌ای کشیده‌تر.", priceToman: 100000, imageUrl: null, sortOrder: 4 },
  { categorySlug: "espresso", nameFa: "آمریکانو", nameEn: "Americano", descriptionFa: "اسپرسو و آب داغ؛ تمیز و مستقیم.", priceToman: 110000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "espresso", nameFa: "آمریکانو دبل", nameEn: "Americano Doppio", descriptionFa: "دو شات، همان سکوت آمریکانو با قدرت بیشتر.", priceToman: 135000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "espresso", nameFa: "اسپرسو ماکیاتو", nameEn: "Espresso Macchiato", descriptionFa: "شات نشان‌خورده با لکه‌ای از شیر بافت‌دار.", priceToman: 115000, imageUrl: null, sortOrder: 7 },
  { categorySlug: "espresso", nameFa: "کورتادو", nameEn: "Cortado", descriptionFa: "تعادل برابر اسپرسو و شیر گرم، بدون شیرینی اضافه.", priceToman: 140000, imageUrl: null, sortOrder: 8 },
  { categorySlug: "espresso", nameFa: "پیکولو", nameEn: "Piccolo", descriptionFa: "لاتهٔ مینیاتوری روی ریسترتو.", priceToman: 135000, imageUrl: null, isNew: true, sortOrder: 9 },
  { categorySlug: "espresso", nameFa: "وی ۶۰", nameEn: "V60", descriptionFa: "دمی فیلتری، روشن و گل‌دار. از باریستا بپرسید امروز چه می‌ریزد.", priceToman: 185000, imageUrl: "/menu/v60.jpg", isFeatured: true, sortOrder: 10 },

  { categorySlug: "milk", nameFa: "لاته", nameEn: "Latte", descriptionFa: "اسپرسو، شیر مخملی و هنر روی فنجان.", priceToman: 165000, imageUrl: "/menu/latte.jpg", isFeatured: true, sortOrder: 1 },
  { categorySlug: "milk", nameFa: "کاپوچینو", nameEn: "Cappuccino", descriptionFa: "یک‌سوم اسپرسو، شیر و کف؛ کلاسیک ایتالیایی.", priceToman: 155000, imageUrl: "/menu/cappuccino.jpg", isFeatured: true, sortOrder: 2 },
  { categorySlug: "milk", nameFa: "فلت وایت", nameEn: "Flat White", descriptionFa: "بافت ریزتر، نسبت قهوه بالاتر از لاته.", priceToman: 165000, imageUrl: "/menu/flat-white.jpg", sortOrder: 3 },
  { categorySlug: "milk", nameFa: "موکا", nameEn: "Mocha", descriptionFa: "اسپرسو، شکلات تلخ و شیر.", priceToman: 175000, imageUrl: null, sortOrder: 4 },
  { categorySlug: "milk", nameFa: "کارامل ماکیاتو", nameEn: "Caramel Macchiato", descriptionFa: "وانیل، شیر، اسپرسو و رگهٔ کارامل.", priceToman: 180000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "milk", nameFa: "وانیل لاته", nameEn: "Vanilla Latte", descriptionFa: "لاته با وانیل طبیعی.", priceToman: 175000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "milk", nameFa: "فندق لاته", nameEn: "Hazelnut Latte", descriptionFa: "فندق بوداده روی بستر اسپرسو.", priceToman: 175000, imageUrl: null, sortOrder: 7 },
  { categorySlug: "milk", nameFa: "دارچین لاته", nameEn: "Cinnamon Latte", descriptionFa: "دارچین تازه سابیده‌شده، گرم و خاکی.", priceToman: 170000, imageUrl: null, sortOrder: 8 },
  { categorySlug: "milk", nameFa: "لاته شیر بادام", nameEn: "Almond Latte", descriptionFa: "بدون لبنیات؛ شیر بادام و اسپرسو.", priceToman: 180000, imageUrl: null, sortOrder: 9 },
  { categorySlug: "milk", nameFa: "موکا سفید", nameEn: "White Mocha", descriptionFa: "شکلات سفید، شیر و شات اسپرسو.", priceToman: 180000, imageUrl: null, isNew: true, sortOrder: 10 },

  { categorySlug: "cold", nameFa: "آیس لاته", nameEn: "Iced Latte", descriptionFa: "اسپرسو روی یخ و شیر سرد.", priceToman: 175000, imageUrl: "/menu/iced-latte.jpg", isFeatured: true, sortOrder: 1 },
  { categorySlug: "cold", nameFa: "آیس آمریکانو", nameEn: "Iced Americano", descriptionFa: "اسپرسو، آب سرد و یخ شفاف.", priceToman: 125000, imageUrl: null, sortOrder: 2 },
  { categorySlug: "cold", nameFa: "کلد برو", nameEn: "Cold Brew", descriptionFa: "عصارهٔ سردِ ۱۶ ساعته؛ نرم و کم‌اسیدی.", priceToman: 185000, imageUrl: "/menu/cold-brew.jpg", isFeatured: true, sortOrder: 3 },
  { categorySlug: "cold", nameFa: "آفوگاتو", nameEn: "Affogato", descriptionFa: "ژلاتو وانیل غرق در شات داغ اسپرسو.", priceToman: 195000, imageUrl: "/menu/affogato.jpg", isFeatured: true, isNew: true, sortOrder: 4 },
  { categorySlug: "cold", nameFa: "آیس موکا", nameEn: "Iced Mocha", descriptionFa: "شکلات، اسپرسو، شیر و یخ.", priceToman: 185000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "cold", nameFa: "آیس کارامل", nameEn: "Iced Caramel", descriptionFa: "لاتهٔ سرد با کارامل نمکی.", priceToman: 185000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "cold", nameFa: "اسپرسو تونیک", nameEn: "Espresso Tonic", descriptionFa: "تونیک تلخ، اسپرسو و پوست پرتقال.", priceToman: 175000, imageUrl: null, isNew: true, sortOrder: 7 },
  { categorySlug: "cold", nameFa: "شیک وانیل", nameEn: "Vanilla Shake", descriptionFa: "بستنی وانیل، شیر و یک شات در صورت تمایل.", priceToman: 210000, imageUrl: null, sortOrder: 8 },
  { categorySlug: "cold", nameFa: "شیک شکلات", nameEn: "Chocolate Shake", descriptionFa: "شکلات تلخ و بستنی، غلیظ و سرد.", priceToman: 210000, imageUrl: null, sortOrder: 9 },
  { categorySlug: "cold", nameFa: "فراپه", nameEn: "Frappe", descriptionFa: "قهوهٔ یخی همزده با کف سبک.", priceToman: 200000, imageUrl: null, sortOrder: 10 },

  { categorySlug: "tea", nameFa: "چای سیاه ایرانی", nameEn: "Persian Black Tea", descriptionFa: "دم‌شده در قوری، با نبات یا بدون.", priceToman: 85000, imageUrl: null, sortOrder: 1 },
  { categorySlug: "tea", nameFa: "چای ماسالا", nameEn: "Masala Chai", descriptionFa: "ادویهٔ گرم، شیر و چای سیاه.", priceToman: 145000, imageUrl: null, isFeatured: true, sortOrder: 2 },
  { categorySlug: "tea", nameFa: "چای سبز", nameEn: "Green Tea", descriptionFa: "دم ملایم، عطر چمن و مغز.", priceToman: 95000, imageUrl: null, sortOrder: 3 },
  { categorySlug: "tea", nameFa: "دمنوش بابونه", nameEn: "Chamomile", descriptionFa: "آرام، گل‌دار، برای توقف طولانی‌تر.", priceToman: 110000, imageUrl: null, sortOrder: 4 },
  { categorySlug: "tea", nameFa: "دمنوش نعنا", nameEn: "Mint Tisane", descriptionFa: "نعنای تازه، روشن و خنک.", priceToman: 110000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "tea", nameFa: "گل‌گاوزبان", nameEn: "Gol Gavzaban", descriptionFa: "سنتی ایرانی با لیمو عمانی.", priceToman: 120000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "tea", nameFa: "چای ترش", nameEn: "Hibiscus", descriptionFa: "ترش و یاقوتی، گرم یا سرد.", priceToman: 110000, imageUrl: null, sortOrder: 7 },
  { categorySlug: "tea", nameFa: "هات چاکلت", nameEn: "Hot Chocolate", descriptionFa: "شکلات واقعی، نه پودر آماده.", priceToman: 165000, imageUrl: null, isFeatured: true, sortOrder: 8 },
  { categorySlug: "tea", nameFa: "ماچا لاته", nameEn: "Matcha Latte", descriptionFa: "ماچای سنگ‌ساب، شیر بافت‌دار.", priceToman: 185000, imageUrl: "/menu/matcha.jpg", isFeatured: true, isNew: true, sortOrder: 9 },
  { categorySlug: "tea", nameFa: "چای سفید", nameEn: "White Tea", descriptionFa: "برگ ظریف، عطر کم‌رنگ و شیرین.", priceToman: 130000, imageUrl: null, sortOrder: 10 },

  { categorySlug: "pastry", nameFa: "کروسان کره‌ای", nameEn: "Butter Croissant", descriptionFa: "لایه‌لایه، تازه از فر صبح.", priceToman: 145000, imageUrl: "/menu/croissant.jpg", isFeatured: true, sortOrder: 1 },
  { categorySlug: "pastry", nameFa: "کروسان شکلات", nameEn: "Pain au Chocolat", descriptionFa: "همان خمیر هزارلا با شکلات تلخ.", priceToman: 165000, imageUrl: null, sortOrder: 2 },
  { categorySlug: "pastry", nameFa: "چیزکیک", nameEn: "Cheesecake", descriptionFa: "برش خامه‌ای روی بیسکویت کره‌ای.", priceToman: 195000, imageUrl: null, isFeatured: true, sortOrder: 3 },
  { categorySlug: "pastry", nameFa: "براونی", nameEn: "Brownie", descriptionFa: "وسط فاج‌مانند، رویه ترک‌خورده.", priceToman: 165000, imageUrl: null, sortOrder: 4 },
  { categorySlug: "pastry", nameFa: "کوکی شکلات", nameEn: "Chocolate Cookie", descriptionFa: "لبه ترد، مغز نرم، شکلات قطعه‌قطعه.", priceToman: 95000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "pastry", nameFa: "کیک هویج", nameEn: "Carrot Cake", descriptionFa: "ادویهٔ گرم و فراستینگ پنیر.", priceToman: 175000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "pastry", nameFa: "تارت لیمو", nameEn: "Lemon Tart", descriptionFa: "ترش روشن روی خمیر شنی.", priceToman: 185000, imageUrl: null, isNew: true, sortOrder: 7 },
  { categorySlug: "pastry", nameFa: "رول دارچین", nameEn: "Cinnamon Roll", descriptionFa: "خمیر نرم، دارچین و لعاب وانیل.", priceToman: 155000, imageUrl: null, sortOrder: 8 },
  { categorySlug: "pastry", nameFa: "تیرامیسو", nameEn: "Tiramisu", descriptionFa: "ماسکارپونه، لیدی‌فینگر و اسپرسو.", priceToman: 210000, imageUrl: null, isFeatured: true, sortOrder: 9 },
  { categorySlug: "pastry", nameFa: "کوکی نمکی", nameEn: "Sea Salt Cookie", descriptionFa: "کره، شکلات و پولک نمک دریا.", priceToman: 95000, imageUrl: null, sortOrder: 10 },

  { categorySlug: "breakfast", nameFa: "صبحانه پارادا", nameEn: "Parada Breakfast", descriptionFa: "تخم‌مرغ، پنیر، گردو، سبزی، خیار و گوجه‌فرنگی، نان گرم.", priceToman: 385000, imageUrl: null, isFeatured: true, sortOrder: 1 },
  { categorySlug: "breakfast", nameFa: "املت ساده", nameEn: "Plain Omelette", descriptionFa: "سه تخم‌مرغ، کره، نان تست.", priceToman: 245000, imageUrl: null, sortOrder: 2 },
  { categorySlug: "breakfast", nameFa: "املت قارچ", nameEn: "Mushroom Omelette", descriptionFa: "قارچ تفت‌داده با تخم‌مرغ و پنیر.", priceToman: 275000, imageUrl: null, sortOrder: 3 },
  { categorySlug: "breakfast", nameFa: "تست آووکادو", nameEn: "Avocado Toast", descriptionFa: "نان ترش، آووکادو کوبیده، روغن زیتون و فلفل.", priceToman: 295000, imageUrl: null, isFeatured: true, isNew: true, sortOrder: 4 },
  { categorySlug: "breakfast", nameFa: "پنکیک عسل", nameEn: "Honey Pancake", descriptionFa: "سه‌لایه، عسل و کره.", priceToman: 265000, imageUrl: null, sortOrder: 5 },
  { categorySlug: "breakfast", nameFa: "گرانولا و ماست", nameEn: "Granola Yogurt", descriptionFa: "ماست چکیده، گرانولای خانه، میوهٔ فصل.", priceToman: 225000, imageUrl: null, sortOrder: 6 },
  { categorySlug: "breakfast", nameFa: "فرنچ تست", nameEn: "French Toast", descriptionFa: "نان خیس‌خورده در تخم‌مرغ، دارچین و شیره.", priceToman: 255000, imageUrl: null, sortOrder: 7 },
  { categorySlug: "breakfast", nameFa: "وافل", nameEn: "Waffle", descriptionFa: "وافل ترد با عسل یا شکلات.", priceToman: 245000, imageUrl: null, sortOrder: 8 },
  { categorySlug: "breakfast", nameFa: "نیمرو با نان", nameEn: "Fried Eggs", descriptionFa: "دو عدد نیمرو، کره، نان سنگک یا تست.", priceToman: 195000, imageUrl: null, sortOrder: 9 },
  { categorySlug: "breakfast", nameFa: "املت سبزیجات", nameEn: "Veggie Omelette", descriptionFa: "فلفل، گوجه، اسفناج و تخم‌مرغ.", priceToman: 265000, imageUrl: null, sortOrder: 10 },
];

export async function seedMenu(sql: Sql): Promise<void> {
  await sql`
    insert into cafe_settings (key, value) values
      ('admin_pin', ${hashPin("parada")}),
      ('cafe_name', 'PARADA'),
      ('tagline_fa', 'توقفگاه'),
      ('tagline_en', 'a place to pause')
    on conflict (key) do nothing
  `;

  for (const category of CATEGORIES) {
    await sql`
      insert into categories (slug, name_fa, name_en, sort_order, icon_key)
      values (
        ${category.slug},
        ${category.nameFa},
        ${category.nameEn},
        ${category.sortOrder},
        ${category.iconKey}
      )
    `;
  }

  const rows = await sql<{ id: number; slug: string }>`
    select id, slug from categories
  `;
  const idBySlug = new Map(rows.map((row) => [row.slug, row.id]));

  for (const item of ITEMS) {
    const categoryId = idBySlug.get(item.categorySlug);
    if (categoryId == null) continue;
    await sql`
      insert into items (
        category_id,
        name_fa,
        name_en,
        description_fa,
        price_toman,
        image_url,
        is_available,
        is_featured,
        is_new,
        sort_order
      )
      values (
        ${categoryId},
        ${item.nameFa},
        ${item.nameEn},
        ${item.descriptionFa},
        ${item.priceToman},
        ${item.imageUrl},
        ${true},
        ${item.isFeatured ?? false},
        ${item.isNew ?? false},
        ${item.sortOrder}
      )
    `;
  }
}
