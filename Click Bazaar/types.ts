
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PLACED = 'PLACED',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

export enum ProductCategory {
  MENS_WEAR = "Men's Wear",
  WOMENS_WEAR = "Women's Wear",
  KIDS_WEAR = "Kids' Wear",
  MENS_WATCHES = "Men's Watches",
  WOMENS_WATCHES = "Women's Watches",
  ELECTRONICS = 'Electronics',
  GROCERY = 'Grocery',
  MOBILE = 'Mobile',
  HOME = 'Home',
  BEAUTY = 'Beauty'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  orderId?: string;
  trackingId?: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  stock: number;
  deliveryDate?: string;
  features?: string[];
  faqs?: FAQ[];
  reviews?: Review[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { price: number; name: string })[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  inTransit?: number;
  pending?: number;
  delivered?: number;
}
