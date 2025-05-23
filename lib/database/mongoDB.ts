import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  console.log('🔄 Attempting to connect to database...');
  
  if (cached.conn) {
    console.log('✅ Using cached database connection');
    return cached.conn;
  }

  if(!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from environment variables');
    throw new Error('MONGODB_URI is missing');
  }

  try {
    console.log('📡 Connecting to MongoDB...');
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    
      bufferCommands: false,
    });

    cached.conn = await cached.promise;
    console.log('✅ Successfully connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}