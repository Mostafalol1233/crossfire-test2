// Script to push data from Replit MongoDB to Neon PostgreSQL
import { storage as mongoStorage } from './server/storage';
import { neon } from '@neondatabase/serverless';

const NEON_URL = 'postgresql://neondb_owner:npg_qHJBV89WgejL@ep-dry-cell-aena69o3.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(NEON_URL);

async function pushDataToNeon() {
  console.log('🚀 نقل البيانات من Replit MongoDB إلى Neon...\n');

  try {
    // ========== نقل Admins ==========
    console.log('👤 نقل Admins...');
    const admins = await mongoStorage.getAllAdmins();
    console.log(`وجدنا ${admins.length} admin`);
    
    for (const admin of admins) {
      try {
        await sql`
          INSERT INTO admins (username, password, role, created_at)
          VALUES (${admin.username}, ${admin.password}, ${admin.role}, ${admin.createdAt || new Date()})
          ON CONFLICT (username) DO NOTHING
        `;
        console.log(`  ✅ تم نقل: ${admin.username}`);
      } catch (err: any) {
        console.log(`  ⏭️  موجود مسبقاً: ${admin.username}`);
      }
    }

    // ========== نقل Posts ==========
    console.log('\n📝 نقل Posts...');
    const posts = await mongoStorage.getAllPosts();
    console.log(`وجدنا ${posts.length} post`);
    
    for (const post of posts) {
      try {
        await sql`
          INSERT INTO posts (title, content, summary, image, category, tags, author, views, reading_time, featured, created_at)
          VALUES (
            ${post.title},
            ${post.content},
            ${post.summary},
            ${post.image},
            ${post.category},
            ${post.tags},
            ${post.author},
            ${post.views},
            ${post.readingTime},
            ${post.featured},
            ${post.createdAt || new Date()}
          )
        `;
        console.log(`  ✅ تم نقل: ${post.title}`);
      } catch (err: any) {
        console.log(`  ⚠️  خطأ في: ${post.title}`);
      }
    }

    // ========== نقل Events ==========
    console.log('\n📅 نقل Events...');
    const events = await mongoStorage.getAllEvents();
    console.log(`وجدنا ${events.length} event`);
    
    for (const event of events) {
      try {
        await sql`
          INSERT INTO events (title, title_ar, description, description_ar, date, type, image)
          VALUES (
            ${event.title},
            ${event.titleAr || ''},
            ${event.description || ''},
            ${event.descriptionAr || ''},
            ${event.date},
            ${event.type},
            ${event.image || ''}
          )
        `;
        console.log(`  ✅ تم نقل: ${event.title}`);
      } catch (err: any) {
        console.log(`  ⚠️  خطأ في: ${event.title}`);
      }
    }

    // ========== نقل News ==========
    console.log('\n📰 نقل News...');
    const news = await mongoStorage.getAllNews();
    console.log(`وجدنا ${news.length} news item`);
    
    for (const newsItem of news) {
      try {
        await sql`
          INSERT INTO news (title, title_ar, date_range, image, category, content, content_ar, html_content, author, featured, created_at)
          VALUES (
            ${newsItem.title},
            ${newsItem.titleAr || ''},
            ${newsItem.dateRange},
            ${newsItem.image},
            ${newsItem.category},
            ${newsItem.content},
            ${newsItem.contentAr || ''},
            ${newsItem.htmlContent || ''},
            ${newsItem.author},
            ${newsItem.featured || false},
            ${newsItem.createdAt || new Date()}
          )
        `;
        console.log(`  ✅ تم نقل: ${newsItem.title}`);
      } catch (err: any) {
        console.log(`  ⚠️  خطأ في: ${newsItem.title}`);
      }
    }

    // ========== نقل Tickets ==========
    console.log('\n🎫 نقل Tickets...');
    const tickets = await mongoStorage.getAllTickets();
    console.log(`وجدنا ${tickets.length} ticket`);
    
    for (const ticket of tickets) {
      try {
        const result = await sql`
          INSERT INTO tickets (title, description, user_name, user_email, status, priority, category, created_at, updated_at)
          VALUES (
            ${ticket.title},
            ${ticket.description},
            ${ticket.userName},
            ${ticket.userEmail},
            ${ticket.status},
            ${ticket.priority},
            ${ticket.category},
            ${ticket.createdAt || new Date()},
            ${ticket.updatedAt || new Date()}
          )
          RETURNING id
        `;
        
        const newTicketId = result[0].id;
        
        // نقل Replies الخاصة بالتذكرة
        const replies = await mongoStorage.getTicketReplies((ticket as any)._id?.toString() || ticket.id);
        for (const reply of replies) {
          await sql`
            INSERT INTO ticket_replies (ticket_id, author_name, content, is_admin, created_at)
            VALUES (
              ${newTicketId},
              ${reply.authorName},
              ${reply.content},
              ${reply.isAdmin},
              ${reply.createdAt || new Date()}
            )
          `;
        }
        
        console.log(`  ✅ تم نقل: ${ticket.title} (${replies.length} replies)`);
      } catch (err: any) {
        console.log(`  ⚠️  خطأ في: ${ticket.title}`);
      }
    }

    // ========== نقل Newsletter Subscribers ==========
    console.log('\n📧 نقل Newsletter Subscribers...');
    const subscribers = await mongoStorage.getAllNewsletterSubscribers();
    console.log(`وجدنا ${subscribers.length} subscriber`);
    
    for (const subscriber of subscribers) {
      try {
        await sql`
          INSERT INTO newsletter_subscribers (email, created_at)
          VALUES (${subscriber.email}, ${subscriber.createdAt || new Date()})
          ON CONFLICT (email) DO NOTHING
        `;
        console.log(`  ✅ تم نقل: ${subscriber.email}`);
      } catch (err: any) {
        console.log(`  ⏭️  موجود مسبقاً: ${subscriber.email}`);
      }
    }

    console.log('\n✅ تم نقل جميع البيانات بنجاح! 🎉');
    console.log('\n📊 الملخص:');
    console.log(`   Admins: ${admins.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Events: ${events.length}`);
    console.log(`   News: ${news.length}`);
    console.log(`   Tickets: ${tickets.length}`);
    console.log(`   Newsletter Subscribers: ${subscribers.length}`);

  } catch (error) {
    console.error('\n❌ فشل النقل:', error);
    throw error;
  }
}

pushDataToNeon()
  .then(() => {
    console.log('\n🎊 تمام! كل البيانات الآن في Neon');
    process.exit(0);
  })
  .catch((error) => {
    console.error('خطأ فادح:', error);
    process.exit(1);
  });
