import { MongoDBStorage } from "./mongodb-storage";

export type { IStorage, NewsItem, Mercenary } from "./mongodb-storage";
export { MongoDBStorage };

export const storage = new MongoDBStorage();
