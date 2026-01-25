import { UserRole, Product, User, Order, OrderStatus, CartItem, DashboardStats, ProductCategory } from './types';

/**
 * Backend Server Simulation for ClickBazaar
 * This module handles:
 * 1. User authentication with persistent storage (JWT tokens)
 * 2. Live product tracking with location-based delivery dates
 * 3. Barrackpore, West Bengal as the warehouse location
 */

// In-memory database (in production, use a real database like MongoDB/PostgreSQL)
const SERVER_DB = {
  users: new Map<string, any>(),
  sessions: new Map<string, any>(), // JWT-like sessions
  orders: new Map<string, Order>(),
  trackingData: new Map<string, any>(),
  // simple newsletter subscriber store (email set)
  newsletterSubscribers: new Set<string>(),
};

// Warehouse Location: Barrackpore, West Bengal, India
const WAREHOUSE_LOCATION = {
  city: 'Barrackpore',
  state: 'West Bengal',
  country: 'India',
  pincode: '700112',
  latitude: 22.7646,
  longitude: 88.2632
};

// Indian cities with distance from Barrackpore and delivery days
const DELIVERY_ZONES: Record<string, { distance: number; days: number; lat: number; lng: number }> = {
  'Kolkata': { distance: 20, days: 1, lat: 22.5726, lng: 88.3639 },
  'Howrah': { distance: 35, days: 1, lat: 22.5958, lng: 88.2637 },
  'Hooghly': { distance: 45, days: 2, lat: 22.8892, lng: 88.4025 },
  'Durgapur': { distance: 180, days: 3, lat: 23.1815, lng: 87.3089 },
  'Siliguri': { distance: 600, days: 5, lat: 26.7271, lng: 88.3953 },
  'Darjeeling': { distance: 700, days: 6, lat: 27.0410, lng: 88.2663 },
  'Assam': { distance: 800, days: 7, lat: 26.2006, lng: 92.9376 },
  'Bangalore': { distance: 1800, days: 6, lat: 12.9716, lng: 77.5946 },
  'Mumbai': { distance: 1950, days: 5, lat: 19.0760, lng: 72.8777 },
  'Delhi': { distance: 1450, days: 4, lat: 28.7041, lng: 77.1025 },
  'Chennai': { distance: 1900, days: 7, lat: 13.0827, lng: 80.2707 },
  'Hyderabad': { distance: 1300, days: 5, lat: 17.3850, lng: 78.4867 },
};

interface SessionToken {
  token: string;
  userId: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

interface TrackingData {
  orderId: string;
  status: OrderStatus;
  currentLocation: string;
  lastUpdated: string;
  estimatedDelivery: string;
  deliveryDays: number;
  progress: number; // 0-100
  coordinates: { lat: number; lng: number };
  milestones: {
    placed: { date: string; completed: boolean };
    packed: { date: string; completed: boolean };
    shipped: { date: string; completed: boolean };
    delivered: { date: string; completed: boolean };
  };
}

// Generate JWT-like token
const generateToken = (userId: string, email: string): SessionToken => {
  const token = Buffer.from(`${userId}:${Date.now()}:${Math.random()}`).toString('base64');
  const now = Date.now();
  return {
    token,
    userId,
    email,
    createdAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours
  };
};

// Verify token
const verifyToken = (token: string): SessionToken | null => {
  const session = SERVER_DB.sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    SERVER_DB.sessions.delete(token);
    return null;
  }
  return session;
};

// Calculate delivery date based on destination city
const calculateDeliveryDate = (city: string, orderDate: Date): { date: Date; days: number } => {
  const zone = DELIVERY_ZONES[city];
  const days = zone?.days || 5; // Default 5 days if city not found
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return { date: deliveryDate, days };
};

// Calculate progress based on order status and elapsed time
const calculateProgress = (status: OrderStatus, createdAt: string, deliveryDays: number): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const elapsed = now.getTime() - created.getTime();
  const totalTime = deliveryDays * 24 * 60 * 60 * 1000;
  
  switch (status) {
    case OrderStatus.PLACED:
      return Math.min(25, (elapsed / totalTime) * 100);
    case OrderStatus.PACKED:
      return Math.min(50, 25 + ((elapsed - totalTime * 0.1) / (totalTime * 0.3)) * 25);
    case OrderStatus.SHIPPED:
      return Math.min(75, 50 + ((elapsed - totalTime * 0.4) / (totalTime * 0.35)) * 25);
    case OrderStatus.DELIVERED:
      return 100;
    default:
      return 0;
  }
};

