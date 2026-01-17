
import React from 'react';
import { 
  ShoppingBag, Smartphone, Watch, Gamepad2, Shirt, Laptop as LaptopIcon, Camera, 
  Home as HomeIcon, Sparkles, Star, Gift, Package, ShoppingCart, User, ShieldCheck, Heart, Box, Baby
} from 'lucide-react';
import { CartItem, ProductCategory } from './types';

// Helper for Indian Currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

// Context State
export const AppContext = React.createContext<{
  user: any;
  setUser: any;
  cart: CartItem[];
  wishlist: string[];
  addToCart: (pid: string, qty: number) => void;
  removeFromCart: (pid: string) => void;
  clearCart: () => void;
  toggleWishlist: (pid: string) => void;
  logout: () => void;
  bgCategory: string;
  setBgCategory: (cat: string) => void;
} | null>(null);

export const SiteLoader = ({ message = "Click Bazaar" }: { message?: string }) => (
  <div className="fixed inset-0 z-[9999] bg-[#ffffff] flex flex-col items-center justify-center overflow-hidden">
    <style>{`
      .loader-container {
        position: relative;
        width: 200px;
        height: 240px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        animation: loader-fade-in 0.6s ease-out;
      }

      @keyframes loader-fade-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }

      .basket-wrapper {
        position: relative;
        margin-top: 60px;
        animation: basket-bounce 2s ease-in-out infinite;
        z-index: 10;
      }

      .basket-shadow {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 10px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 50%;
        filter: blur(4px);
        animation: shadow-scale 2s ease-in-out infinite;
      }

      .falling-item {
        position: absolute;
        top: -120px;
        opacity: 0;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        animation: item-fall-dynamic 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      .f-1 { animation-delay: 0s; color: #6366f1; }
      .f-2 { animation-delay: 0.6s; color: #ec4899; }
      .f-3 { animation-delay: 1.2s; color: #10b981; }
      .f-4 { animation-delay: 1.8s; color: #f59e0b; }

      @keyframes basket-bounce {
        0%, 100% { transform: translateY(0) scale(1, 1); }
        45% { transform: translateY(-15px) scale(0.9, 1.1); }
        50% { transform: translateY(0) scale(1.1, 0.9); }
        55% { transform: translateY(5px) scale(1.05, 0.95); }
      }

      @keyframes shadow-scale {
        0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.1; }
        50% { transform: translateX(-50%) scale(1.4); opacity: 0.05; }
      }

      @keyframes item-fall-dynamic {
        0% {
          transform: translateY(0) rotate(-20deg) scale(0.5);
          opacity: 0;
          filter: blur(8px);
        }
        15% {
          opacity: 1;
          filter: blur(0);
        }
        50% {
          transform: translateY(180px) rotate(380deg) scale(1.3);
          opacity: 1;
        }
        70% {
          transform: translateY(200px) rotate(400deg) scale(0);
          opacity: 0;
        }
        100% { transform: translateY(200px) scale(0); opacity: 0; }
      }

      .impact-ring {
        position: absolute;
        bottom: 15px;
        width: 120px;
        height: 50px;
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 50%;
        opacity: 0;
        animation: ripple-dynamic 2.5s ease-out infinite;
      }

      @keyframes ripple-dynamic {
        0%, 45% { transform: scale(0.3); opacity: 0; }
        55% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.8); opacity: 0; }
      }

      .loader-bg-pulse {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
        animation: bg-pulse 4s ease-in-out infinite;
      }

      @keyframes bg-pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }

      .branding-text {
        margin-top: 60px;
        text-align: center;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .branding-text h2 {
        font-size: 1.75rem;
        font-weight: 800;
        color: #1e293b;
        margin-bottom: 8px;
        background: linear-gradient(135deg, #4f46e5 0%, #ec4899 50%, #4f46e5 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine-text 3s linear infinite;
      }

      @keyframes shine-text {
        to { background-position: 200% center; }
      }

      .branding-text p {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.4em;
        color: #94a3b8;
        font-weight: 700;
        animation: pulse-op 2s ease-in-out infinite;
      }

      @keyframes pulse-op {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `}</style>

    <div className="loader-bg-pulse"></div>

    <div className="loader-container">
      {/* Falling Items Catching Scene */}
      <div className="falling-item f-1"><Smartphone size={28} /></div>
      <div className="falling-item f-2"><Watch size={28} /></div>
      <div className="falling-item f-3"><Gamepad2 size={28} /></div>
      <div className="falling-item f-4"><Shirt size={28} /></div>

      <div className="basket-wrapper">
        <div className="p-7 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-transparent to-pink-50/20 pointer-events-none"></div>
          <ShoppingBag size={64} className="text-indigo-600 relative z-10" strokeWidth={1.2} />
        </div>
        <div className="impact-ring"></div>
      </div>
      
      <div className="basket-shadow"></div>
    </div>

    <div className="branding-text">
      <h2 className="animate-pulse">{message}</h2>
      <p>Curating Your Experience</p>
    </div>
  </div>
);

