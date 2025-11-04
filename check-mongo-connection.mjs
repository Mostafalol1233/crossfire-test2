import mongoose from 'mongoose';

async function checkConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected successfully');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

checkConnection();
