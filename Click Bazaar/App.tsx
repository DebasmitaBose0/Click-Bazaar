
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, User, Search, ShoppingCart, 
  LayoutDashboard, LogOut, Package, ArrowRight,
  TrendingUp, CreditCard, Box, Tag, Menu, X, Heart, Loader2, ShieldCheck, HelpCircle, Phone, Mail, MapPin, CheckCircle2,
  Smartphone, Watch, Smartphone as MobileIcon, Globe, ArrowUp, ArrowDown, ChevronLeft,
  Gamepad2, Shirt, Laptop as LaptopIcon, Camera
} from 'lucide-react';
import { api } from './services/api';
import { UserRole, Product, CartItem, ProductCategory, OrderStatus } from './types';
import { AppContext, formatCurrency, SiteLoader, CartLoader, PageTransition, TransactionLoader, CategoryBackground } from './shared';
import './styles/category-backgrounds.css';

// Pages
import HomePage from './pages/Home';
import ShopPage from './pages/Shop';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import AdminPage from './pages/Admin';
import AuthPage from './pages/Auth';
import OrderHistoryPage from './pages/OrderHistory';
import WishlistPage from './pages/Wishlist';
import ProfilePage from './pages/Profile';
import BrandPage from './pages/Brand';
import TrackingPage from './pages/Tracking';

// Components
import NotificationSystem from './components/NotificationSystem';

const SmoothScrolling = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Instantly scroll to top on route change (no smooth delay)
    window.scrollTo(0, 0);
    // Also force scroll on next frame to ensure it works
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);
  return null;
};

// Smooth Page Wrapper with location change detection
const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(window.history.length > 1);

  useEffect(() => {
    setCanGoBack(location.pathname !== '/');
  }, [location.pathname]);

  if (!canGoBack) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-32 left-6 z-40 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 group"
      title="Go Back"
    >
      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
    </button>
  );
};

