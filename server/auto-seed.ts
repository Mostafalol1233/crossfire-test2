import { connectMongoDB } from "./mongodb";
import {
  EventModel,
  NewsModel,
  AdminModel,
} from "@shared/mongodb-schema";
import { hashPassword } from "./utils/auth";

const EVENTS_DATA = [
  {
    title: "Grave Games Tournament",
    titleAr: "بطولة ألعاب القبور",
    description: "Join the ultimate CrossFire Grave Games tournament! Compete against the best players from around the world in this spine-chilling event.",
    descriptionAr: "انضم إلى بطولة CrossFire Grave Games النهائية! تنافس مع أفضل اللاعبين من جميع أنحاء العالم في هذا الحدث المثير.",
    date: "November 15-17, 2024",
    type: "Tournament",
    image: "https://files.catbox.moe/qu1s79.jpeg",
  },
  {
    title: "Weekend Party Event",
    titleAr: "حدث حفلة نهاية الأسبوع",
    description: "Double XP, special rewards, and exclusive weapon crates available all weekend long!",
    descriptionAr: "XP مضاعف، ومكافآت خاصة، وصناديق أسلحة حصرية متاحة طوال عطلة نهاية الأسبوع!",
    date: "November 8-10, 2024",
    type: "Special Event",
    image: "https://files.catbox.moe/7e3wr1.jpeg",
  },
  {
    title: "Sapphire Crates Launch",
    titleAr: "إطلاق صناديق الياقوت",
    description: "New Sapphire weapon crates are now available with exclusive legendary items!",
    descriptionAr: "صناديق أسلحة الياقوت الجديدة متاحة الآن مع عناصر أسطورية حصرية!",
    date: "November 1-30, 2024",
    type: "Limited Time",
    image: "https://files.catbox.moe/bwn5u2.jpeg",
  },
  {
    title: "Halloween Creative Contest",
    titleAr: "مسابقة الهالوين الإبداعية",
    description: "Submit your best CrossFire Halloween artwork for exclusive prizes and recognition!",
    descriptionAr: "قدم أفضل أعمالك الفنية للهالوين في كروس فاير للحصول على جوائز حصرية!",
    date: "October 15 - November 1, 2024",
    type: "Contest",
    image: "https://files.catbox.moe/44v7zb.jpeg",
  },
  {
    title: "CF Pass Season 5",
    titleAr: "الموسم الخامس من CF Pass",
    description: "Season 5 of CrossFire Pass is here with amazing rewards and challenges!",
    descriptionAr: "الموسم الخامس من CrossFire Pass هنا مع مكافآت وتحديات مذهلة!",
    date: "September 26 - December 26, 2024",
    type: "Season Pass",
    image: "https://files.catbox.moe/m8kp3d.jpeg",
  },
];

