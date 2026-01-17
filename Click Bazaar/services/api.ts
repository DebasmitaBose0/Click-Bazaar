
import { getDB, saveDB } from '../db';
import { Product, User, Order, UserRole, OrderStatus, CartItem, DashboardStats, ProductCategory } from '../types';
import { serverAPI } from '../server';

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 600));
const TOKEN_KEY = 'clickbazaar_session_token';

export const api = {
  // ===== AUTH =====
  
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Try backend first
      const { user, token } = await serverAPI.login(email, password);
      
      // Store token for persistence
      localStorage.setItem(TOKEN_KEY, token);
      
      // Also update local storage for backward compatibility
      const db = getDB();
      db.currentUser = user;
      saveDB(db);
      
      return user;
    } catch (error) {
      // Fallback to local storage if backend fails
      await simulateDelay();
      const db = getDB();
      const user = db.users.find(u => u.email === email && u.password === password);
      if (!user) throw error;
      db.currentUser = { ...user };
      delete db.currentUser.password;
      saveDB(db);
      return db.currentUser;
    }
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    try {
      // Try backend first
      const { user, token } = await serverAPI.register(name, email, password);
      
      // Store token for persistence
      localStorage.setItem(TOKEN_KEY, token);
      
      // Also update local storage
      const db = getDB();
      const newUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      db.users.push({ ...newUser, password });
      db.currentUser = newUser;
      saveDB(db);
      
      return user;
    } catch (error) {
      // Fallback to local storage
      await simulateDelay();
      const db = getDB();
      
      const existing = db.users.find(u => u.email === email);
      if (existing) throw new Error('Email already registered');

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: UserRole.CUSTOMER,
      };

      db.users.push({ ...newUser, password });
      db.currentUser = { ...newUser };
      saveDB(db);
      return db.currentUser;
    }
  },

  logout: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await serverAPI.logout(token);
      } catch (error) {
        console.error('Backend logout error:', error);
      }
      localStorage.removeItem(TOKEN_KEY);
    }
    
    const db = getDB();
    db.currentUser = null;
    saveDB(db);
  },

  getCurrentUser: (): User | null => {
    // Try to get from backend session first
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // In production, verify with backend
      const db = getDB();
      return db.currentUser;
    }
    
    // Fallback to local storage
    return getDB().currentUser;
  },

  // ===== PRODUCTS =====
  
  getProducts: async (category?: ProductCategory): Promise<Product[]> => {
    await simulateDelay();
    const db = getDB();
    return category ? db.products.filter(p => p.category === category) : db.products;
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const db = getDB();
    return db.products.find(p => p.id === id);
  },

  adminUpsertProduct: async (product: Partial<Product>): Promise<void> => {
    await simulateDelay();
    const db = getDB();
    if (product.id) {
      const idx = db.products.findIndex(p => p.id === product.id);
      db.products[idx] = { ...db.products[idx], ...product };
    } else {
      const newProduct: Product = {
        ...product as Product,
        id: Math.random().toString(36).substr(2, 9),
      };
      db.products.push(newProduct);
    }
    saveDB(db);
  },

  adminDeleteProduct: async (id: string): Promise<void> => {
    await simulateDelay();
    const db = getDB();
    db.products = db.products.filter(p => p.id !== id);
    saveDB(db);
  },

  // ===== ORDERS & TRACKING =====
  
  placeOrder: async (items: CartItem[], shippingAddress: Order['shippingAddress']): Promise<Order> => {
    await simulateDelay();
    const db = getDB();
    if (!db.currentUser) throw new Error('Must be logged in');

    const orderItems = items.map(item => {
      const p = db.products.find(prod => prod.id === item.productId)!;
      // Update stock
      p.stock -= item.quantity;
      return {
        ...item,
        price: p.price,
        name: p.name
      };
    });

    const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const order: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      userId: db.currentUser.id,
      items: orderItems,
      total,
      status: OrderStatus.PLACED,
      createdAt: new Date().toISOString(),
      shippingAddress
    };

    db.orders.push(order);
    saveDB(db);
    
    // Initialize tracking on backend
    try {
      await serverAPI.createTracking(order.id, order, shippingAddress.city);
    } catch (error) {
      console.error('Error creating tracking:', error);
    }
    
    return order;
  },

  getOrders: async (): Promise<Order[]> => {
    await simulateDelay();
    const db = getDB();
    if (db.currentUser?.role === UserRole.ADMIN) return db.orders;
    return db.orders.filter(o => o.userId === db.currentUser?.id);
  },

  getOrderById: async (id: string): Promise<Order | undefined> => {
    await simulateDelay();
    const db = getDB();
    return db.orders.find(o => o.id === id);
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    await simulateDelay();
    const db = getDB();
    const order = db.orders.find(o => o.id === orderId);
    if (order) order.status = status;
    saveDB(db);
    
    // Update tracking on backend
    try {
      await serverAPI.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  },

  // ===== LIVE TRACKING =====
  
  getOrderTracking: async (orderId: string): Promise<any> => {
    try {
      return await serverAPI.getTracking(orderId);
    } catch (error) {
      console.error('Error fetching tracking:', error);
      // Return null if backend fails
      return null;
    }
  },

  getAllUserTrackings: async (): Promise<any[]> => {
    try {
      const user = api.getCurrentUser();
      if (!user) return [];
      return await serverAPI.getAllTrackingForUser(user.id);
    } catch (error) {
      console.error('Error fetching trackings:', error);
      return [];
    }
  },

  getWarehouseInfo: async (): Promise<any> => {
    return serverAPI.getWarehouseLocation();
  },

  getDeliveryZones: async (): Promise<any> => {
    return serverAPI.getDeliveryZones();
  },

  // ===== ADMIN ANALYTICS =====
  
  getAdminStats: async (): Promise<DashboardStats> => {
    await simulateDelay();
    const db = getDB();
    return {
      totalOrders: db.orders.length,
      totalRevenue: db.orders.reduce((acc, o) => acc + o.total, 0),
      totalProducts: db.products.length,
      totalCustomers: db.users.filter(u => u.role === UserRole.CUSTOMER).length,
      inTransit: db.orders.filter(o => o.status === OrderStatus.SHIPPED).length,
      pending: db.orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.PACKED).length,
      delivered: db.orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    };
  }
};