// Scroll Controls Component
const ScrollControls = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!showScroll) return null;

  return (
    <div className="fixed bottom-8 right-6 z-40 flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 group"
        title="Scroll to Top"
      >
        <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
      </button>
      <button
        onClick={scrollToBottom}
        className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 group"
        title="Scroll to Bottom"
      >
        <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

const FooterModal: React.FC<{ isOpen: boolean; title: string; content: React.ReactNode; onClose: () => void }> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transform transition-all border border-transparent">
        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter static-brand-gradient">{title}</h2>
          <button onClick={onClose} className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-gray-400">
            <X size={28} />
          </button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar text-gray-600 leading-relaxed text-lg">
          {content}
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const context = React.useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigatingToCart, setIsNavigatingToCart] = useState(false);

  const cartCount = context?.cart.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const wishlistCount = context?.wishlist.length || 0;

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (context?.logout) {
      await context.logout();
      navigate('/');
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/cart') return;
    
    setIsNavigatingToCart(true);
    setTimeout(() => {
      setIsNavigatingToCart(false);
      navigate('/cart');
    }, 800);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/shop' },
    { name: 'Live Tracking', path: '/orders' }
  ];

  return (
    <>
      {isNavigatingToCart && <CartLoader />}
      <nav className="sticky top-0 z-50 relative transition-all duration-500 overflow-hidden min-h-[96px]" style={{ background: 'transparent' }}>
        {/* Force Visible High-Resolution Background Animation */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-100 pointer-events-none z-0"
          style={{ mixBlendMode: 'multiply', filter: 'brightness(1.5) contrast(1.1)' }}
        >
          <source src="/nav-chaos.mp4" type="video/mp4" />
        </video>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" onClick={handleBrandClick} className="navbar-brand flex-shrink-0 flex items-center gap-2 group relative py-2">
                <style>{`
                  @keyframes whiteShine {
                    0% { 
                      text-shadow: -10px 0 20px rgba(255, 255, 255, 0.8);
                    }
                    50% {
                      text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8);
                    }
                    100% {
                      text-shadow: 10px 0 20px rgba(255, 255, 255, 0.8);
                    }
                  }
                  .navbar-brand {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                  }
                  .navbar-brand:hover {
                    transform: scale(1.1) translateX(10px);
                  }
                  .navbar-brand:hover .click-text {
                    animation: whiteShine 0.8s ease-in-out;
                    filter: brightness(1.3) drop-shadow(0 0 15px rgba(74, 222, 128, 0.4));
                  }
                  .brand-text {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    gap: 3px;
                    align-items: baseline;
                  }
                  .click-text {
                    font-size: 2.75rem;
                    font-weight: 1000;
                    letter-spacing: -0.06em;
                    background: linear-gradient(to right, #4ade80, #facc15, #84cc16);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
                  }
                  .bazaar-text {
                    font-size: 2.75rem;
                    font-weight: 1000;
                    letter-spacing: -0.06em;
                    color: #000;
                    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
                  }
                `}</style>
                <div className="brand-text">
                  <span className="click-text">Click</span>
                  <span className="bazaar-text">Bazaar</span>
                </div>
              </Link>
              <div className="hidden md:ml-16 md:flex md:space-x-10">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={(e) => {
                      if (location.pathname !== link.path) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link to="/wishlist" className="navbar-icon-btn text-pink-500 group bg-white/60 backdrop-blur-md">
                <Heart size={24} className="transition-transform group-hover:scale-125 group-hover:fill-pink-500" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-3 -right-3 h-7 w-7 inline-flex items-center justify-center text-[11px] font-black leading-none text-white bg-gradient-to-br from-pink-500 to-rose-600 rounded-full border-2 border-white shadow-xl animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={handleCartClick} 
                className="navbar-icon-btn text-indigo-600 group outline-none bg-white/60 backdrop-blur-md"
              >
                <ShoppingCart size={24} className="transition-transform group-hover:scale-125 group-hover:fill-indigo-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-3 h-7 w-7 inline-flex items-center justify-center text-[11px] font-black leading-none text-white bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full border-2 border-white shadow-xl animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {context?.user ? (
                <div className="flex items-center gap-4 border-l-2 pl-6 border-indigo-200/40">
                  {context.user.role === UserRole.ADMIN && (
                    <Link to="/admin" className="navbar-icon-btn text-gray-700 group bg-white/60 backdrop-blur-md">
                      <LayoutDashboard size={24} className="transition-transform group-hover:scale-110" />
                    </Link>
                  )}
                  <Link to="/profile" className="navbar-profile-card flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 border-indigo-200/60 bg-white/80 backdrop-blur-md shadow-lg group hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 transform">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/40 transition-transform group-hover:scale-110 group-hover:rotate-6">
                      {context.user.name.charAt(0)}
                    </div>
                    <div className="hidden lg:flex flex-col">
                      <span className="text-sm font-black text-gray-900 leading-tight">{context.user.name}</span>
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.15em] mt-0.5">Prime Elite</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="navbar-signin-btn inline-flex items-center px-10 py-4.5 border-none text-[15px] font-black rounded-2xl text-white shadow-2xl hover:shadow-indigo-500/60 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  SIGN IN
                </Link>
              )}
            </div>

            <div className="flex items-center md:hidden gap-2">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all hover:scale-105">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-indigo-100 px-6 pt-6 pb-12 space-y-5 animate-in slide-in-from-top-12 duration-500 overflow-hidden shadow-2xl">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ animationDelay: `${idx * 100}ms` }}
                className="mobile-menu-item block px-6 py-5 rounded-3xl text-xl font-black transition-all text-gray-900 uppercase border-2 border-transparent hover:border-indigo-600 hover:bg-indigo-50/50 hover:translate-x-2 animate-in fade-in slide-in-from-left-5"
              >
                {link.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-5 pt-4">
               <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-item group flex flex-col items-center justify-center gap-2 py-6 rounded-3xl border-2 border-pink-200 text-pink-600 font-black bg-pink-50/30 hover:bg-pink-100 hover:border-pink-400 transition-all active:scale-95 shadow-lg shadow-pink-100/50">
                  <Heart size={28} className="transition-transform group-hover:scale-125 group-hover:fill-pink-500" />
                  <span className="text-xs uppercase tracking-widest">Wishlist ({wishlistCount})</span>
               </Link>
               <button onClick={handleCartClick} className="mobile-menu-item group flex flex-col items-center justify-center gap-2 py-6 rounded-3xl border-2 border-indigo-200 text-indigo-700 font-black bg-indigo-50/30 hover:bg-indigo-100 hover:border-indigo-400 transition-all active:scale-95 shadow-lg shadow-indigo-100/50">
                  <ShoppingCart size={28} className="transition-transform group-hover:scale-125 group-hover:fill-indigo-600" />
                  <span className="text-xs uppercase tracking-widest">Cart ({cartCount})</span>
               </button>
            </div>
            {context?.user ? (
              <div className="space-y-3 pt-4">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-item block w-full py-5 rounded-3xl text-center font-black text-white bg-gradient-to-r from-indigo-600 to-violet-700 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all active:scale-[0.98] uppercase tracking-widest">
                  MY PROFILE
                </Link>
                <button onClick={handleLogoutClick} className="mobile-menu-item w-full py-5 rounded-3xl text-center font-black text-red-600 bg-red-50/80 hover:bg-red-100 hover:border-red-200 border-2 border-transparent transition-all active:scale-[0.98] uppercase tracking-widest">
                  SIGN OUT
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-item block w-full py-5 rounded-3xl text-center font-black text-white bg-gradient-to-r from-indigo-600 to-violet-700 hover:shadow-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-widest">
                SIGN IN NOW
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

const KnowledgeBaseSection = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const items = [
    { title: "Tracking my Package", q: "How can I track my active ClickBazaar order?" },
    { title: "Payment Reversals", q: "What is the timeline for a failed payment refund?" },
    { title: "Prime Membership Benefits", q: "Tell me about the January 2026 Prime Elite membership." }
  ];

  return (
    <ul className="space-y-4 text-sm font-bold text-gray-500">
      {items.map(item => (
        <li 
          key={item.title}
          onClick={() => {
            onClose();
            navigate('/#ai-assistant');
          }}
          className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer transition-colors"
        >
          <CheckCircle2 size={16} /> {item.title}
        </li>
      ))}
    </ul>
  );
};

const RefreshHandler = ({ setBgCategory }: { setBgCategory: (cat: string) => void }) => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setBgCategory('General');
    else if (path === '/auth') setBgCategory('Security');
    else if (path === '/profile') setBgCategory('Profile');
    else if (path.startsWith('/admin')) setBgCategory('Security');
    // For /shop, the ShopPage handles it via URL params
  }, [location, setBgCategory]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgCategory, setBgCategory] = useState<string>('General');
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({ isOpen: false, title: '', content: null });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = api.getCurrentUser();
        if (currentUser && !user) setUser(currentUser);
        const savedCart = localStorage.getItem('clickbazaar_cart');
        if (savedCart) setCart(JSON.parse(savedCart || '[]'));
        const savedWishlist = localStorage.getItem('clickbazaar_wishlist');
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist || '[]'));
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        // Moderate timeout for the initial experience
        setTimeout(() => setLoading(false), 1200);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('clickbazaar_cart', JSON.stringify(cart));
      localStorage.setItem('clickbazaar_wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, user]);

  const addToCart = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + quantity) } : i);
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => setCart(prev => prev.filter(i => i.productId !== productId)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('clickbazaar_cart');
    localStorage.removeItem('clickbazaar_wishlist');
  }, []);

  const openFooterModal = (type: string) => {
    const configs: Record<string, { title: string; content: React.ReactNode }> = {
      privacy: {
        title: 'Privacy Center',
        content: (
          <div className="space-y-10">
            <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100">
              <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-3 text-xl">
                <ShieldCheck size={28} /> Global Data Standard
              </h4>
              <p className="text-indigo-800 font-medium">ClickBazaar utilizes decentralized encryption protocols to ensure your data never leaves your region. We are fully compliant with Indian GDPR standards.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 border-2 border-gray-50 rounded-3xl">
                  <h5 className="font-black text-gray-900 mb-2">Biometric Security</h5>
                  <p className="text-sm">We only use browser-level biometric prompts for payment verification. No raw biometric data is sent to our servers.</p>
               </div>
               <div className="p-6 border-2 border-gray-100 rounded-3xl">
                  <h5 className="font-black text-gray-900 mb-2">Marketing Clarity</h5>
                  <p className="text-sm">Zero hidden tracking. We only use functional cookies to keep your items in your bag. Ads are strictly opt-in.</p>
               </div>
            </div>
          </div>
        )
      },
      terms: {
        title: 'Terms of Use',
        content: (
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
               <p className="font-bold text-gray-700">Last Updated: January 2026</p>
               <p className="mt-4">By engaging with the ClickBazaar platform, you enter a digital contract governed by the laws of India. We guarantee 99.9% uptime and secure logistics for V1.0.</p>
            </div>
            <section className="space-y-4">
              <h4 className="font-black text-gray-900 text-xl">Digital Ownership</h4>
              <p>All assets, logos, and UI patterns are proprietary property of ClickBazaar Private Limited. Any unauthorized scraping will be met with legal action.</p>
              <h4 className="font-black text-gray-900 text-xl">Payment Integrity</h4>
              <p>All UPI and Digital Card payments are processed via verified PCI-DSS Level 1 gateways. Users are responsible for their OTP security.</p>
            </section>
          </div>
        )
      },
      help: {
        title: 'Help Center',
        content: (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
                <HelpCircle size={40} className="mb-4 opacity-50" />
                <h5 className="text-2xl font-black mb-2">Live Support</h5>
                <p className="text-indigo-100 mb-6 font-medium">Average response time: 2 minutes.</p>
                <Link 
                  to="/#ai-assistant"
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-lg flex items-center justify-center uppercase"
                >
                  START CHAT
                </Link>
              </div>
              <div className="flex-1 bg-white border-2 border-gray-100 p-8 rounded-[2.5rem]">
                 <h5 className="text-2xl font-black mb-4 text-gray-900">Knowledge Base</h5>
                 <KnowledgeBaseSection onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} />
              </div>
            </div>
          </div>
        )
      },
      returns: {
        title: 'Returns & Warranty',
        content: (
          <div className="space-y-10">
            <div className="flex items-center gap-6 p-8 bg-green-50 rounded-[3rem] border border-green-100">
              <div className="p-6 bg-white rounded-full text-green-600 shadow-xl shadow-green-100"><CheckCircle2 size={40} /></div>
              <div>
                <h4 className="text-2xl font-black text-green-900">15-Day Instant Return</h4>
                <p className="text-green-700 font-medium">We pick it up, you get paid. Instant refund to ClickBazaar Wallet or 3-day return to source.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section>
                  <h5 className="font-black text-gray-900 mb-4 text-xl underline decoration-indigo-200 decoration-4">Electronics</h5>
                  <p className="text-sm">Standard 1-year ClickBazaar warranty plus manufacturer warranty. Includes free doorstep diagnosis.</p>
               </section>
               <section>
                  <h5 className="font-black text-gray-900 mb-4 text-xl underline decoration-indigo-200 decoration-4">Fashion</h5>
                  <p className="text-sm">Try-and-Return enabled. If it doesn't fit, exchange it with our courier at the same time.</p>
               </section>
            </div>
          </div>
        )
      },
      contact: {
        title: 'Contact Logistics',
        content: (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-3xl group cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-indigo-100">
                  <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg"><Phone size={24} /></div>
                  <div>
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">24/7 Support</h5>
                    <p className="text-xl font-black text-gray-900">1800-419-2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-gray-50 rounded-3xl group cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-indigo-100">
                  <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg"><Mail size={24} /></div>
                  <div>
                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Official Email</h5>
                    <p className="text-lg font-black text-gray-900">care@clickbazaar.com</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 p-10 rounded-[3rem] text-white relative overflow-hidden border border-transparent">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <MapPin size={48} className="text-indigo-400 mb-6" />
                <h5 className="text-2xl font-black mb-4">India Hub</h5>
                <p className="text-gray-400 font-medium leading-relaxed">
                  ClickBazaar Plaza, Tower C-14,<br/>
                  Cyber City, DLF Phase 3,<br/>
                  Gurugram, Haryana - 122002
                </p>
              </div>
            </div>
          </div>
        )
      }
    };
    setModal({ isOpen: true, ...configs[type] });
  };

  if (loading) return <SiteLoader />;

  return (
    <AppContext.Provider value={{ user, setUser, cart, wishlist, addToCart, removeFromCart, clearCart, toggleWishlist, logout, bgCategory, setBgCategory }}>
      <HashRouter>
      <SmoothScrolling />
        <ScrollToTop />
        <RefreshHandler setBgCategory={setBgCategory} />
        <CategoryBackground category={bgCategory} />
        <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
          <Navbar />
          <NotificationSystem />
          <main className="flex-grow main-content-bg relative overflow-hidden">
            <div className="relative z-10">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/brand/:brand" element={<BrandPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/admin/*" element={<AdminPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/orders" element={<OrderHistoryPage />} />
                  <Route path="/track/:orderId" element={
                    <div className="max-w-4xl mx-auto px-4 py-12">
                      <TrackingPage />
                    </div>
                  } />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </PageTransition>
            </div>
          </main>
          
          <footer className="bg-slate-950 text-gray-400 py-32 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-10 group cursor-pointer w-fit">
                    <style>{`
                      @keyframes bounce-emoji {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-8px) rotate(5deg); }
                      }
                      .emoji-bounce {
                        animation: bounce-emoji 2s ease-in-out infinite;
                      }
                    `}</style>
                    <span className="text-5xl emoji-bounce">🛍️</span>
                    <span className="text-3xl font-black static-brand-gradient">ClickBazaar</span>
                  </div>
                  <p className="max-w-md text-gray-500 leading-relaxed font-bold text-lg mb-12">
                    Redefining the digital shopping experience across India. 
                    Built on trust, powered by January 2026 innovation.
                  </p>
                  <div className="flex gap-4">
                    <button className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all border border-white/5 hover:border-white/10 group">
                      <Globe size={24} className="transition-colors" />
                    </button>
                    <button className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all border border-white/5 hover:border-white/10 group">
                      <Smartphone size={24} className="transition-colors" />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Marketplace</h4>
                  <ul className="space-y-6 text-sm font-black tracking-wider uppercase">
                    <li><button onClick={() => openFooterModal('help')} className="hover:text-indigo-400 transition-colors">Help Center</button></li>
                    <li><button onClick={() => openFooterModal('returns')} className="hover:text-indigo-400 transition-colors">Warranty</button></li>
                    <li><button onClick={() => openFooterModal('contact')} className="hover:text-indigo-400 transition-colors">Support</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Legal Hub</h4>
                  <ul className="space-y-6 text-sm font-black tracking-wider uppercase">
                    <li><button onClick={() => openFooterModal('privacy')} className="hover:text-indigo-400 transition-colors">Privacy</button></li>
                    <li><button onClick={() => openFooterModal('terms')} className="hover:text-indigo-400 transition-colors">Terms</button></li>
                  </ul>
                </div>
              </div>
              <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">© January 2026 ClickBazaar India. Built for the future, built by Debasmita and Krishanu</p>
              </div>
            </div>
          </footer>
          <FooterModal 
            isOpen={modal.isOpen} 
            title={modal.title} 
            content={modal.content} 
            onClose={() => setModal({ ...modal, isOpen: false })} 
          />
        </div>
      </HashRouter>
      </AppContext.Provider>
  );
};

export default App;