const NEWS_DATA = [
  {
    title: "Grave Games Event",
    titleAr: "حدث ألعاب القبور",
    dateRange: "October 20th - November 3rd",
    image: "https://files.catbox.moe/qu1s79.jpeg",
    category: "Event",
    content: "The spooky season continues with Grave Games! Join the tournament for exclusive Halloween rewards.",
    contentAr: "يستمر موسم الرعب مع ألعاب القبور! انضم إلى البطولة للحصول على مكافآت الهالوين الحصرية.",
    htmlContent: "<h2>Grave Games Event</h2><p>Compete in the ultimate Halloween tournament!</p>",
    author: "[GM]Xenon",
    featured: true,
  },
  {
    title: "Halloween Creative Contest",
    titleAr: "مسابقة الهالوين الإبداعية",
    dateRange: "October 15th - November 1st",
    image: "https://files.catbox.moe/44v7zb.jpeg",
    category: "Contest",
    content: "Show us your spooky side in our Halloween Creative Contest! Submit your best CrossFire-themed Halloween artwork for a chance to win exclusive prizes.",
    contentAr: "أظهر لنا جانبك المخيف في مسابقة الهالوين الإبداعية! قدم أفضل أعمالك الفنية بموضوع كروس فاير للهالوين للحصول على فرصة للفوز بجوائز حصرية.",
    htmlContent: "<h2>Halloween Creative Contest</h2><p>Show us your spooky side!</p>",
    author: "[GM]Xenon",
    featured: false,
  },
  {
    title: "Weekend Party Event",
    titleAr: "حدث حفلة نهاية الأسبوع",
    dateRange: "November 8th - 10th",
    image: "https://files.catbox.moe/7e3wr1.jpeg",
    category: "Event",
    content: "Party all weekend with double XP, special missions, and exclusive rewards!",
    contentAr: "احتفل طوال عطلة نهاية الأسبوع مع XP مضاعف ومهام خاصة ومكافآت حصرية!",
    htmlContent: "<h2>Weekend Party</h2><p>Double XP all weekend!</p>",
    author: "[GM]Xenon",
    featured: false,
  },
  {
    title: "Sapphire Crates Now Available",
    titleAr: "صناديق الياقوت متاحة الآن",
    dateRange: "November 1st - 30th",
    image: "https://files.catbox.moe/bwn5u2.jpeg",
    category: "Shop",
    content: "New Sapphire weapon crates featuring legendary items are now in the CF Shop!",
    contentAr: "صناديق أسلحة الياقوت الجديدة التي تحتوي على عناصر أسطورية متاحة الآن في متجر CF!",
    htmlContent: "<h2>Sapphire Crates</h2><p>Legendary weapons await!</p>",
    author: "[GM]Saidin",
    featured: false,
  },
  {
    title: "CF Shop Updates",
    titleAr: "تحديثات متجر CF",
    dateRange: "October 8th",
    image: "https://files.catbox.moe/6xm8p5.jpeg",
    category: "Shop",
    content: "Check out the latest additions to the CrossFire Shop with new weapons and items!",
    contentAr: "تحقق من أحدث الإضافات إلى متجر CrossFire مع أسلحة وعناصر جديدة!",
    htmlContent: "<h2>CF Shop Updates</h2><p>New items available!</p>",
    author: "[GM]Kanadian",
    featured: false,
  },
  {
    title: "CFS Super Fans Announcement",
    titleAr: "إعلان CFS سوبر فانز",
    dateRange: "October 22nd - November 4th",
    image: "https://files.catbox.moe/u3m7k9.jpeg",
    category: "News",
    content: "Join the CFS Super Fans program and get exclusive rewards for your dedication!",
    contentAr: "انضم إلى برنامج CFS Super Fans واحصل على مكافآت حصرية لتفانيك!",
    htmlContent: "<h2>CFS Super Fans</h2><p>Exclusive rewards for dedicated fans!</p>",
    author: "[GM]Xenon",
    featured: false,
  },
];

async function seedDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectMongoDB();
    console.log("✅ Connected to MongoDB\n");

    // Seed Events (only if empty or to update)
    const eventCount = await EventModel.countDocuments();
    console.log(`📅 Current events in database: ${eventCount}`);
    
    if (eventCount === 0) {
      console.log("🌱 Seeding events...");
      await EventModel.insertMany(EVENTS_DATA);
      console.log(`✅ Added ${EVENTS_DATA.length} events\n`);
    } else {
      console.log("⏭️  Events already exist, skipping event seeding\n");
    }

    // Seed News (only if empty or to update)
    const newsCount = await NewsModel.countDocuments();
    console.log(`📰 Current news items in database: ${newsCount}`);
    
    if (newsCount === 0) {
      console.log("🌱 Seeding news...");
      await NewsModel.insertMany(NEWS_DATA);
      console.log(`✅ Added ${NEWS_DATA.length} news items\n`);
    } else {
      console.log("⏭️  News already exists, skipping news seeding\n");
    }

    // Ensure default admin exists
    const adminCount = await AdminModel.countDocuments();
    console.log(`👤 Current admins in database: ${adminCount}`);
    
    if (adminCount === 0) {
      console.log("🌱 Creating default admin...");
      const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
      const hashedPassword = await hashPassword(defaultPassword);
      
      await AdminModel.create({
        username: "admin",
        password: hashedPassword,
        role: "super_admin",
      });
      console.log("✅ Default admin created (username: admin)\n");
      console.log(`⚠️  Default password: ${defaultPassword}`);
      console.log("⚠️  Please change this password in production!\n");
    } else {
      console.log("⏭️  Admins already exist, skipping admin creation\n");
    }

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

// Auto-run on startup in development
if (process.env.NODE_ENV === "development" && process.env.AUTO_SEED === "true") {
  seedDatabase();
}

export { seedDatabase };
