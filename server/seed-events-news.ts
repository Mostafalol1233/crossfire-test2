import { storage } from "./storage";

// أحداث جديدة Events
const newEvents = [
  {
    title: "Witchcraft Weekends - Every Weekend in October",
    titleAr: "عطلات السحر - كل عطلة نهاية أسبوع في أكتوبر",
    description: `<div>
      <h2>Cast magical spells and prepare your potions!</h2>
      <p>Witchcraft Weekends is magically appearing Every Weekend in October! Experience the enchanted, get surprised by the spooky, and enjoy spellbinding fun for witches and wizards of all ages!</p>
      
      <h3>Spell Casting Time</h3>
      <p>Earn <strong>200% EXP and GP</strong> all weekend! During specific times, you can earn <strong>800% EXP and GP</strong> instead:</p>
      <ul>
        <li>Play from 12AM - 1AM</li>
        <li>Play from 6AM - 7AM</li>
        <li>Play from 12PM - 1PM</li>
        <li>Play from 6PM - 7PM</li>
      </ul>
      
      <h3>Bewitching of Crates</h3>
      <p>Play 2 hours each weekend to receive Bewitched Halloween Crates! The more weekends you complete your 2 hours, the more crates you get:</p>
      <ul>
        <li>1 weekend: Get 3 Bewitched Halloween Crates</li>
        <li>2 weekends: Get 9 Bewitched Halloween Crates</li>
        <li>3 weekends: Get 15 Bewitched Halloween Crates</li>
        <li>4 weekends: Get 21 Bewitched Halloween Crates</li>
        <li>5 weekends: Get 27 Bewitched Halloween Crates</li>
      </ul>
    </div>`,
    descriptionAr: `<div dir="rtl">
      <h2>ألقِ التعاويذ السحرية وحضّر جرعاتك!</h2>
      <p>عطلات السحر تظهر بشكل سحري كل عطلة نهاية أسبوع في أكتوبر! استمتع بالسحر والمفاجآت المخيفة والمرح الساحر للسحرة والساحرات من جميع الأعمار!</p>
      
      <h3>وقت إلقاء التعاويذ</h3>
      <p>اكسب <strong>200% تجربة ونقاط</strong> طوال عطلة نهاية الأسبوع! في أوقات محددة، يمكنك كسب <strong>800% تجربة ونقاط</strong> بدلاً من ذلك:</p>
      <ul>
        <li>العب من 12 صباحاً - 1 صباحاً</li>
        <li>العب من 6 صباحاً - 7 صباحاً</li>
        <li>العب من 12 ظهراً - 1 ظهراً</li>
        <li>العب من 6 مساءً - 7 مساءً</li>
      </ul>
      
      <h3>صناديق الهالوين المسحورة</h3>
      <p>العب لمدة ساعتين كل عطلة نهاية أسبوع لتحصل على صناديق هالوين مسحورة! كلما أكملت المزيد من عطلات نهاية الأسبوع، كلما حصلت على المزيد من الصناديق:</p>
      <ul>
        <li>عطلة واحدة: احصل على 3 صناديق</li>
        <li>عطلتان: احصل على 9 صناديق</li>
        <li>3 عطلات: احصل على 15 صندوقاً</li>
        <li>4 عطلات: احصل على 21 صندوقاً</li>
        <li>5 عطلات: احصل على 27 صندوقاً</li>
      </ul>
    </div>`,
    date: "Every Weekend in October",
    type: "trending",
    image: ""
  },
  {
    title: "Wavelite Bonus Surge",
    titleAr: "عرض ويفلايت الخاص",
    description: `<div>
      <h2>Supercharge Your First Recharge!</h2>
      <p>From November 1st to the 30th, supercharge your first recharge of the month with <strong>50% bonus ZP</strong> and extra rewards. Power up and bring unstoppable energy to every battle.</p>
      
      <h3>Tier 1: From 5,000 ZP to 19,999 ZP</h3>
      <ul>
        <li>Barrett-Wavelite (7 days)</li>
        <li>Kukri-Wavelite (7 days)</li>
        <li>Bulletproof Helmet & Vest (7 days)</li>
        <li>Free Crate Ticket x5</li>
      </ul>
      
      <h3>Tier 2: From 20,000 ZP to 99,999 ZP</h3>
      <ul>
        <li>Barrett-Wavelite (30 days)</li>
        <li>Kukri-Wavelite (30 days)</li>
        <li>Bulletproof Helmet & Vest (30 days)</li>
        <li>Free Crate Ticket x10</li>
        <li>Plus everything from Tier 1</li>
      </ul>
      
      <h3>Tier 3: 100,000 ZP or more</h3>
      <ul>
        <li>Barrett-Wavelite (60 days)</li>
        <li>Kukri-Wavelite (60 days)</li>
        <li>Bulletproof Helmet & Vest (30 days)</li>
        <li>Free Crate Ticket x20</li>
        <li>Plus everything from Tier 1 and 2</li>
      </ul>
    </div>`,
    descriptionAr: `<div dir="rtl">
      <h2>عزز شحنتك الأولى!</h2>
      <p>من 1 إلى 30 نوفمبر، عزز شحنتك الأولى في الشهر مع <strong>مكافأة 50% ZP إضافية</strong> ومكافآت إضافية. قوّي نفسك وأحضر طاقة لا يمكن إيقافها لكل معركة.</p>
      
      <h3>المستوى 1: من 5,000 ZP إلى 19,999 ZP</h3>
      <ul>
        <li>باريت-ويفلايت (7 أيام)</li>
        <li>كوكري-ويفلايت (7 أيام)</li>
        <li>خوذة ودرع واقية من الرصاص (7 أيام)</li>
        <li>تذكرة صندوق مجاني x5</li>
      </ul>
      
      <h3>المستوى 2: من 20,000 ZP إلى 99,999 ZP</h3>
      <ul>
        <li>باريت-ويفلايت (30 يوماً)</li>
        <li>كوكري-ويفلايت (30 يوماً)</li>
        <li>خوذة ودرع واقية من الرصاص (30 يوماً)</li>
        <li>تذكرة صندوق مجاني x10</li>
        <li>بالإضافة إلى كل شيء من المستوى 1</li>
      </ul>
      
      <h3>المستوى 3: 100,000 ZP أو أكثر</h3>
      <ul>
        <li>باريت-ويفلايت (60 يوماً)</li>
        <li>كوكري-ويفلايت (60 يوماً)</li>
        <li>خوذة ودرع واقية من الرصاص (30 يوماً)</li>
        <li>تذكرة صندوق مجاني x20</li>
        <li>بالإضافة إلى كل شيء من المستوى 1 و 2</li>
      </ul>
    </div>`,
    date: "November 1 - 30",
    type: "upcoming",
    image: ""
  },
  {
    title: "CF Event Pass Season 5 Rewind",
    titleAr: "باس الموسم الخامس - العودة للماضي",
    description: `<div>
      <h2>Rewind Back to Basics!</h2>
      <p>CF Event Pass Season 5: Rewind has begun! From September 30 to December 3, this season brings arcade style treasures, mercenaries who have seen real battle, and other rewards.</p>
      
      <h3>What You Can Rewind To:</h3>
      <ul>
        <li>Complete missions to earn Battle Coins and unlock tiered rewards</li>
        <li>Spend your Battle Coins in the Coin Shop, stocked with exclusive loot</li>
        <li>Some rewards require specific pass levels to unlock</li>
      </ul>
      
      <h3>Premium Event Pass</h3>
      <p>Available for <strong>30,000 ZP</strong>, unlocking even more legendary items. To reach the highest peaks of power, you'll need to redeem rewards in order. Once you hit Level 100 and you have claimed all your premium loot, you can try your luck in the new and fabled Bonus Prospect.</p>
      
      <p><strong>Note:</strong> Unused coins will vanish after the grace period once the season ends!</p>
    </div>`,
    descriptionAr: `<div dir="rtl">
      <h2>عد إلى الأساسيات!</h2>
      <p>بدأ باس الحدث الموسم الخامس: العودة للماضي! من 30 سبتمبر إلى 3 ديسمبر، يقدم هذا الموسم كنوزاً بأسلوب الآركيد ومرتزقة شهدوا معارك حقيقية ومكافآت أخرى.</p>
      
      <h3>ما يمكنك العودة إليه:</h3>
      <ul>
        <li>أكمل المهام لكسب عملات المعركة وفتح المكافآت المتدرجة</li>
        <li>أنفق عملات المعركة في متجر العملات، المليء بالغنائم الحصرية</li>
        <li>بعض المكافآت تتطلب مستويات محددة من الباس لفتحها</li>
      </ul>
      
      <h3>باس الحدث المميز</h3>
      <p>متوفر مقابل <strong>30,000 ZP</strong>، يفتح المزيد من العناصر الأسطورية. للوصول إلى أعلى قمم القوة، ستحتاج إلى استرداد المكافآت بالترتيب. بمجرد وصولك إلى المستوى 100 وحصولك على جميع غنائمك المميزة، يمكنك تجربة حظك في المكافأة الإضافية الجديدة.</p>
      
      <p><strong>ملاحظة:</strong> العملات غير المستخدمة ستختفي بعد فترة السماح بمجرد انتهاء الموسم!</p>
    </div>`,
    date: "September 30 - December 3",
    type: "trending",
    image: ""
  },
  {
    title: "Halloween Creative Contest 2025",
    titleAr: "مسابقة الهالوين الإبداعية 2025",
    description: `<div>
      <h2>Show Your Creativity!</h2>
      <p>Something wicked this way comes - and it may be your creation! The Halloween Creative Contest haunts our halls once more, from NOW until November 2nd.</p>
      
      <h3>Two Categories:</h3>
      
      <h4>1. Costumes</h4>
      <p>Submit real life pictures of you wearing your Halloween costume! Costumes must be either <strong>CrossFire related or Scary themed</strong>.</p>
      <p><strong>Requirements:</strong> Pictures must include you holding a paper with #CFHalloween2025 and your IGN written on it, clearly visible.</p>
      
      <h4>2. Art + Carving</h4>
      <p>Submit your CrossFire spooky drawing, horror video, in-game screenshot, pumpkin/fruit/vegetable carving, or any other art media!</p>
      <p><strong>Requirements:</strong> All art must include #CFHalloween2025 and your IGN written in it, clearly visible.</p>
      
      <h3>Prizes:</h3>
      <ul>
        <li><strong>1st Place:</strong> Permanent weapon of choice</li>
        <li><strong>2nd Place:</strong> Permanent Halloween Weapon of Choice</li>
        <li><strong>3rd Place:</strong> 50 Halloween Crates of Choice</li>
      </ul>
      
      <p><strong>Note:</strong> AI detected in submissions will result in immediate disqualification.</p>
    </div>`,
    descriptionAr: `<div dir="rtl">
      <h2>أظهر إبداعك!</h2>
      <p>شيء شرير يقترب - وقد يكون من إبداعك! مسابقة الهالوين الإبداعية عادت من جديد، من الآن حتى 2 نوفمبر.</p>
      
      <h3>فئتان:</h3>
      
      <h4>1. الأزياء</h4>
      <p>قدم صوراً حقيقية لك وأنت ترتدي زي الهالوين الخاص بك! يجب أن تكون الأزياء <strong>متعلقة بكروس فاير أو ذات طابع مخيف</strong>.</p>
      <p><strong>المتطلبات:</strong> يجب أن تتضمن الصور ورقة تحمل #CFHalloween2025 واسم شخصيتك في اللعبة، بشكل واضح.</p>
      
      <h4>2. الفن والنحت</h4>
      <p>قدم رسمك المخيف لكروس فاير، أو فيديو رعب، أو لقطة شاشة من اللعبة، أو نحت اليقطين/الفواكه/الخضروات، أو أي وسيلة فنية أخرى!</p>
      <p><strong>المتطلبات:</strong> يجب أن يتضمن كل عمل فني #CFHalloween2025 واسم شخصيتك في اللعبة، بشكل واضح.</p>
      
      <h3>الجوائز:</h3>
      <ul>
        <li><strong>المركز الأول:</strong> سلاح دائم من اختيارك</li>
        <li><strong>المركز الثاني:</strong> سلاح هالوين دائم من اختيارك</li>
        <li><strong>المركز الثالث:</strong> 50 صندوق هالوين من اختيارك</li>
      </ul>
      
      <p><strong>ملاحظة:</strong> اكتشاف الذكاء الاصطناعي في التقديمات سيؤدي إلى الاستبعاد الفوري.</p>
    </div>`,
    date: "Now - November 2",
    type: "trending",
    image: ""
  },
  {
    title: "CFS Super Fans: Support Your Team!",
    titleAr: "المشجعون الخارقون: ادعم فريقك!",
    description: `<div>
      <h2>Show Support for Your Favorite Pro Team!</h2>
      <p>CFS Super Fans has arrived! From October 22nd until November 4th, show your support for your favorite Pro team and score some epic weapons from the Citrine Well!</p>
      
      <h3>New Weapons Available:</h3>
      <ul>
        <li>M4A1-S-CFS Sunfire Iron Beast</li>
        <li>AWM-CFS Sunfire Ironhawk</li>
        <li>Barrett-CFS Sunfire Demon</li>
      </ul>
      
      <h3>Returning Weapons:</h3>
      <ul>
        <li>QBZ-03-CFS Mirage Jewelry</li>
        <li>Scar Light-S-CFS Dusk Tiger</li>
        <li>Cheytac-CFS Jupiter Dominator</li>
      </ul>
      
      <h3>Special Weapon Select Boxes:</h3>
      <p>Multiple weapon select boxes available including CFS Fervor, CFS Bliss, and CFS24 GF collections!</p>
      
      <p><strong>Note:</strong> A portion of the proceeds will go directly to 2025 eSports!</p>
    </div>`,
    descriptionAr: `<div dir="rtl">
      <h2>أظهر دعمك لفريقك المحترف المفضل!</h2>
      <p>وصل المشجعون الخارقون! من 22 أكتوبر حتى 4 نوفمبر، أظهر دعمك لفريقك المحترف المفضل واحصل على أسلحة رائعة من بئر السيترين!</p>
      
      <h3>الأسلحة الجديدة المتاحة:</h3>
      <ul>
        <li>M4A1-S-CFS وحش النار الحديدي</li>
        <li>AWM-CFS صقر النار الحديدي</li>
        <li>Barrett-CFS شيطان النار</li>
      </ul>
      
      <h3>الأسلحة العائدة:</h3>
      <ul>
        <li>QBZ-03-CFS مجوهرات الميراج</li>
        <li>Scar Light-S-CFS نمر الغسق</li>
        <li>Cheytac-CFS مسيطر المشتري</li>
      </ul>
      
      <h3>صناديق اختيار الأسلحة الخاصة:</h3>
      <p>صناديق اختيار أسلحة متعددة متاحة بما في ذلك مجموعات CFS Fervor و CFS Bliss و CFS24 GF!</p>
      
      <p><strong>ملاحظة:</strong> سيذهب جزء من العائدات مباشرة إلى الرياضات الإلكترونية 2025!</p>
    </div>`,
    date: "October 22 - November 4",
    type: "upcoming",
    image: ""
  }
];

async function seedEventsAndNews() {
  console.log("🌱 Starting to seed Events and News...");
  
  try {
    // إضافة الأحداث
    for (const event of newEvents) {
      await storage.createEvent(event);
      console.log(`✅ Created event: ${event.title}`);
    }
    
    console.log("\n✨ All events and news seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEventsAndNews().then(() => {
    console.log("✅ Done!");
    process.exit(0);
  }).catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
}

export { seedEventsAndNews };
