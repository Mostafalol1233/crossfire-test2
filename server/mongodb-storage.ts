import {
  UserModel,
  PostModel,
  CommentModel,
  EventModel,
  NewsModel,
  TicketModel,
  TicketReplyModel,
  AdminModel,
  NewsletterSubscriberModel,
  ProductModel,
  ReviewModel,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Event,
  type InsertEvent,
  type News as NewsType,
  type InsertNews,
  type Ticket,
  type InsertTicket,
  type TicketReply,
  type InsertTicketReply,
  type Admin,
  type InsertAdmin,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type Product,
  type InsertProduct,
  type Review,
  type InsertReview,
} from "@shared/mongodb-schema";
import { connectMongoDB } from "./mongodb";

export interface NewsItem {
  id: string;
  title: string;
  titleAr?: string;
  dateRange: string;
  image: string;
  featured?: boolean;
  category: string;
  content: string;
  contentAr?: string;
  htmlContent?: string;
  author: string;
  createdAt?: Date;
}

export interface Mercenary {
  id: string;
  name: string;
  image: string;
  role: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  incrementPostViews(id: string): Promise<void>;

  getCommentsByPostId(postId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;

  getAllNews(): Promise<NewsItem[]>;
  getNewsById(id: string): Promise<NewsItem | undefined>;
  createNews(news: Partial<NewsItem>): Promise<NewsItem>;
  updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem | undefined>;
  deleteNews(id: string): Promise<boolean>;

  getAllMercenaries(): Promise<Mercenary[]>;

  getAllTickets(): Promise<Ticket[]>;
  getTicketById(id: string): Promise<Ticket | undefined>;
  getTicketsByEmail(email: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  deleteTicket(id: string): Promise<boolean>;

  getTicketReplies(ticketId: string): Promise<TicketReply[]>;
  createTicketReply(reply: InsertTicketReply): Promise<TicketReply>;

  getAllAdmins(): Promise<Admin[]>;
  getAdminById(id: string): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined>;
  deleteAdmin(id: string): Promise<boolean>;

  getEventById(id: string): Promise<Event | undefined>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;

  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  deleteNewsletterSubscriber(id: string): Promise<boolean>;

  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getAllReviews(): Promise<Review[]>;
  getReviewsByProductId(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: string): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  private mercenaries: Map<string, Mercenary>;
  private initialized = false;

  constructor() {
    this.mercenaries = new Map();
    this.initializeMercenaries();
    this.connect();
  }

  private async connect() {
    if (!this.initialized) {
      await connectMongoDB();
      this.initialized = true;
    }
  }

  private initializeMercenaries() {
    this.mercenaries.set("1", { id: "1", name: "Wolf", image: "https://files.catbox.moe/6npa73.jpeg", role: "Assault" });
    this.mercenaries.set("2", { id: "2", name: "Vipers", image: "https://files.catbox.moe/4il6hi.jpeg", role: "Recon" });
    this.mercenaries.set("3", { id: "3", name: "Sisterhood", image: "https://files.catbox.moe/3o58nb.jpeg", role: "Support" });
    this.mercenaries.set("4", { id: "4", name: "Ronin", image: "https://files.catbox.moe/eck3jc.jpeg", role: "Sniper" });
    this.mercenaries.set("5", { id: "5", name: "Desperado", image: "https://files.catbox.moe/hh7h5u.jpeg", role: "Demolition" });
    this.mercenaries.set("6", { id: "6", name: "Black Mamba", image: "https://files.catbox.moe/r26ox6.jpeg", role: "Infiltrator" });
    this.mercenaries.set("7", { id: "7", name: "Dean", image: "https://files.catbox.moe/t78mvu.jpeg", role: "Medic" });
    this.mercenaries.set("8", { id: "8", name: "Arch Honorary", image: "https://files.catbox.moe/ctwnqz.jpeg", role: "Commander" });
    this.mercenaries.set("9", { id: "9", name: "Thoth", image: "https://files.catbox.moe/g4zfzn.jpeg", role: "Guardian" });
    this.mercenaries.set("10", { id: "10", name: "SFG", image: "https://files.catbox.moe/3bba2g.jpeg", role: "Special Forces Group" });
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id).lean();
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username }).lean();
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
    return posts;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const post = await PostModel.findById(id).lean();
    return post || undefined;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const newPost = await PostModel.create(post);
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post | undefined> {
    const updated = await PostModel.findByIdAndUpdate(id, post, { new: true });
    return updated || undefined;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.findByIdAndDelete(id);
    return !!result;
  }

