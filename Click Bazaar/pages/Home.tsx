import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExpandableProductCard } from '../components/ExpandableProductCard';
import { ArrowRight, Smartphone, Watch, Laptop, ShoppingBag, Zap, MessageSquare, Shirt, Baby, Clock, Loader2, Star, TrendingUp, Sparkles, Truck, ShieldCheck, Apple, HelpCircle, ChevronRight, ChevronLeft, Users, Award, Gift, Zap as ZapIcon, Mail, Flame, Eye, Heart as HeartIcon, TrendingUp as TrendingIcon, Zap as ZapCheckIcon, CheckCircle2, Headphones, RotateCcw, X, Lock, User, Palette } from 'lucide-react';
import { ProductCategory, Product } from '../types';
import { AppContext } from '../shared';
import { api } from '../services/api';

const assistantKnowledgeBase = [
  {
    q: "How do I track my order?",
    a: "Just head to our tracking page and enter your order number. You'll see exactly where your package is right now."
  },
  {
    q: "How much is shipping?",
    a: "Free shipping on orders over ₹1500! Otherwise, it's just ₹99. Pretty straightforward."
  },
  {
    q: "When will I get my order?",
    a: "Most orders arrive within 2-3 days. If you're in a major city, sometimes even sooner."
  },
  {
    q: "Is my information safe?",
    a: "Yes, completely. We use the same security banks use to protect your payment info and personal details."
  },
  {
    q: "What if I don't like it?",
    a: "No problem! You have 15 days to return anything. We'll pick it up from you and send your money back."
  },

];

