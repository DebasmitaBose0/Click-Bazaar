import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExpandableProductCard } from '../components/ExpandableProductCard';
import { ArrowRight, Smartphone, Watch, Laptop, ShoppingBag, Zap, MessageSquare, Shirt, Baby, Clock, Loader2, Star, TrendingUp, Sparkles, Truck, ShieldCheck, Apple, HelpCircle, ChevronRight, Users, Award, Gift, Zap as ZapIcon, Mail, Flame, Eye, Heart as HeartIcon, TrendingUp as TrendingIcon, Zap as ZapCheckIcon, CheckCircle2, Headphones, RotateCcw, X, Lock, User } from 'lucide-react';
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
      className={`group relative flex flex-col items-center p-5 md:p-8 bg-gradient-to-br ${getCategoryBgGradient(title)} backdrop-blur-md rounded-2xl md:rounded-[2rem] border-2 shadow-lg hover:shadow-2xl hover:shadow-current/20 transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
    >
      <div className={`mb-4 md:mb-6 transition-all duration-300 group-hover:scale-110 ${color.replace('bg-', 'text-')}`}>
        <Icon size={48} className="md:w-12 md:h-12" />
      </div>
      <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors text-center leading-snug flex items-center justify-center gap-2">
        {title}
        {(title === "Women's Wear" || title === "Women's Watches") && (
          <img 
            src="https://cdn-icons-png.flaticon.com/128/8863/8863863.png" 
            alt="Women's Icon" 
            className="w-5 h-5 md:w-6 md:h-6 object-contain womens-icon-animated"
          />
        )}
        {title === "Grocery" && (
          <img 
            src="https://cdn-icons-png.flaticon.com/128/3514/3514211.png" 
            alt="Grocery Icon" 
            className="w-5 h-5 md:w-6 md:h-6 object-contain collection-icon-animated"
          />
        )}
      </h3>
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
    { icon: Sparkles, title: ProductCategory.BEAUTY, color: "bg-fuchsia-500", desc: "Skincare, makeup, and nice scents" },
  ];

  const sortedCategories = [...categoriesData].sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    if (location.hash === '#ai-assistant') {
      aiSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      {/* Hero Slideshow Section */}
      <section className="relative h-96 md:h-[680px] flex items-center overflow-hidden">
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
                className="w-full h-full object-cover"
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
            
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 md:mb-5">
              Everything You Need <br className="hidden md:block" /> 
              <span className="static-brand-gradient">In One Place</span>
            </h1>
            
            <p className="text-sm md:text-base text-gray-200 mb-6 md:mb-8 leading-relaxed font-medium max-w-lg">
              Great products, fast delivery. Everything from fashion to electronics, all in one store.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Link to="/shop" className="btn-gradient px-6 md:px-8 py-3 md:py-4 text-white text-sm md:text-base rounded-lg md:rounded-xl font-bold flex items-center justify-center shadow-lg group">
                Shop Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link to="/orders" className="px-6 md:px-8 py-3 md:py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg md:rounded-xl font-bold text-sm md:text-base backdrop-blur-xl transition-all text-center">
                Track Order
              </Link>
            </div>
          </div>
        </div>

        {/* Slideshow Indicators */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
      <section className="bg-white py-8 md:py-10 border-b border-gray-100 mx-4 md:mx-6 rounded-2xl md:rounded-3xl shadow-lg relative z-20 transition-colors -mt-8 md:-mt-10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 px-4 group cursor-pointer">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Truck size={22} /></div>
               <div>
                  <p className="font-black text-gray-900 text-sm leading-none">Global Logistics</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Free delivery over ₹1500</p>
               </div>
            </div>
            <div className="flex items-center gap-4 px-4 border-gray-100 md:border-x group cursor-pointer">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><ShieldCheck size={22} /></div>
               <div>
                  <p className="font-black text-gray-900 text-sm leading-none">Buyer Protection</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">100% Secure Checkout</p>
               </div>
            </div>
            <div className="flex items-center gap-4 px-4 group cursor-pointer">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><TrendingUp size={22} /></div>
               <div>
                  <p className="font-black text-gray-900 text-sm leading-none">Quality Assurance</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Curated premium partners</p>
               </div>
            </div>
         </div>
      </section>

      {/* Categorical Boutiques */}
      <section className="py-24 bg-white relative overflow-hidden transition-colors">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
           <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-pink-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Explore Our <span className="static-brand-gradient">Products</span>
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Curated spaces designed for the modern connoisseur. Discover high-end fashion, 
              cutting-edge tech, and lifestyle essentials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedCategories.map((cat, idx) => (
              <div key={idx} className="h-full">
                <CategoryCard icon={cat.icon} title={cat.title} color={cat.color} desc={cat.desc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant (Knowledge Base Version) */}
      <section ref={aiSectionRef} id="ai-assistant" className="py-24 bg-slate-950 relative overflow-hidden transition-colors">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-[0.05]" alt="Tech Background" />
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 to-slate-950"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30"><Sparkles size={20} /></div>
               <span className="text-indigo-400 font-black tracking-widest text-[9px] uppercase">Bazaar Concierge</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter leading-tight">
              Intelligent Shopping <br/>
              <span className="static-brand-gradient">Support</span>
            </h2>
            <p className="text-base text-gray-400 mb-10 font-medium leading-relaxed max-w-md">
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
             <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
               <img 
                 src="https://i.guim.co.uk/img/media/972c2e5d838f1bcb3cc96affbda5e3de93f85095/0_343_5138_3082/master/5138.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=36b682eeb6bbc2cc825f41d1b49431d9" 
                 alt="Style Concierge" 
                 className="w-full h-[520px] object-cover transition-transform duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
               <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem]">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-white font-black text-xl tracking-tight">Instant Assistance</p>
                 </div>
                 <p className="text-indigo-300 font-bold uppercase tracking-widest text-[9px]">Verified Support Core</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Seasonal Promos */}
      <section className="py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative rounded-[3rem] overflow-hidden h-[520px] shadow-xl hover:shadow-[0_30px_70px_-15px_rgba(79,70,229,0.3)] hover:scale-[1.03] hover:-translate-y-2 transition-all duration-700 ease-out cursor-pointer">
               <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt="Luxury Watch" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent group-hover:from-indigo-900/80 transition-all duration-700"></div>
               <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="inline-block bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-4">January Arrival</span>
                    <h3 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">WATCH <br/>STUDIO</h3>
                    <p className="text-indigo-100/60 font-medium text-sm mb-6 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Exquisite horology crafted for premium precision.</p>
                    <Link to="/shop?category=Men's Watches" className="w-fit px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
                      EXPLORE TIMEPIECES <ArrowRight size={14} />
                    </Link>
                  </div>
               </div>
            </div>
            
            <div className="group relative rounded-[3rem] overflow-hidden h-[520px] shadow-xl hover:shadow-[0_30px_70px_-15px_rgba(219,39,119,0.3)] hover:scale-[1.03] hover:-translate-y-2 transition-all duration-700 ease-out cursor-pointer">
               <img src="https://www.jiomart.com/images/product/original/rvww8q4azr/iloz-latest-new-luxury-silver-diamond-bracelet-strap-party-wear-watch-for-girls-women-trendy-designer-best-quartz-analog-watches-for-women-product-images-rvww8q4azr-0-202303011306.jpg?im=Resize=(1000,1000)" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Elite Couture" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent group-hover:from-pink-900/80 transition-all duration-700"></div>
               <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="inline-block bg-pink-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-4">January Edition</span>
                    <h3 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">ELITE <br/>COUTURE</h3>
                    <p className="text-pink-100/60 font-medium text-sm mb-6 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">Bespoke luxury tailored for the season.</p>
                    <Link to="/shop?category=Women's Watches" className="w-fit px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all shadow-2xl flex items-center gap-3">
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
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-[100px]"></div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {/* Fast Delivery */}
               <div className="group relative bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                     <div className="absolute inset-0 bg-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></div>
                     <Truck className="text-indigo-600 group-hover:text-white transition-colors relative z-10 hover-float" size={36} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-4 text-xl tracking-tight">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">Experience lightning-fast shipping. 24-hour delivery to major cities and 2-4 days nationwide.</p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <section className="py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  What Our <span className="static-brand-gradient">Customers Say</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">Join thousands of satisfied customers who trust ClickBazaar.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  {
                     name: "Priya Singh",
                     role: "Fashion Enthusiast",
                     image: "https://i.pravatar.cc/150?img=1",
                     text: "ClickBazaar's collection is absolutely stunning! The quality is premium and delivery was faster than expected."
                  },
                  {
                     name: "Rajesh Kumar",
                     role: "Tech Lover",
                     image: "https://i.pravatar.cc/150?img=2",
                     text: "Best place for electronics. Great prices, authentic products, and excellent after-sales support."
                  },
                  {
                     name: "Ananya Patel",
                     role: "Home Decor Expert",
                     image: "https://i.pravatar.cc/150?img=3",
                     text: "The curated home collection transformed my space. Love the attention to detail and customer service."
                  }
               ].map((testimonial, idx) => (
                  <div key={idx} className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all">
                     <div className="flex items-center gap-3 mb-6">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                        ))}
                     </div>
                     <p className="text-gray-600 font-medium mb-6 leading-relaxed">"{testimonial.text}"</p>
                     <div className="flex items-center gap-3">
                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                        <div>
                           <p className="font-black text-gray-900 text-sm">{testimonial.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{testimonial.role}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Marketplace Statistics */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="text-center">
                  <p className="text-4xl md:text-5xl font-black mb-2 static-brand-gradient">8.5K+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Active Users</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl md:text-5xl font-black mb-2 static-brand-gradient">2.8K+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Premium Products</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl md:text-5xl font-black mb-2 static-brand-gradient">9.2K+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Orders Delivered</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl md:text-5xl font-black mb-2 static-brand-gradient">4.8★</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Average Rating</p>
               </div>
            </div>
         </div>
      </section>

      {/* Flash Deals Section */}
      <section className="py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-2 flex items-center gap-3">
                     <Flame className="text-red-500 animate-pulse" size={32} />
                     <span className="static-brand-gradient">Flash Deals</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-sm">Limited time offers ending soon</p>
               </div>
               <Link to="/shop" className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:underline">
                  View All <ArrowRight size={14} />
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
               {flashDeals.map((product) => (
                  <div key={product.id} className="w-full flex justify-center py-10">
                    <ExpandableProductCard product={product} />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  Shopping Made <span className="static-brand-gradient">Simple</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">Follow these simple steps to get your favorite products delivered to your doorstep.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                  { icon: ShoppingBag, title: "Browse & Select", desc: "Explore 50+ categories with curated collections and expert picks." },
                  { icon: Truck, title: "Add to Cart", desc: "Customize your selections and proceed to secure checkout." },
                  { icon: CheckCircle2, title: "Fast Checkout", desc: "Multiple payment options with instant confirmation and tracking." },
                  { icon: TrendingIcon, title: "Track & Enjoy", desc: "Real-time delivery updates and dedicated customer support." }
               ].map((step, idx) => (
                  <div key={idx} className="relative">
                     <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-lg shadow-indigo-200">
                           {idx + 1}
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-gray-100">
                           <div className="flex justify-center mb-4">
                              <step.icon className="text-indigo-600" size={32} />
                           </div>
                           <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
                           <p className="text-sm text-gray-600 font-medium">{step.desc}</p>
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
      <section className="py-24 bg-white transition-colors">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter mb-4">
                  Trusted by <span className="static-brand-gradient">Industry Leaders</span>
               </h2>
               <p className="text-gray-400 font-medium text-sm max-w-lg mx-auto">We partner with the world's best brands to bring you authentic products.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
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
                  <div key={idx} className="h-16 flex items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group">
                     <img src={brand.logo} alt={brand.name} className="h-8 object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 transition-colors">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">Stay Updated</h2>
            <p className="text-indigo-100 font-medium text-lg mb-10">Subscribe to get exclusive deals, new arrivals, and special offers delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
               <input 
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-6 py-4 rounded-2xl bg-white/95 border border-white/20 placeholder-gray-400 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
               />
               <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center gap-2">
                  <Mail size={18} /> Subscribe
               </button>
            </div>
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