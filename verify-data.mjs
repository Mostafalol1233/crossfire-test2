import mongoose from 'mongoose';

async function verifyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    // Check events
    const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }));
    const events = await Event.find().limit(3);
    console.log('Events in database:', events.length);
    if (events.length > 0) {
      console.log('Sample event:', JSON.stringify(events[0], null, 2));
    }
    
    // Check news
    const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
    const news = await News.find().limit(3);
    console.log('\nNews in database:', news.length);
    if (news.length > 0) {
      console.log('Sample news:', JSON.stringify(news[0], null, 2));
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verifyData();