const CategoryCard = ({ icon: Icon, title, color, desc }: any) => {
  const getCategoryBgGradient = (title: string) => {
    const gradients: { [key: string]: string } = {
      "Men's Wear": 'from-blue-100/80 to-indigo-100/40 border-blue-300/50 hover:border-blue-400',
      "Women's Wear": 'from-pink-100/80 to-rose-100/40 border-pink-300/50 hover:border-pink-400',
      "Kids' Wear": 'from-amber-100/80 to-yellow-100/40 border-amber-300/50 hover:border-amber-400',
      "Men's Watches": 'from-slate-100/80 to-gray-100/40 border-slate-300/50 hover:border-slate-400',
      "Mobile": 'from-indigo-100/80 to-blue-100/40 border-indigo-300/50 hover:border-indigo-400',
      "Electronics": 'from-violet-100/80 to-purple-100/40 border-violet-300/50 hover:border-violet-400',
      "Women's Watches": 'from-rose-100/80 to-pink-100/40 border-rose-300/50 hover:border-rose-400',
      "Home": 'from-emerald-100/80 to-teal-100/40 border-emerald-300/50 hover:border-emerald-400',
      "Grocery": 'from-green-100/80 to-lime-100/40 border-green-300/50 hover:border-green-400',
      "Beauty": 'from-fuchsia-100/80 to-purple-100/40 border-fuchsia-300/50 hover:border-fuchsia-400'
    };
    return gradients[title] || 'from-indigo-100/80 to-indigo-50/40 border-indigo-300/50';
  };

  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(title)}`}
      className={`group relative flex flex-col items-center p-4 sm:p-5 md:p-8 bg-gradient-to-br ${getCategoryBgGradient(title)} backdrop-blur-md rounded-2xl md:rounded-[2rem] border-2 shadow-lg hover:shadow-2xl hover:shadow-current/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
    >
      <div className={`mb-3 sm:mb-4 md:mb-6 transition-all duration-300 group-hover:scale-110 ${color.replace('bg-', 'text-')}`}>
        <Icon size={36} className="sm:w-10 sm:h-10 md:w-12 md:h-12" />
      </div>
      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors text-center leading-snug flex items-center justify-center gap-2">
        {title}
      </h3>

      {/* Beauty animated decorative background (purely presentational) */}
      {title === ProductCategory.BEAUTY && (
        <div aria-hidden className="absolute inset-0 pointer-events-none beauty-animated-decor">
          <svg className="beauty-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img">
            <defs>
              <linearGradient id="bbGrad" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.08" />
                <stop offset="40%" stopColor="#fbcfe8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f0abfc" stopOpacity="0.10" />
              </linearGradient>
            </defs>
            <g transform="translate(300,300)">
              <path className="blob-path" d="M120 -160C164 -130 201 -84 213 -28C224 28 210 94 174 137C138 180 80 200 23 191C-34 182 -68 144 -106 105C-144 66 -186 26 -193 -32C-200 -90 -172 -158 -118 -189C-63 -220 17 -213 72 -187C127 -161 76 -190 120 -160Z" fill="url(#bbGrad)" />
            </g>
          </svg>
          <div className="beauty-sparkles" />
        </div>
      )}

      <p className="text-gray-600 mt-2 md:mt-3 text-xs md:text-sm text-center leading-relaxed px-2">{desc}</p>
      <div className="mt-4 md:mt-6 flex items-center gap-1 text-[8px] md:text-[9px] font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all">
        Explore <ArrowRight size={12} className="group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const context = useContext(AppContext);
  const { setBgCategory } = context!;
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);

  // Newsletter state + handler (was missing — caused runtime error)
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const email = newsletterEmail.trim();
    const emailRx = /^\S+@\S+\.\S+$/;
    if (!emailRx.test(email)) {
      setNewsletterMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      setNewsletterLoading(true);
      await api.subscribe(email);
      setNewsletterMessage({ type: 'success', text: "You're subscribed — check your inbox!" });
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterMessage({ type: 'error', text: err?.message || 'Subscription failed. Please try again.' });
    } finally {
      setNewsletterLoading(false);
      window.setTimeout(() => setNewsletterMessage(null), 4500);
    }
  };

  useEffect(() => {
    setBgCategory('General');
  }, [setBgCategory]);

  const heroImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1920"
  ];

  useEffect(() => {
    const fetchFlashDeals = async () => {
      const all = await api.getProducts();
      // Get 4 random products for flash deals
      setFlashDeals(all.sort(() => 0.5 - Math.random()).slice(0, 4));
    };
    fetchFlashDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // --- Testimonials carousel data & controls ---
  const testimonials = [
    { name: "Priya Singh", role: "Fashion Enthusiast", image: "https://i.pravatar.cc/150?img=1", text: "ClickBazaar's collection is absolutely stunning! The quality is premium and delivery was faster than expected." },
    { name: "Rajesh Kumar", role: "Tech Lover", image: "https://i.pravatar.cc/150?img=2", text: "Best place for electronics. Great prices, authentic products, and excellent after-sales support." },
    { name: "Ananya Patel", role: "Home Decor Expert", image: "https://i.pravatar.cc/150?img=3", text: "The curated home collection transformed my space. Love the attention to detail and customer service." },
    { name: "Sahil Verma", role: "Frequent Buyer", image: "https://i.pravatar.cc/150?img=4", text: "Checkout was seamless and support helped me pick the perfect size. Highly recommend." },
    { name: "Meera Joshi", role: "Gift Shopper", image: "https://i.pravatar.cc/150?img=5", text: "Beautiful gift-wrap options and the recipient loved the present — five stars for presentation." },
    { name: "Arjun Rao", role: "Gadget Reviewer", image: "https://i.pravatar.cc/150?img=6", text: "Authentic specs and honest listings. Received exactly what was described." },
    { name: "Ritika Sen", role: "Interior Stylist", image: "https://i.pravatar.cc/150?img=7", text: "Quality home decor that doesn't break the bank — curated and stylish." }
  ];

  const testimonialsRef = React.useRef<HTMLDivElement | null>(null);
  const autoplayRef = React.useRef<number | null>(null);
  const isPausedRef = React.useRef(false);
  const [activeTestIndex, setActiveTestIndex] = useState(0);

  // update active index based on scroll position (keeps indicators in sync)
  useEffect(() => {
    const el = testimonialsRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      // find the child whose center is closest to container center
      let closestIdx = 0;
      let closestDist = Infinity;
      children.forEach((c, i) => {
        const cCenter = c.offsetLeft + c.offsetWidth / 2;
        const dist = Math.abs(cCenter - center);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      if (closestIdx !== activeTestIndex) {
        setActiveTestIndex(closestIdx);
      }
      // small debug to help verify behavior in browser console
      // eslint-disable-next-line no-console
      console.debug('testimonials:onScroll', { scrollLeft: el.scrollLeft, active: closestIdx });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [activeTestIndex]);

  // autoplay (scrolls by one card width). pauses on hover/focus.
  useEffect(() => {
    const el = testimonialsRef.current || document.querySelector('[aria-label="Customer testimonials carousel"]') as HTMLElement | null;
    if (!el) return;
    const step = (() => {
      const first = el.querySelector('.snap-start') as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).gap || (getComputedStyle(el) as any).columnGap || '24') || 24;
      return first ? first.offsetWidth + gap : Math.round(el.clientWidth * 0.85);
    })();
    const play = () => {
      if (isPausedRef.current) return;
      // eslint-disable-next-line no-console
      console.debug('testimonials:autoplay -> step', step);
      el.scrollBy({ left: step, behavior: 'smooth' });
    };
    autoplayRef.current = window.setInterval(play, 4500);
    return () => { if (autoplayRef.current) window.clearInterval(autoplayRef.current); };
  }, []);

  const scrollToIndex = (i: number) => {
    const el = testimonialsRef.current || document.querySelector('[aria-label="Customer testimonials carousel"]') as HTMLElement | null;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    // eslint-disable-next-line no-console
    console.debug('testimonials:scrollToIndex', i, child.offsetLeft);
    el.scrollTo({ left: Math.max(0, child.offsetLeft - 16), behavior: 'smooth' });
  };

  const computeStep = (el: HTMLElement) => {
    const first = el.querySelector('.snap-start') as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).gap || (getComputedStyle(el) as any).columnGap || '24') || 24;
    return first ? first.offsetWidth + gap : Math.round(el.clientWidth * 0.85);
  };

  const scrollNext = () => {
    const el = testimonialsRef.current || document.querySelector('[aria-label="Customer testimonials carousel"]') as HTMLElement | null;
    if (!el) return;
    const step = computeStep(el);
    // eslint-disable-next-line no-console
    console.debug('testimonials:next', { step });
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const scrollPrev = () => {
    const el = testimonialsRef.current || document.querySelector('[aria-label="Customer testimonials carousel"]') as HTMLElement | null;
    if (!el) return;
    const step = computeStep(el);
    // eslint-disable-next-line no-console
    console.debug('testimonials:prev', { step });
    el.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const pauseAutoplay = () => { isPausedRef.current = true; };
  const resumeAutoplay = () => { isPausedRef.current = false; };
  // keyboard support when carousel is focused
  const onKeyDownCarousel = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollPrev(); }
  };
  // --- end testimonials carousel ---

  // --- Marketplace statistics animation (count-up + entrance) ---
  const statsRef = React.useRef<HTMLDivElement | null>(null);
  const statsAnimatedRef = React.useRef(false);
  const [statsInView, setStatsInView] = useState(false);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, rating: 0 });
  const statsTargets = { users: 8500, products: 2800, orders: 9200, rating: 4.8 };

  const formatCompact = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
    if (n >= 1000) {
      const v = n / 1000;
      return v % 1 === 0 ? `${v.toFixed(0)}K+` : `${v.toFixed(1)}K+`;
    }
    return `${n}`;
  };

  React.useEffect(() => {
    const el = statsRef.current;
    if (!el || statsAnimatedRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statsAnimatedRef.current = true;
          setStatsInView(true);
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
            setStats({
              users: Math.round(statsTargets.users * ease),
              products: Math.round(statsTargets.products * ease),
              orders: Math.round(statsTargets.orders * ease),
              rating: Math.min(statsTargets.rating, Number((statsTargets.rating * ease).toFixed(1)))
            });
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      });
    }, { threshold: 0.45 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  // --- end marketplace stats ---

  const categoriesData = [
    { icon: Shirt, title: ProductCategory.MENS_WEAR, color: "bg-blue-600", desc: "Stylish shirts, comfortable basics, everyday wear" },
    { icon: ShoppingBag, title: ProductCategory.WOMENS_WEAR, color: "bg-pink-600", desc: "Dresses, tops, bottoms you'll love" },
    { icon: Baby, title: ProductCategory.KIDS_WEAR, color: "bg-amber-500", desc: "Comfy and cute clothes for the little ones" },
    { icon: Clock, title: ProductCategory.MENS_WATCHES, color: "bg-gray-900", desc: "Classic watches for every style" },
    { icon: Smartphone, title: ProductCategory.MOBILE, color: "bg-indigo-600", desc: "Latest phones and cool accessories" },
    { icon: Laptop, title: ProductCategory.ELECTRONICS, color: "bg-violet-600", desc: "Great gadgets and tech you need" },
    { icon: Watch, title: ProductCategory.WOMENS_WATCHES, color: "bg-rose-500", desc: "Beautiful watches for any occasion" },
    { icon: Zap, title: ProductCategory.HOME, color: "bg-emerald-600", desc: "Smart home stuff and nice decor" },
    { icon: Apple, title: ProductCategory.GROCERY, color: "bg-lime-600", desc: "Fresh food, coffee, everyday essentials" },
    { icon: Palette, title: ProductCategory.BEAUTY, color: "bg-fuchsia-500", desc: "Skincare, makeup, and nice scents" },
  ];

  const sortedCategories = [...categoriesData].sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    if (location.hash === '#ai-assistant') {
      aiSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col overflow-x-hidden mobile-safe">
      {/* Hero Slideshow Section */}
      <section className="bg-white py-6 sm:py-8 md:py-10 border-b border-gray-100 mx-3 sm:mx-4 md:mx-6 rounded-2xl md:rounded-3xl shadow-lg relative z-20 transition-colors -mt-6 md:-mt-10 overflow-hidden">

        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              style={{ transition: 'opacity 1s ease-in-out, transform 10s linear' }}
            >
              <img 
                src={img} 
                alt={`Hero ${idx}`} 
                className="w-full h-full object-top md:object-center object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 md:from-slate-900/90 via-slate-900/30 md:via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-md text-indigo-300 mb-4 md:mb-6">
               <span className="text-[8px] md:text-[9px] font-semibold uppercase tracking-widest">Shop Online</span>
            </div>
            
            <h1 className="hero-title text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 md:mb-5">
              Everything You Need <br className="hidden sm:block" /> 
              <span className="static-brand-gradient">In One Place</span>
            </h1>
            
            <p className="hero-lead text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 md:mb-8 leading-relaxed font-medium max-w-lg">
              Great products, fast delivery. Everything from fashion to electronics, all in one store.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-sm sm:max-w-none">
              <Link to="/shop" className="relative overflow-hidden btn-gradient w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-white text-sm md:text-base rounded-lg md:rounded-xl font-bold flex items-center justify-center shadow-lg group">
                <span aria-hidden className="btn-gradient__shine" />
                <span className="relative z-10 flex items-center">
                  Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </Link>
              <Link to="/orders" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/16 sm:bg-white/8 text-white shadow-sm ring-1 ring-white/10 border border-white/10 rounded-lg md:rounded-xl font-bold text-sm md:text-base backdrop-blur-xl transition-all text-center">
                Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Slideshow Indicators */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-full overflow-hidden px-2">

          {heroImages.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentHeroIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust & Metrics */}
      <section className="bg-white py-6 sm:py-8 md:py-10 border-b border-gray-100 rounded-2xl md:rounded-3xl shadow-lg relative z-20 transition-colors -mt-8 md:-mt-10 mx-4 sm:mx-6 lg:mx-auto max-w-7xl">

         <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group cursor-pointer">
               <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Truck size={20} /></div>
               <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm leading-none">Global Logistics</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold mt-1">Free delivery over ₹1500</p>
               </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 border-gray-100 sm:border-x group cursor-pointer">
               <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><ShieldCheck size={20} /></div>
               <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm leading-none">Buyer Protection</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold mt-1">100% Secure Checkout</p>
               </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4 group cursor-pointer">
               <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><TrendingUp size={20} /></div>
               <div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm leading-none">Quality Assurance</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold mt-1">Curated premium partners</p>
               </div>
            </div>
         </div>
      </section>

      {/* Categorical Boutiques */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden transition-colors">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
           <div className="hidden md:block absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" aria-hidden></div>
           <div className="hidden md:block absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-pink-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" aria-hidden></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Explore Our <span className="static-brand-gradient">Products</span>
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Curated spaces designed for the modern connoisseur. Discover high-end fashion, 
              cutting-edge tech, and lifestyle essentials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {sortedCategories.map((cat, idx) => (
              <div key={idx} className="h-full">
                <CategoryCard icon={cat.icon} title={cat.title} color={cat.color} desc={cat.desc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant (Knowledge Base Version) */}
      <section ref={aiSectionRef} id="ai-assistant" className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden transition-colors">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-[0.05]" alt="Tech Background" />
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 to-slate-950"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
               <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30"><Sparkles size={20} /></div>
               <span className="text-indigo-400 font-black tracking-widest text-[9px] uppercase">Bazaar Concierge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-tight">
              Intelligent Shopping <br/>
              <span className="static-brand-gradient">Support</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-10 font-medium leading-relaxed max-w-md">
              Select a question below to learn more about our operations and boutique services.
            </p>
            
            <div className="space-y-3 max-w-xl">
              {assistantKnowledgeBase.map((item, idx) => (
                <div key={idx} className="group">
                  <button 
                    onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)}
                    className={`w-full text-left px-6 py-4 rounded-2xl border transition-all flex items-center justify-between font-bold text-sm ${
                      activeQuestion === idx 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/20' 
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                       <HelpCircle size={18} className={activeQuestion === idx ? 'text-indigo-200' : 'text-indigo-500'} />
                       {item.q}
                    </span>
                    <ChevronRight size={18} className={`transition-transform duration-300 ${activeQuestion === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {activeQuestion === idx && (
                    <div className="mt-2 p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <p className="text-gray-300 text-sm font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto">
             <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
               <img 
                 src="https://i.guim.co.uk/img/media/972c2e5d838f1bcb3cc96affbda5e3de93f85095/0_343_5138_3082/master/5138.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=36b682eeb6bbc2cc825f41d1b49431d9" 
                 alt="Style Concierge" 
                 className="w-full h-[400px] sm:h-[450px] lg:h-[520px] object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
               <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 p-6 sm:p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem]">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-white font-black text-lg sm:text-xl tracking-tight">Instant Assistance</p>
                 </div>
                 <p className="text-indigo-300 font-bold uppercase tracking-widest text-[9px]">Verified Support Core</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Seasonal Promos */}
      <section className="py-16 sm:py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="group relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden h-[400px] sm:h-[450px] lg:h-[520px] shadow-xl hover:shadow-[0_30px_70px_-15px_rgba(79,70,229,0.3)] hover:scale-[1.02] hover:-translate-y-2 transition-all duration-700 ease-out cursor-pointer">
               <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Luxury Watch" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent group-hover:from-indigo-900/80 transition-all duration-700"></div>
               <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="inline-block bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-3 sm:mb-4">January Arrival</span>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tighter leading-none">WATCH <br/>STUDIO</h3>
                    <p className="text-indigo-100/60 font-medium text-sm mb-4 sm:mb-6 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Exquisite horology crafted for premium precision.</p>
                    <Link to="/shop?category=Men's Watches" className="w-fit px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                      EXPLORE TIMEPIECES <ArrowRight size={14} />
                    </Link>
                  </div>
               </div>
            </div>
            
            <div className="group relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden h-[400px] sm:h-[450px] lg:h-[520px] shadow-xl hover:shadow-[0_30px_70px_-15px_rgba(219,39,119,0.3)] hover:scale-[1.02] hover:-translate-y-2 transition-all duration-700 ease-out cursor-pointer">
               <img src="https://www.jiomart.com/images/product/original/rvww8q4azr/iloz-latest-new-luxury-silver-diamond-bracelet-strap-party-wear-watch-for-girls-women-trendy-designer-best-quartz-analog-watches-for-women-product-images-rvww8q4azr-0-202303011306.jpg?im=Resize=(1000,1000)" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Elite Couture" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent group-hover:from-pink-900/80 transition-all duration-700"></div>
               <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="inline-block bg-pink-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-3 sm:mb-4">January Edition</span>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 tracking-tighter leading-none">ELITE <br/>COUTURE</h3>
                    <p className="text-pink-100/60 font-medium text-sm mb-4 sm:mb-6 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Bespoke luxury tailored for the season.</p>
                    <Link to="/shop?category=Women's Watches" className="w-fit px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                      VIEW COLLECTION <ArrowRight size={14} />
                    </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px]" aria-hidden></div>
            <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-[100px]" aria-hidden></div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">The ClickBazaar Way</span>
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
                  Why <span className="static-brand-gradient">Shop With Us</span>
               </h2>
               <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto rounded-full mb-6"></div>
               <p className="text-gray-500 font-medium text-base max-w-xl mx-auto">We're redefining the digital shopping landscape with a commitment to excellence, security, and uncompromising quality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
               {/* Fast Delivery */}
               <div className="group relative bg-white p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-indigo-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-indigo-600 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></div>
                     <Truck className="text-indigo-600 group-hover:text-white transition-colors relative z-10 hover-float" size={28} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-3 sm:mb-4 text-lg sm:text-xl tracking-tight">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Experience lightning-fast shipping. 24-hour delivery to major cities and 2-4 days nationwide.</p>
                  <div className="mt-4 sm:mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     Learn More <ArrowRight size={12} />
                  </div>
               </div>

               {/* Secure Payment */}
               <div className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-500 to-teal-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-emerald-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></div>
                     <ShieldCheck className="text-emerald-600 group-hover:text-white transition-colors relative z-10 hover-float" style={{ animationDelay: '0.5s' }} size={36} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-4 text-xl tracking-tight">Secure Payment</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Shop with confidence. PCI-DSS Level 1 certified with Quantum Safe Encryption for every transaction.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     Our Security <ArrowRight size={12} />
                  </div>
               </div>

               {/* Easy Returns */}
               <div className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-pink-500 to-rose-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-pink-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></div>
                     <Gift className="text-pink-600 group-hover:text-white transition-colors relative z-10 hover-float" style={{ animationDelay: '1s' }} size={36} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-4 text-xl tracking-tight">Easy Returns</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">No questions asked. enjoy a 15-day instant return policy with complimentary return shipping.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     Return Policy <ArrowRight size={12} />
                  </div>
               </div>

               {/* Expert Support */}
               <div className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-amber-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></div>
                     <Users className="text-amber-600 group-hover:text-white transition-colors relative z-10 hover-float" style={{ animationDelay: '1.5s' }} size={36} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-4 text-xl tracking-tight">Expert Support</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Always here for you. 24/7 dedicated customer support and a personal style concierge service.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                     Contact Us <ArrowRight size={12} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 sm:py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 sm:mb-16">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  What Our <span className="static-brand-gradient">Customers Say</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">Join thousands of satisfied customers who trust ClickBazaar.</p>
            </div>

            <div className="relative">
               {/* left arrow (visible on md+) */}
               <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex">
                  <button onClick={scrollPrev} aria-label="Previous testimonial" className="w-10 h-10 bg-white border border-gray-100 rounded-xl shadow flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                     <ChevronLeft size={18} />
                  </button>
               </div>

               {/* scrollable track */}
               <div
                  ref={testimonialsRef}
                  role="region"
                  aria-label="Customer testimonials carousel"
                  tabIndex={0}
                  onFocus={pauseAutoplay}
                  onBlur={resumeAutoplay}
                  onMouseEnter={pauseAutoplay}
                  onMouseLeave={resumeAutoplay}
                  onKeyDown={onKeyDownCarousel}
                  className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 sm:px-6 py-6 touch-pan-x w-full"


                  style={{ WebkitOverflowScrolling: 'touch' }}
               >
                  {testimonials.map((t, idx) => (
                     <article key={idx} tabIndex={0} aria-roledescription="slide" aria-label={`${t.name}, ${t.role}`} className="snap-start flex-shrink-0 w-[90%] sm:w-[48%] md:w-[32%] lg:w-[28%] bg-gray-50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                           ))}
                        </div>
                        <p className="text-gray-600 font-medium mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">"{t.text}"</p>
                        <div className="flex items-center gap-3 mt-4 sm:mt-6">
                           <img src={t.image} alt={t.name} className="w-10 sm:w-12 h-10 sm:h-12 rounded-full" />
                           <div>
                              <p className="font-black text-gray-900 text-sm">{t.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.role}</p>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>

               {/* right arrow (visible on md+) */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex">
                  <button onClick={scrollNext} aria-label="Next testimonial" className="w-10 h-10 bg-white border border-gray-100 rounded-xl shadow flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300">
                     <ChevronRight size={18} />
                  </button>
               </div>

               {/* indicators */}
               <div className="mt-6 flex items-center justify-center gap-2">
                  {testimonials.map((_, i) => (
                     <button key={i} onClick={() => scrollToIndex(i)} aria-label={`Go to testimonial ${i + 1}`} className={`w-2 h-2 rounded-full transition-all ${i === activeTestIndex ? 'bg-indigo-600 scale-110' : 'bg-gray-300'}`} />
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Marketplace Statistics (animated) */}
      <section className="relative min-h-[60vh] sm:h-80 md:h-[680px] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center" role="group" aria-label="Marketplace statistics">

               <div className={`text-center transition-transform duration-700 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 static-brand-gradient" aria-live="polite">{formatCompact(stats.users)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Active Users</p>
               </div>

               <div className={`text-center transition-transform duration-700 delay-75 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 static-brand-gradient" aria-live="polite">{formatCompact(stats.products)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Premium Products</p>
               </div>

               <div className={`text-center transition-transform duration-700 delay-150 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 static-brand-gradient" aria-live="polite">{formatCompact(stats.orders)}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Orders Delivered</p>
               </div>

               <div className={`text-center transition-transform duration-700 delay-200 ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 static-brand-gradient flex items-center justify-center gap-2" aria-live="polite">
                     <span>{stats.rating.toFixed(1)}</span>
                     <span className="text-yellow-400" aria-hidden>★</span>
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Average Rating</p>
               </div>

            </div>
         </div>
      </section>

      {/* Flash Deals Section */}
      <section className="py-16 sm:py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
               <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2 flex items-center gap-3">
                     <Flame className="text-red-500 animate-pulse" size={28} />
                     <span className="static-brand-gradient">Flash Deals</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-sm">Limited time offers ending soon</p>
               </div>
               <Link to="/shop" className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:underline self-start sm:self-center">
                  View All <ArrowRight size={14} />
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
               {flashDeals.map((product) => (
                  <div key={product.id} className="w-full flex justify-center py-6 sm:py-10">
                    <ExpandableProductCard product={product} />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gray-50 transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 sm:mb-16">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  Shopping Made <span className="static-brand-gradient">Simple</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">Follow these simple steps to get your favorite products delivered to your doorstep.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
               {[
                  { icon: ShoppingBag, title: "Browse & Select", desc: "Explore 50+ categories with curated collections and expert picks." },
                  { icon: Truck, title: "Add to Cart", desc: "Customize your selections and proceed to secure checkout." },
                  { icon: CheckCircle2, title: "Fast Checkout", desc: "Multiple payment options with instant confirmation and tracking." },
                  { icon: TrendingIcon, title: "Track & Enjoy", desc: "Real-time delivery updates and dedicated customer support." }
               ].map((step, idx) => (
                  <div key={idx} className="relative">
                     <div className="text-center">
                        <div className="w-12 sm:w-16 h-12 sm:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 font-black text-lg sm:text-2xl shadow-lg shadow-indigo-200">
                           {idx + 1}
                        </div>
                        <div className="p-4 sm:p-6 bg-white rounded-2xl border border-gray-100">
                           <div className="flex justify-center mb-3 sm:mb-4">
                              <step.icon className="text-indigo-600" size={28} />
                           </div>
                           <h3 className="font-black text-gray-900 mb-2 text-sm sm:text-base">{step.title}</h3>
                           <p className="text-xs sm:text-sm text-gray-600 font-medium">{step.desc}</p>
                        </div>
                     </div>
                     {idx < 3 && (
                        <div className="hidden md:block absolute top-8 -right-4 text-indigo-300">
                           <ArrowRight size={24} />
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Premium Partners */}
      <section className="py-16 sm:py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 sm:mb-16">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  Trusted by <span className="static-brand-gradient">Industry Leaders</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">We partner with the world's best brands to bring you authentic products.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-8 items-center">
               {[
                  { name: "Apple", logo: "https://cdn.worldvectorlogo.com/logos/apple-1.svg" },
                  { name: "Samsung", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRujWSMCod5T-6LfkhoKW4pItwyZTKI_fXqSg&s" },
                  { name: "Sony", logo: "https://cdn.worldvectorlogo.com/logos/sony.svg" },
                  { name: "Nike", logo: "https://cdn.worldvectorlogo.com/logos/nike-2.svg" },
                  { name: "Adidas", logo: "https://cdn.worldvectorlogo.com/logos/adidas.svg" },
                  { name: "Lakme", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Lakm%C3%A9_logo.jpg" },
                  { name: "Titan", logo: "https://cdn.worldvectorlogo.com/logos/titan.svg" },
                  { name: "Raymond", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBXBFIvNQRaW46mMIyz0lbf17s0Idt6Lf2tA&s" },
                  { name: "JBL", logo: "https://cdn.worldvectorlogo.com/logos/jbl.svg" }
               ].map((brand, idx) => (
                  <div key={idx} className="h-12 sm:h-16 flex items-center justify-center p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                     <img src={brand.logo} alt={brand.name} className="h-6 sm:h-8 object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 transition-colors">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">Stay Updated</h2>
            <p className="text-indigo-100 font-medium text-base sm:text-lg mb-8 sm:mb-10">Subscribe to get exclusive deals, new arrivals, and special offers delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" aria-label="Subscribe to newsletter">
               <input 
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className="flex-grow px-6 py-4 rounded-2xl bg-white/95 border border-white/20 placeholder-gray-400 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
               />
               <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-6 sm:px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
               >
                  {newsletterLoading ? <Loader2 className="animate-spin" size={18} /> : <><Mail size={18} /> Subscribe</>}
               </button>
            </form>

            {/* inline feedback for accessibility */}
            {newsletterMessage && (
              <p role="status" aria-live="polite" className={`mt-4 text-sm font-semibold ${newsletterMessage.type === 'success' ? 'text-green-200' : 'text-amber-200'}`}>
                {newsletterMessage.text}
              </p>
            )}

            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mt-6">We respect your privacy. Unsubscribe anytime.</p>
         </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center p-3 md:p-8 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-auto animate-in zoom-in-95 duration-300 relative">
            <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-white rounded-t-3xl">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="md:w-6 md:h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-5 md:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  setAuthLoading(true);
                  setTimeout(() => {
                    if (context?.login) {
                      context.login(email, password);
                    }
                    setAuthLoading(false);
                    setShowAuthModal(false);
                    setEmail('');
                    setPassword('');
                  }, 800);
                }}
                disabled={authLoading || !email || !password}
                className="w-full py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {authMode === 'login' && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-center mb-3">
                    Don't have an account? 
                    <button 
                      onClick={() => setAuthMode('register')}
                      className="ml-1 text-indigo-600 font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              )}

              {authMode === 'register' && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 text-center mb-3">
                    Already have an account? 
                    <button 
                      onClick={() => setAuthMode('login')}
                      className="ml-1 text-indigo-600 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;