  async incrementPostViews(id: string): Promise<void> {
    await PostModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const comments = await CommentModel.find({ postId }).sort({ createdAt: -1 }).lean();
    return comments;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const newComment = await CommentModel.create(comment);
    return newComment;
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await EventModel.find().lean();
    return events;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent = await EventModel.create(event);
    return newEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await EventModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAllNews(): Promise<NewsItem[]> {
    const news = await NewsModel.find().sort({ createdAt: -1 }).lean();
    return news.map((item) => ({
      id: String(item._id),
      title: item.title,
      titleAr: item.titleAr,
      dateRange: item.dateRange,
      image: item.image,
      category: item.category,
      content: item.content,
      contentAr: item.contentAr,
      htmlContent: item.htmlContent,
      author: item.author,
      featured: item.featured,
      createdAt: item.createdAt,
    }));
  }

  async getNewsById(id: string): Promise<NewsItem | undefined> {
    const item = await NewsModel.findById(id).lean();
    if (!item) return undefined;
    return {
      id: String(item._id),
      title: item.title,
      titleAr: item.titleAr,
      dateRange: item.dateRange,
      image: item.image,
      category: item.category,
      content: item.content,
      contentAr: item.contentAr,
      htmlContent: item.htmlContent,
      author: item.author,
      featured: item.featured,
      createdAt: item.createdAt,
    };
  }

  async createNews(news: Partial<NewsItem>): Promise<NewsItem> {
    const newNews = await NewsModel.create(news);
    return {
      id: String(newNews._id),
      title: newNews.title,
      titleAr: newNews.titleAr,
      dateRange: newNews.dateRange,
      image: newNews.image,
      category: newNews.category,
      content: newNews.content,
      contentAr: newNews.contentAr,
      htmlContent: newNews.htmlContent,
      author: newNews.author,
      featured: newNews.featured,
      createdAt: newNews.createdAt,
    };
  }

  async updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem | undefined> {
    const updated = await NewsModel.findByIdAndUpdate(id, news, { new: true });
    if (!updated) return undefined;
    return {
      id: String(updated._id),
      title: updated.title,
      titleAr: updated.titleAr,
      dateRange: updated.dateRange,
      image: updated.image,
      category: updated.category,
      content: updated.content,
      contentAr: updated.contentAr,
      htmlContent: updated.htmlContent,
      author: updated.author,
      featured: updated.featured,
      createdAt: updated.createdAt,
    };
  }

  async deleteNews(id: string): Promise<boolean> {
    const result = await NewsModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAllMercenaries(): Promise<Mercenary[]> {
    return Array.from(this.mercenaries.values());
  }

  async getAllTickets(): Promise<Ticket[]> {
    const tickets = await TicketModel.find().sort({ createdAt: -1 }).lean();
    return tickets;
  }

  async getTicketById(id: string): Promise<Ticket | undefined> {
    const ticket = await TicketModel.findById(id).lean();
    return ticket || undefined;
  }

  async getTicketsByEmail(email: string): Promise<Ticket[]> {
    const tickets = await TicketModel.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    return tickets;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const newTicket = await TicketModel.create(ticket);
    return newTicket;
  }

  async updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const updated = await TicketModel.findByIdAndUpdate(
      id,
      { ...ticket, updatedAt: new Date() },
      { new: true }
    );
    return updated || undefined;
  }

  async deleteTicket(id: string): Promise<boolean> {
    const result = await TicketModel.findByIdAndDelete(id);
    return !!result;
  }

  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    const replies = await TicketReplyModel.find({ ticketId }).sort({ createdAt: 1 }).lean();
    return replies;
  }

  async createTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const newReply = await TicketReplyModel.create(reply);
    return newReply;
  }

  async getAllAdmins(): Promise<Admin[]> {
    const admins = await AdminModel.find().sort({ createdAt: -1 }).lean();
    return admins;
  }

  async getAdminById(id: string): Promise<Admin | undefined> {
    const admin = await AdminModel.findById(id).lean();
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const admin = await AdminModel.findOne({ username }).lean();
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const newAdmin = await AdminModel.create(admin);
    return newAdmin;
  }

  async updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const updated = await AdminModel.findByIdAndUpdate(id, admin, { new: true });
    return updated || undefined;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await AdminModel.findByIdAndDelete(id);
    return !!result;
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const event = await EventModel.findById(id).lean();
    return event || undefined;
  }

  async updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const updated = await EventModel.findByIdAndUpdate(id, event, { new: true });
    return updated || undefined;
  }

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const subscribers = await NewsletterSubscriberModel.find().sort({ createdAt: -1 }).lean();
    return subscribers;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const subscriber = await NewsletterSubscriberModel.findOne({ email }).lean();
    return subscriber || undefined;
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const newSubscriber = await NewsletterSubscriberModel.create(subscriber);
    return newSubscriber;
  }

  async deleteNewsletterSubscriber(id: string): Promise<boolean> {
    const result = await NewsletterSubscriberModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return products;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const product = await ProductModel.findById(id).lean();
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = await ProductModel.create(product);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const updated = await ProductModel.findByIdAndUpdate(id, product, { new: true });
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(id);
    return !!result;
  }

  async getAllReviews(): Promise<Review[]> {
    const reviews = await ReviewModel.find().sort({ createdAt: -1 }).lean();
    return reviews;
  }

  async getReviewsByProductId(productId: string): Promise<Review[]> {
    const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 }).lean();
    return reviews;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview = await ReviewModel.create(review);
    return newReview;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await ReviewModel.findByIdAndDelete(id);
    return !!result;
  }
}