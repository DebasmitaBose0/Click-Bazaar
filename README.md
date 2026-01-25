## <span style="color:#FF6B35">**🛍️ ClickBazaar — Premium E-commerce Platform**</span>
### <span style="color:#004E89">**January 2026 Edition**</span>

![Project Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Platform](https://img.shields.io/badge/Platform-Web-orange)
![License](https://img.shields.io/badge/License-MIT-green)

ClickBazaar is a cutting-edge, high-performance e-commerce platform designed with the future of digital shopping in mind. Built for the January 2026 marketplace, it combines ultra-fluid animations, interactive "shopping chaos" aesthetics, and a deep, immersive user interface. This is a next-generation shopping experience that prioritizes user engagement, performance, and visual excellence.

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Core Components](#-core-components)
- [API & Services](#-api--services)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Key Features

### 🎬 Animated "Shopping Chaos" Navbar
- **High-Resolution Motion Background**: A custom-designed `nav-chaos.mp4` background that brings the hustle and bustle of a modern marketplace to life right in the header.
- **Dynamic Brand Logo**: Massive, bold logotype with "Elastic Scale" and "Glow Shine" effects for maximum visual impact.
- **Glassmorphism UI**: Transparent, blurred navigation boxes and icon buttons that float elegantly over moving visuals.
- **Responsive Navigation**: Mobile-first design that adapts seamlessly across all screen sizes.

### 🎨 Visual Identity & UI/UX
- **Category-Specific Backgrounds**: Each shopping section (Men's Wear, Electronics, Books, etc.) features unique animated background icons and carefully curated color gradients.
- **Smoothness at Core**: Integrated **Lenis Smooth Scrolling** for an organic, high-end feel throughout the browsing experience.
- **Micro-interactions**: Every button, heart, and cart icon reacts to user presence with snappy, elastic animations and hover effects.
- **Accessibility First**: WCAG compliant with keyboard navigation and screen reader support.

### 💼 Powerful E-commerce Core
- **Advanced Shop Filters**: Category-driven catalog with real-time filtering and sorting capabilities.
- **Smart Cart System**: Intuitive cart management with animated bounce-badges, quantity controls, and persistent storage.
- **Personalized Experience**: User profiles with order history, wishlist management, and personalized recommendations.
- **Product Tracking**: Real-time order tracking with logistics integration and status updates.
- **Admin Dashboard**: Comprehensive admin panel for product management, inventory control, and order fulfillment.

### 🔐 Security & Performance
- **Custom Authentication**: Secure login/signup without third-party dependencies.
- **State Persistence**: Local storage support for cart and user preferences.
- **Optimized Images**: Lazy loading and responsive image handling for fast load times.
- **SEO Ready**: Meta tags, structured data, and sitemap support.

## 🛠️ Tech Stack

### Frontend
- **React 18+**: Latest React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **TypeScript**: Type-safe JavaScript for robust code
- **Lucide React**: Beautiful, consistent SVG icon library

### Animations & Interactions
- **Web Animations API**: High-performance native animations
- **CSS Keyframes**: Smooth transitions and transforms
- **Lenis Smooth Scroll**: Physics-based smooth scrolling library

### State Management & Storage
- **React Context API**: Lightweight state management
- **Local Storage**: Client-side data persistence
- **Custom Hooks**: Reusable logic for data fetching and state

### Backend Integration
- **Fetch API**: Modern HTTP client for API calls
- **Express.js**: Node.js backend framework (optional)
- **MongoDB**: NoSQL database for data storage

## 📂 Project Structure

```
Click-Bazaar/
├── Click Bazaar/                 # Main application directory
│   ├── src/                      # Source code root
│   │   ├── App.tsx              # Main application component
│   │   ├── index.tsx            # React DOM entry point
│   │   ├── main.tsx             # Vite entry point
│   │   ├── types.ts             # TypeScript type definitions
│   │   ├── shared.tsx           # Shared utilities and helpers
│   │   ├── db.ts                # Mock database/data utilities
│   │   └── index.css            # Global styles
│   ├── pages/                    # Page components
│   │   ├── Home.tsx             # Landing page with featured products
│   │   ├── Shop.tsx             # Main shopping catalog
│   │   ├── Product.tsx          # Individual product details
│   │   ├── Cart.tsx             # Shopping cart page
│   │   ├── Checkout.tsx         # Checkout and payment flow
│   │   ├── Auth.tsx             # Login/signup authentication
│   │   ├── Profile.tsx          # User profile and settings
│   │   ├── OrderHistory.tsx     # User's past orders
│   │   ├── Tracking.tsx         # Order tracking page
│   │   ├── Wishlist.tsx         # Saved items page
│   │   ├── Brand.tsx            # Brand information page
│   │   └── Admin.tsx            # Admin dashboard
│   ├── components/               # Reusable UI components
│   │   ├── CategoryBackground.tsx    # Category section backgrounds
│   │   ├── ExpandableProductCard.tsx # Product card with animations
│   │   └── NotificationSystem.tsx    # Toast/notification manager
│   ├── services/                 # API and utility services
│   │   ├── api.ts               # API service layer
│   │   ├── gemini.ts            # AI integration service
│   │   └── logistics.ts         # Shipping/tracking service
│   ├── styles/                   # Global and component styles
│   │   └── category-backgrounds.css  # Category-specific animations
│   ├── public/                   # Static assets
│   │   ├── index.html           # HTML template
│   │   └── nav-chaos.mp4        # Navbar background video
│   ├── App.tsx                  # Root component
│   ├── index.html               # Main HTML file
│   ├── index.tsx                # React mount point
│   ├── package.json             # Dependencies and scripts
│   ├── tsconfig.json            # TypeScript configuration
│   ├── vite.config.ts           # Vite configuration
│   └── server.ts                # Backend server (if applicable)
└── README.md                     # This file
```

## 🏁 Installation

### Prerequisites
- **Node.js** 16.x or higher
- **npm** 7.x or higher (or yarn/pnpm)
- **Git** for version control

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DebasmitaBose0/Click-Bazaar.git
   cd Click-Bazaar
   ```

2. **Navigate to the project**:
   ```bash
   cd "Click Bazaar"
   ```

3. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables** (if needed):
   ```bash
   # Create a .env file
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Verify installation**:
   ```bash
   npm list
   ```

## 🚀 Usage

### Development Server

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default).

### Production Build

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting & Type Checking

Check for code quality issues:

```bash
npm run lint
```

Validate TypeScript:

```bash
npm run type-check
```

## 🧩 Core Components

### CategoryBackground
Renders animated background with category-specific icons and gradients.

**Props**:
- `category` (string): Category name (e.g., "electronics", "menswear")
- `children` (ReactNode): Content to overlay

**Usage**:
```tsx
<CategoryBackground category="electronics">
  <ProductGrid products={products} />
</CategoryBackground>
```

### ExpandableProductCard
Interactive product card with expansion animation and quick actions.

**Props**:
- `product` (Product): Product object with details
- `onAddToCart` (Function): Callback for add to cart
- `onAddToWishlist` (Function): Callback for wishlist action

**Usage**:
```tsx
<ExpandableProductCard 
  product={product} 
  onAddToCart={handleCart}
  onAddToWishlist={handleWishlist}
/>
```

### NotificationSystem
Toast notification manager for alerts and feedback.

**Methods**:
- `show(message, type, duration)`: Display notification
- `success(message)`: Success notification
- `error(message)`: Error notification
- `info(message)`: Info notification

**Usage**:
```tsx
const notify = useNotification();
notify.success("Item added to cart!");
```

## 🔌 API & Services

### API Service (`services/api.ts`)
Centralized HTTP client for backend communication.

**Methods**:
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Get single product
- `POST /api/cart/add` - Add item to cart
- `POST /api/auth/login` - User login
- `POST /api/orders` - Create new order

---

### Newsletter / SendGrid integration (example)
You can enable a real transactional/newsletter provider. The repo includes a small demo server and client-side wiring.

How it works:
- Frontend will POST to a configured endpoint (env: `VITE_SUBSCRIBE_ENDPOINT`).
- If no endpoint is configured the app falls back to the in-app mock server or localStorage.

Quickstart (SendGrid example) ✅
1. Create a SendGrid API key with Mail Send & Marketing scopes.
2. Create a `.env` (or export env vars):
   - `SENDGRID_API_KEY` (server)
   - `SENDER_EMAIL` (server)
   - `VITE_SUBSCRIBE_ENDPOINT` (frontend) — e.g. `http://localhost:7777/subscribe`
3. Run the demo server (Node 18+):
   ```bash
   SENDGRID_API_KEY=xxx SENDER_EMAIL=you@domain.com npm run subscribe-demo
   # then in another terminal
   VITE_SUBSCRIBE_ENDPOINT=http://localhost:7777/subscribe npm run dev
   ```

Files provided:
- `scripts/sendgrid-subscribe-example.cjs` — minimal demo server (POST /subscribe)
- `services/api.ts` — will POST to `VITE_SUBSCRIBE_ENDPOINT` when configured

Notes & security 🔐
- Never store provider API keys in client-side code. Use a server or serverless function to keep secrets safe.
- The demo server is for local/dev only — replace with a proper backend function for production.

### Gemini Service (`services/gemini.ts`)
AI-powered product recommendations and search.

### Logistics Service (`services/logistics.ts`)
Order tracking and shipping integration.

## 👨‍💻 Development

### Code Structure Best Practices

1. **Components**: Keep components small and focused
2. **Hooks**: Extract reusable logic into custom hooks
3. **Types**: Define types in `types.ts` for global use
4. **Styling**: Use Tailwind CSS classes; avoid inline styles
5. **State**: Use Context API for global state, local state for components

### Adding New Pages

1. Create a new file in `/pages` directory
2. Import in `App.tsx`
3. Add route in routing configuration

### Adding New Components

1. Create component in `/components` directory
2. Export from component file
3. Import and use in pages or other components

### Debugging

Enable React DevTools browser extension for component inspection and state debugging.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**: Click the fork button on GitHub
2. **Create a feature branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**: Write clean, well-commented code
4. **Test thoroughly**: Ensure no breaking changes
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**: Describe changes and wait for review

### Commit Message Format
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/updates

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Debasmita Bose** - Lead Developer
- **Krishanu** - Contributor

## 🔗 Links

- [GitHub Repository](https://github.com/DebasmitaBose0/Click-Bazaar)
- [Live Demo](https://click-bazaar.vercel.app)
- [Issues](https://github.com/DebasmitaBose0/Click-Bazaar/issues)

## 📞 Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions
- Email: dbose272@gmail.com

---

**Built for the future. Built by Debasmita and Krishanu.**

*Last Updated: January 2026*