export const serverAPI = {
  // ===== AUTHENTICATION =====
  
  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    // Check if user already exists
    for (const user of SERVER_DB.users.values()) {
      if (user.email === email) {
        throw new Error('Email already registered');
      }
    }

    // Create new user
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      role: UserRole.CUSTOMER,
    };

    SERVER_DB.users.set(userId, { ...newUser, password }); // Store password only on server
    
    // Generate session token
    const session = generateToken(userId, email);
    SERVER_DB.sessions.set(session.token, session);

    return {
      user: newUser,
      token: session.token,
    };
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    let foundUser = null;
    let userId = '';

    for (const [id, user] of SERVER_DB.users.entries()) {
      if (user.email === email && user.password === password) {
        foundUser = user;
        userId = id;
        break;
      }
    }

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Generate session token
    const session = generateToken(userId, email);
    SERVER_DB.sessions.set(session.token, session);

    const { password: _, ...userWithoutPassword } = foundUser;
    return {
      user: userWithoutPassword,
      token: session.token,
    };
  },

  logout: async (token: string): Promise<void> => {
    SERVER_DB.sessions.delete(token);
  },

  verifySession: async (token: string): Promise<User | null> => {
    const session = verifyToken(token);
    if (!session) return null;

    const user = SERVER_DB.users.get(session.userId);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // ===== TRACKING =====

  createTracking: async (orderId: string, order: Order, deliveryCity: string): Promise<TrackingData> => {
    const { date: deliveryDate, days: deliveryDays } = calculateDeliveryDate(deliveryCity, new Date(order.createdAt));
    const zone = DELIVERY_ZONES[deliveryCity] || { lat: 0, lng: 0 };

    const tracking: TrackingData = {
      orderId,
      status: OrderStatus.PLACED,
      currentLocation: WAREHOUSE_LOCATION.city,
      lastUpdated: new Date().toISOString(),
      estimatedDelivery: deliveryDate.toISOString(),
      deliveryDays,
      progress: 0,
      coordinates: { lat: WAREHOUSE_LOCATION.latitude, lng: WAREHOUSE_LOCATION.longitude },
      milestones: {
        placed: { date: new Date().toISOString(), completed: true },
        packed: { date: new Date(Date.now() + deliveryDays * 0.1 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
        shipped: { date: new Date(Date.now() + deliveryDays * 0.4 * 24 * 60 * 60 * 1000).toISOString(), completed: false },
        delivered: { date: deliveryDate.toISOString(), completed: false },
      },
    };

    SERVER_DB.trackingData.set(orderId, tracking);
    return tracking;
  },

  getTracking: async (orderId: string): Promise<TrackingData | null> => {
    const tracking = SERVER_DB.trackingData.get(orderId);
    if (!tracking) return null;

    // Simulate progress update
    const created = new Date(tracking.milestones.placed.date);
    const now = new Date();
    const elapsedDays = (now.getTime() - created.getTime()) / (24 * 60 * 60 * 1000);

    // Auto-update status based on elapsed time
    let newStatus = OrderStatus.PLACED;
    if (elapsedDays > tracking.deliveryDays * 0.7) {
      newStatus = OrderStatus.DELIVERED;
      tracking.milestones.delivered.completed = true;
    } else if (elapsedDays > tracking.deliveryDays * 0.4) {
      newStatus = OrderStatus.SHIPPED;
      tracking.milestones.shipped.completed = true;
    } else if (elapsedDays > tracking.deliveryDays * 0.1) {
      newStatus = OrderStatus.PACKED;
      tracking.milestones.packed.completed = true;
    }

    tracking.status = newStatus;
    tracking.progress = calculateProgress(newStatus, tracking.milestones.placed.date, tracking.deliveryDays);
    tracking.lastUpdated = now.toISOString();

    return tracking;
  },

  getAllTrackingForUser: async (userId: string): Promise<TrackingData[]> => {
    const trackingList: TrackingData[] = [];
    
    for (const [orderId, tracking] of SERVER_DB.trackingData.entries()) {
      // This would need order information to filter by userId in production
      trackingList.push(tracking);
    }

    return trackingList;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const tracking = SERVER_DB.trackingData.get(orderId);
    if (!tracking) return;

    tracking.status = status;
    tracking.lastUpdated = new Date().toISOString();

    switch (status) {
      case OrderStatus.PACKED:
        tracking.milestones.packed.completed = true;
        tracking.milestones.packed.date = new Date().toISOString();
        break;
      case OrderStatus.SHIPPED:
        tracking.milestones.shipped.completed = true;
        tracking.milestones.shipped.date = new Date().toISOString();
        break;
      case OrderStatus.DELIVERED:
        tracking.milestones.delivered.completed = true;
        tracking.milestones.delivered.date = new Date().toISOString();
        break;
    }

    tracking.progress = calculateProgress(status, tracking.milestones.placed.date, tracking.deliveryDays);
  },

  getWarehouseLocation: () => WAREHOUSE_LOCATION,

  getDeliveryZones: () => DELIVERY_ZONES,

  // Simple newsletter subscribe simulation
  subscribe: async (email: string): Promise<void> => {
    const normalized = (email || '').trim().toLowerCase();
    const rx = /^\S+@\S+\.\S+$/;
    if (!rx.test(normalized)) throw new Error('Invalid email');
    if (SERVER_DB.newsletterSubscribers.has(normalized)) throw new Error('Already subscribed');
    SERVER_DB.newsletterSubscribers.add(normalized);
    // emulate async processing delay
    await new Promise(res => setTimeout(res, 400));
  },
};