// Simple spinning circle loader for cart navigation
export const CartLoader = () => (
  <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-xl flex items-center justify-center">
    <div className="w-16 h-16 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

// Page Transition Component
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

// Category Background Component for animated icons
export const CategoryBackground = ({ category }: { category: string }) => {
  const getIcons = () => {
    switch(category) {
      case ProductCategory.MENS_WEAR: return Shirt;
      case ProductCategory.WOMENS_WEAR: return ShoppingBag;
      case ProductCategory.KIDS_WEAR: return Baby;
      case ProductCategory.MOBILE: return Smartphone;
      case ProductCategory.ELECTRONICS: return LaptopIcon;
      case ProductCategory.MENS_WATCHES: return Watch;
      case ProductCategory.WOMENS_WATCHES: return Heart;
      case ProductCategory.HOME: return HomeIcon;
      case ProductCategory.GROCERY: return ShoppingBag;
      case ProductCategory.BEAUTY: return Sparkles;
      case 'Profile': return User;
      case 'Security': return ShieldCheck;
      default: return ShoppingBag;
    }
  };

  const Icon = getIcons();
  
  const positions = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: Math.random() * 105 - 2.5,
      left: Math.random() * 105 - 2.5,
      delay: Math.random() * 5,
      size: Math.random() > 0.5 ? 60 : 100,
      duration: 10 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50/20">
      <div className="category-bg-icons w-full h-full relative">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="icon-float absolute"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              animationDelay: `${pos.delay}s`,
              animationDuration: `${pos.duration}s`,
              width: pos.size,
              height: pos.size,
              opacity: 0.12
            }}
          >
            <Icon size={pos.size - 20} strokeWidth={0.5} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Transaction/Checkout Loader
export const TransactionLoader = ({ message = "Processing Transaction" }: { message?: string }) => (
  <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-hidden">
    <div className="relative w-80 md:w-96 bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 blur-3xl rounded-full"></div>

      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-3xl" style={{
        background: 'linear-gradient(45deg, #10b981, #3b82f6, #f59e0b)',
        padding: '2px',
        borderRadius: '24px',
        animation: 'border-rotate 3s linear infinite'
      }}>
        <div className="absolute inset-0.5 bg-white rounded-[22px]"></div>
      </div>

      <style>{`
        @keyframes border-rotate {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes transaction-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .transaction-progress {
          height: 3px;
          background: linear-gradient(90deg, #10b981, #3b82f6, #f59e0b);
          border-radius: 2px;
          animation: transaction-progress 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }

        .transaction-icon {
          animation: pulse-scale 1.5s ease-in-out infinite;
        }

        .transaction-step {
          animation: step-progress 2s ease-in-out infinite;
        }

        @keyframes step-progress {
          0% {
            opacity: 0.5;
            transform: translateX(-10px);
          }
          50% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0.5;
            transform: translateX(10px);
          }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated payment icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 blur-xl opacity-50 rounded-full"></div>
          <div className="transaction-icon w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Message and status */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>
          <p className="text-sm text-gray-500 font-medium">Please do not close this window</p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-3">
          <div className="transaction-progress"></div>
          
          {/* Processing steps */}
          <div className="flex justify-between text-xs font-semibold text-gray-600 px-1">
            <span className="transaction-step">Validating</span>
            <span className="transaction-step">Processing</span>
            <span className="transaction-step">Confirming</span>
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </div>
  </div>
);
