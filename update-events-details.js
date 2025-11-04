import mongoose from 'mongoose';
import fs from 'fs';

const mapping = JSON.parse(fs.readFileSync('catbox-mapping.json', 'utf8'));
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

const EventSchema = new mongoose.Schema({
  title: String,
  titleAr: String,
  description: String,
  descriptionAr: String,
  date: String,
  type: String,
  image: String
});

const EventModel = mongoose.model('Event', EventSchema);

// Enhanced event data with Catbox images
const eventsData = [
  {
    title: "Grave Games Tournament",
    image: "https://files.catbox.moe/qu1s79.jpeg",
    description: `<div class="event-details">
<h2>Grave Games Tournament</h2>
<p>Join the ultimate CrossFire Grave Games tournament! Compete against the best players from around the world in this spine-chilling event.</p>

<h3>Event Features:</h3>
<ul>
<li>Competitive ranked matches with exclusive rewards</li>
<li>Special Halloween-themed weapon skins and character items</li>
<li>Limited-time missions with unique challenges</li>
<li>Grand prize for top performers</li>
</ul>

<h3>How to Participate:</h3>
<ol>
<li>Log in during the event period (October 20 - November 3, 2024)</li>
<li>Complete daily missions to earn event points</li>
<li>Participate in special event matches</li>
<li>Climb the leaderboard to win exclusive prizes</li>
</ol>

<h3>Rewards Include:</h3>
<ul>
<li>Grave Games exclusive weapon crates</li>
<li>Character costume pieces</li>
<li>XP boosters and in-game currency</li>
<li>Rare collectible items</li>
</ul>
</div>`,
    descriptionAr: `<div dir="rtl" class="event-details">
<h2>بطولة ألعاب القبور</h2>
<p>انضم إلى بطولة CrossFire Grave Games النهائية! تنافس مع أفضل اللاعبين من جميع أنحاء العالم في هذا الحدث المثير.</p>

<h3>مميزات الحدث:</h3>
<ul>
<li>مباريات تنافسية مصنفة مع مكافآت حصرية</li>
<li>أشكال أسلحة وعناصر شخصيات خاصة بموضوع الهالوين</li>
<li>مهام محدودة الوقت مع تحديات فريدة</li>
<li>جائزة كبرى لأفضل اللاعبين</li>
</ul>

<h3>كيفية المشاركة:</h3>
<ol>
<li>سجل الدخول خلال فترة الحدث (20 أكتوبر - 3 نوفمبر 2024)</li>
<li>أكمل المهام اليومية لكسب نقاط الحدث</li>
<li>شارك في مباريات الحدث الخاصة</li>
<li>تسلق لوحة المتصدرين للفوز بجوائز حصرية</li>
</ol>

<h3>المكافآت تشمل:</h3>
<ul>
<li>صناديق الأسلحة الحصرية لألعاب القبور</li>
<li>قطع أزياء الشخصيات</li>
<li>معززات XP والعملة داخل اللعبة</li>
<li>عناصر قابلة للتحصيل نادرة</li>
</ul>
</div>`
  },
  {
    title: "Halloween Special Event",
    image: "https://files.catbox.moe/44v7zb.jpeg",
    description: `<div class="event-details">
<h2>Halloween Special Event</h2>
<p>Get ready for a spooky adventure! Our Halloween Special Event brings exclusive themed content and terrifying rewards.</p>

<h3>Special Features:</h3>
<ul>
<li>Halloween-themed maps with spooky decorations</li>
<li>Limited edition Halloween weapon skins</li>
<li>Special zombie modes and challenges</li>
<li>Exclusive Halloween character costumes</li>
</ul>

<h3>Event Missions:</h3>
<ul>
<li>Complete daily Halloween challenges</li>
<li>Participate in special zombie survival modes</li>
<li>Collect candy tokens for exclusive rewards</li>
<li>Win Halloween crates with rare items</li>
</ul>
</div>`,
    descriptionAr: `<div dir="rtl" class="event-details">
<h2>حدث الهالوين الخاص</h2>
<p>استعد لمغامرة مخيفة! يجلب حدث الهالوين الخاص محتوى حصريًا ومكافآت مرعبة.</p>

<h3>المميزات الخاصة:</h3>
<ul>
<li>خرائط بموضوع الهالوين مع ديكورات مخيفة</li>
<li>أشكال أسلحة محدودة الإصدار للهالوين</li>
<li>أوضاع وتحديات زومبي خاصة</li>
<li>أزياء شخصيات الهالوين الحصرية</li>
</ul>

<h3>مهام الحدث:</h3>
<ul>
<li>أكمل تحديات الهالوين اليومية</li>
<li>شارك في أوضاع البقاء على قيد الحياة الخاصة بالزومبي</li>
<li>اجمع رموز الحلوى للحصول على مكافآت حصرية</li>
<li>اربح صناديق الهالوين بعناصر نادرة</li>
</ul>
</div>`
  },
  {
    title: "Weekend Warrior Challenge",
    image: "https://files.catbox.moe/vnkb9u.jpeg",
    description: `<div class="event-details">
<h2>Weekend Warrior Challenge</h2>
<p>Every weekend is a celebration in CrossFire! Join the Weekend Warrior Challenge for double XP and exclusive rewards.</p>

<h3>Weekend Bonuses:</h3>
<ul>
<li>2x Experience Points on all matches</li>
<li>Bonus GP (Game Points) for wins</li>
<li>Special weekend-only crates</li>
<li>Increased drop rates for rare items</li>
</ul>

<h3>How It Works:</h3>
<p>Simply log in and play during weekends (Saturday & Sunday) to automatically receive bonuses. The more you play, the more you earn!</p>

<h3>Weekly Challenges:</h3>
<ul>
<li>Win 10 matches for a special crate</li>
<li>Complete 50 kills for bonus GP</li>
<li>Play 20 matches for an XP booster</li>
</ul>
</div>`,
    descriptionAr: `<div dir="rtl" class="event-details">
<h2>تحدي محارب عطلة نهاية الأسبوع</h2>
<p>كل عطلة نهاية أسبوع هي احتفال في CrossFire! انضم إلى تحدي محارب عطلة نهاية الأسبوع للحصول على تجربة مضاعفة ومكافآت حصرية.</p>

<h3>مكافآت نهاية الأسبوع:</h3>
<ul>
<li>ضعف نقاط الخبرة في جميع المباريات</li>
<li>نقاط لعبة إضافية (GP) للانتصارات</li>
<li>صناديق خاصة بعطلة نهاية الأسبوع فقط</li>
<li>زيادة معدلات إسقاط العناصر النادرة</li>
</ul>

<h3>كيف يعمل:</h3>
<p>ببساطة سجل الدخول والعب خلال عطلات نهاية الأسبوع (السبت والأحد) لتلقي المكافآت تلقائيًا. كلما لعبت أكثر، كلما ربحت أكثر!</p>

<h3>التحديات الأسبوعية:</h3>
<ul>
<li>اربح 10 مباريات للحصول على صندوق خاص</li>
<li>أكمل 50 قتلة للحصول على نقاط لعبة إضافية</li>
<li>العب 20 مباراة للحصول على معزز XP</li>
</ul>
</div>`
  },
  {
    title: "Mystic Market Opening",
    image: "https://files.catbox.moe/45x39k.jpeg",
    description: `<div class="event-details">
<h2>Mystic Market Opening</h2>
<p>The legendary Mystic Market has opened its doors! Discover rare weapons, exclusive items, and limited-time offers.</p>

<h3>Market Highlights:</h3>
<ul>
<li>Rare weapon blueprints and skins</li>
<li>Exclusive character customization items</li>
<li>Limited edition collectibles</li>
<li>Special bundle deals</li>
</ul>

<h3>How to Shop:</h3>
<ol>
<li>Visit the Mystic Market tab in the game</li>
<li>Browse available items and bundles</li>
<li>Use your earned GP or purchase with ZP</li>
<li>Items available only during market opening period</li>
</ol>

<h3>Featured Items:</h3>
<ul>
<li>Sapphire Weapon Collection</li>
<li>Mythical Character Skins</li>
<li>Ancient Artifacts Collection</li>
<li>Premium Enhancement Materials</li>
</ul>
</div>`,
    descriptionAr: `<div dir="rtl" class="event-details">
<h2>افتتاح السوق الغامض</h2>
<p>فتح السوق الغامض الأسطوري أبوابه! اكتشف الأسلحة النادرة والعناصر الحصرية والعروض محدودة الوقت.</p>

<h3>أبرز معالم السوق:</h3>
<ul>
<li>مخططات وأشكال الأسلحة النادرة</li>
<li>عناصر تخصيص الشخصيات الحصرية</li>
<li>مقتنيات محدودة الإصدار</li>
<li>صفقات حزم خاصة</li>
</ul>

<h3>كيفية التسوق:</h3>
<ol>
<li>قم بزيارة علامة التبويب السوق الغامض في اللعبة</li>
<li>تصفح العناصر والحزم المتاحة</li>
<li>استخدم نقاط اللعبة المكتسبة أو الشراء بـ ZP</li>
<li>العناصر متاحة فقط خلال فترة فتح السوق</li>
</ol>

<h3>العناصر المميزة:</h3>
<ul>
<li>مجموعة أسلحة الياقوت</li>
<li>أشكال الشخصيات الأسطورية</li>
<li>مجموعة القطع الأثرية القديمة</li>
<li>مواد التحسين المتميزة</li>
</ul>
</div>`
  }
];

async function main() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('\n📅 Updating Events with detailed information...');
    
    for (const eventData of eventsData) {
      const event = await EventModel.findOne({ title: eventData.title });
      
      if (event) {
        event.image = eventData.image;
        event.description = eventData.description;
        event.descriptionAr = eventData.descriptionAr;
        await event.save();
        console.log(`  ✅ Updated: ${event.title}`);
      } else {
        console.log(`  ⚠️  Not found: ${eventData.title}`);
      }
    }
    
    console.log('\n✅ Events updated successfully!');
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
