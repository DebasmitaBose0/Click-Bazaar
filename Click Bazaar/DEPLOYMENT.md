# ClickBazaar Backend Integration & Deployment Guide

## Overview
This guide explains the new backend integration for persistent authentication and live product tracking from Barrackpore, West Bengal.

---

## 🔐 Authentication System (Backend Integration)

### How It Works

#### Local Development (Current Setup)
- **File**: `server.ts` - In-memory backend simulation
- **Authentication**: JWT-like tokens stored in browser localStorage
- **Session Management**: 24-hour token expiration
- **Fallback**: Automatically falls back to local storage if backend is unavailable

#### Key Features
```typescript
// Server-side authentication
- User registration with password hashing
- Login with session token generation
- Token verification and expiration
- Persistent session management
```

### Token Storage
Tokens are stored in `localStorage` with the key: `clickbazaar_session_token`

```typescript
// Browser Storage
localStorage.getItem('clickbazaar_session_token') // JWT-like token
localStorage.getItem('clickbazaar_db_v2.2')       // User data backup
```

### Login Flow
```
1. User enters email & password
2. serverAPI.login() creates JWT token
3. Token stored in localStorage for 24 hours
4. Token validated on every API call
5. Automatic logout on token expiration
```

---

## 📍 Live Product Tracking System

### Warehouse Location
**Barrackpore, West Bengal, India**
- Latitude: 22.7646
- Longitude: 88.2632
- Pincode: 700112
- State: West Bengal
- Country: India

### Delivery Zones & Timings

Delivery times calculated from Barrackpore warehouse based on destination city:

| City | Distance (km) | Delivery Days | Notes |
|------|--------------|---------------|-------|
| Kolkata | 20 | 1 | Same city delivery |
| Howrah | 35 | 1 | Adjacent district |
| Hooghly | 45 | 2 | Next district |
| Durgapur | 180 | 3 | Industrial hub |
| Siliguri | 600 | 5 | North Bengal |
| Darjeeling | 700 | 6 | Hill station |
| Assam | 800 | 7 | Northeast region |
| Bangalore | 1800 | 6 | South India |
| Mumbai | 1950 | 5 | West India |
| Delhi | 1450 | 4 | North India |
| Chennai | 1900 | 7 | South India |
| Hyderabad | 1300 | 5 | South-Central India |

### Tracking Data Structure

```typescript
interface TrackingData {
  orderId: string;           // Order ID
  status: OrderStatus;       // PLACED | PACKED | SHIPPED | DELIVERED
  currentLocation: string;   // Current warehouse/city
  lastUpdated: string;       // ISO timestamp
  estimatedDelivery: string; // ISO timestamp
  deliveryDays: number;      // Total days for delivery
  progress: number;          // 0-100% completion
  coordinates: {             // GPS coordinates
    lat: number;
    lng: number;
  };
  milestones: {             // Delivery timeline
    placed: { date: string; completed: boolean };
    packed: { date: string; completed: boolean };
    shipped: { date: string; completed: boolean };
    delivered: { date: string; completed: boolean };
  };
}
```

### Order Tracking Flow

```
1. Order Placed (Day 0)
   └─ Status: PLACED (0% progress)
   └─ Location: Barrackpore Warehouse
   └─ Notification: Order confirmation

2. Order Packed (Day 0-1)
   └─ Status: PLACED → PACKED
   └─ Progress: 25%
   └─ Notification: Order packed

3. Shipped (Day 1-2)
   └─ Status: PACKED → SHIPPED
   └─ Progress: 50%
   └─ Location: In transit
   └─ Notification: Order shipped with tracking

4. Out for Delivery (Day 2-5)
   └─ Status: SHIPPED
   └─ Progress: 75%
   └─ Location: Local delivery hub
   └─ Notification: Out for delivery

5. Delivered
   └─ Status: DELIVERED
   └─ Progress: 100%
   └─ Location: Customer address
   └─ Notification: Delivery confirmation
```

---

## 🚀 Deployment Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (for production database)
- Environment variables configured

### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Test build locally
npm run preview
```

### Production Deployment

#### Option 1: Vercel (Recommended for Vite)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configure environment variables in Vercel dashboard
VITE_API_URL=https://your-backend.com
VITE_JWT_SECRET=your-secret-key
```

#### Option 2: Node.js Server (Express Backend)

