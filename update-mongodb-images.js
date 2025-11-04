import mongoose from 'mongoose';
import fs from 'fs';

const mapping = JSON.parse(fs.readFileSync('catbox-mapping.json', 'utf8'));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

// Define schemas
const NewsSchema = new mongoose.Schema({
  title: String,
  titleAr: String,
  dateRange: String,
  image: String,
  category: String,
  content: String,
  contentAr: String,
  htmlContent: String,
  author: String,
  featured: Boolean,
  createdAt: Date
});

const EventSchema = new mongoose.Schema({
  title: String,
  titleAr: String,
  description: String,
  descriptionAr: String,
  date: String,
  type: String,
  image: String
});

const NewsModel = mongoose.model('News', NewsSchema);
const EventModel = mongoose.model('Event', EventSchema);

function replaceImagePath(oldPath) {
  if (!oldPath || oldPath === '') return oldPath;
  
  // Extract filename from /assets/filename.jpg
  const match = oldPath.match(/\/assets\/(.+)$/);
  if (!match) return oldPath;
  
  const filename = match[1];
  const catboxUrl = mapping[filename];
  
  if (catboxUrl && catboxUrl !== 'No file!') {
    return catboxUrl;
  }
  
  return oldPath;
}

async function main() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Update News
    console.log('\n📰 Updating News items...');
    const newsItems = await NewsModel.find({});
    let newsUpdated = 0;
    
    for (const news of newsItems) {
      const oldImage = news.image;
      const newImage = replaceImagePath(oldImage);
      
      if (oldImage !== newImage) {
        news.image = newImage;
        await news.save();
        newsUpdated++;
        console.log(`  ✅ Updated: ${news.title}`);
        console.log(`     Old: ${oldImage}`);
        console.log(`     New: ${newImage}`);
      }
    }
    
    console.log(`\n📊 News: ${newsUpdated}/${newsItems.length} updated`);
    
    // Update Events
    console.log('\n📅 Updating Events...');
    const events = await EventModel.find({});
    let eventsUpdated = 0;
    
    for (const event of events) {
      const oldImage = event.image;
      const newImage = replaceImagePath(oldImage);
      
      if (oldImage !== newImage) {
        event.image = newImage;
        await event.save();
        eventsUpdated++;
        console.log(`  ✅ Updated: ${event.title}`);
        console.log(`     Old: ${oldImage}`);
        console.log(`     New: ${newImage}`);
      }
    }
    
    console.log(`\n📊 Events: ${eventsUpdated}/${events.length} updated`);
    
    console.log('\n✅ All done!');
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