**Create `server/index.js`**:
```javascript
import express from 'express';
import cors from 'cors';
import { serverAPI } from './server.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await serverAPI.login(email, password);
  res.json({ user, token });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await serverAPI.register(name, email, password);
  res.json({ user, token });
});

// Tracking endpoints
app.get('/api/tracking/:orderId', async (req, res) => {
  const tracking = await serverAPI.getTracking(req.params.orderId);
  res.json(tracking);
});

app.post('/api/tracking', async (req, res) => {
  const { orderId, order, city } = req.body;
  const tracking = await serverAPI.createTracking(orderId, order, city);
  res.json(tracking);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### Option 3: Docker Deployment

**Create `Dockerfile`**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Deploy**:
```bash
docker build -t clickbazaar .
docker run -p 3000:3000 clickbazaar
```

---

## 🗄️ Database Integration (Production)

### MongoDB Connection

**Update `server.ts`** for MongoDB:

```typescript
import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  password: String, // Hash with bcrypt
  role: String,
  createdAt: { type: Date, default: Date.now }
});

// Order Tracking Schema
const trackingSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  status: String,
  currentLocation: String,
  estimatedDelivery: Date,
  milestones: Object,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Tracking = mongoose.model('Tracking', trackingSchema);

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);
```

### Environment Variables

Create `.env.local`:
```env
VITE_API_URL=http://localhost:3000
VITE_JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/clickbazaar
NODE_ENV=production
```

---

## 🔄 API Endpoints

### Authentication

```
POST /api/auth/login
- Body: { email, password }
- Response: { user, token }

POST /api/auth/register
- Body: { name, email, password }
- Response: { user, token }

POST /api/auth/logout
- Body: { token }
```

### Tracking

```
GET /api/tracking/:orderId
- Response: TrackingData

POST /api/tracking
- Body: { orderId, order, city }
- Response: TrackingData

GET /api/warehouse
- Response: { city, state, coordinates }

GET /api/delivery-zones
- Response: { [city]: { distance, days } }
```

---

## ✅ Testing

### Manual Testing

1. **Login Test**
   ```
   Email: admin@clickbazaar.com
   Password: password123
   ```

2. **Tracking Test**
   - Place an order
   - Note the Order ID
   - Navigate to Order History
   - View live tracking

3. **Location Test**
   - Test orders to different cities
   - Verify delivery dates change based on zone
   - Check milestone progression

---

## 🔒 Security Considerations

### For Production:

1. **Password Hashing**
   ```typescript
   import bcrypt from 'bcrypt';
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **JWT Secret**
   - Use strong, random secret
   - Store in environment variables
   - Rotate periodically

3. **HTTPS Only**
   - Enable SSL/TLS
   - Use secure cookies
   - Set CORS properly

4. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use(limiter);
   ```

5. **SQL Injection Prevention**
   - Use parameterized queries
   - Validate all inputs
   - Use ORM frameworks

---

## 📊 Monitoring & Analytics

### Track These Metrics:
- Total orders per day
- Average delivery time
- Delivery success rate by city
- User signup/login rates
- Order cancellation rate

### Tools:
- Google Analytics
- Sentry (error tracking)
- LogRocket (session replay)
- DataDog (monitoring)

---

## 🆘 Troubleshooting

### Common Issues:

**Issue**: Token expired
```
Solution: Refresh token automatically or redirect to login
```

**Issue**: Tracking not updating
```
Solution: Check serverAPI.getTracking() is called
         Verify order dates are correct
```

**Issue**: Wrong delivery dates
```
Solution: Verify city name matches DELIVERY_ZONES
         Check date calculation logic
```

**Issue**: Backend connection failed
```
Solution: Falls back to localStorage automatically
         Check network connectivity
         Verify API URL in environment
```

---

## 📞 Support

For deployment help:
- Check backend server logs
- Review browser console for errors
- Test API endpoints with Postman
- Contact: support@clickbazaar.in

---

## 🗓️ Migration Guide (From Local to Cloud)

1. Export current local data
2. Set up MongoDB cluster
3. Configure environment variables
4. Deploy backend server
5. Update API endpoints
6. Run data migration scripts
7. Test thoroughly
8. Update DNS/domain
9. Monitor for issues

---

**Last Updated**: January 11, 2026
**ClickBazaar v1.0** - Made in India 🇮🇳
