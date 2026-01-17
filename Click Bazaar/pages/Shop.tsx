import React, { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Plus, Minus, X, Truck, Check, Star, ShoppingCart, Sparkles, Heart } from 'lucide-react';
import { api } from '../services/api';
import { Product, ProductCategory } from '../types';
import { AppContext, formatCurrency, SiteLoader, CategoryBackground } from '../shared';
import { ExpandableProductCard } from '../components/ExpandableProductCard';

const ScrollToTopOnMount = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const context = useContext(AppContext);
  const { setBgCategory } = context!;

  // Sync state with URL search params
  useEffect(() => {
    const categoryFromURL = searchParams.get('category');
    if (categoryFromURL) {
      const cat = decodeURIComponent(categoryFromURL);
      setSelectedCategory(cat);
      setBgCategory(cat);
    } else {
      setSelectedCategory('All');
      setBgCategory('General');
    }
  }, [searchParams, setBgCategory]);

  useEffect(() => {
    setBgCategory(selectedCategory === 'All' ? 'General' : selectedCategory);
  }, [selectedCategory, setBgCategory]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch products on mount
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetch();

    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products by search term and category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const suggestions = searchTerm.trim() 
    ? products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      setSearchTerm(suggestions[activeIndex].name);
      setIsAutocompleteOpen(false);
    } else if (e.key === 'Escape') {
      setIsAutocompleteOpen(false);
    }
  };

  const categories = ['All', ...Object.values(ProductCategory)];

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case ProductCategory.MENS_WEAR: return { 
        color: 'blue', 
        gradient: 'from-blue-400/40 via-indigo-400/25 to-slate-300/10', 
        accent: 'blue',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Cpath d=\'M30 20 L30 60 M50 20 L50 60 M30 40 L70 40 M35 60 L35 80 M65 60 L65 80\' stroke=\'%233b82f6\' stroke-width=\'2\' opacity=\'0.08\' fill=\'none\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-blue-700',
        borderColor: 'border-blue-300'
      };
      case ProductCategory.WOMENS_WEAR: return { 
        color: 'pink', 
        gradient: 'from-pink-400/40 via-rose-400/25 to-purple-300/10', 
        accent: 'pink',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Cpath d=\'M40 10 L40 45 M40 45 L25 70 L55 70 L40 45 M35 45 L45 45\' stroke=\'%23ec4899\' stroke-width=\'2\' opacity=\'0.08\' fill=\'none\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-pink-700',
        borderColor: 'border-pink-300'
      };
      case ProductCategory.KIDS_WEAR: return { 
        color: 'amber', 
        gradient: 'from-amber-400/40 via-yellow-400/25 to-orange-300/10', 
        accent: 'amber',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Ccircle cx=\'50\' cy=\'30\' r=\'12\' stroke=\'%23f59e0b\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M35 45 L35 75 L40 65 L60 65 L65 75 L65 45 Q50 55 35 45\' stroke=\'%23f59e0b\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-amber-700',
        borderColor: 'border-amber-300'
      };
      case ProductCategory.MENS_WATCHES: return { 
        color: 'slate', 
        gradient: 'from-slate-600/40 via-gray-500/25 to-zinc-400/10', 
        accent: 'slate',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'20\' stroke=\'%23475569\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'50\' y1=\'50\' x2=\'50\' y2=\'35\' stroke=\'%23475569\' stroke-width=\'1.5\' opacity=\'0.08\'/%3E%3Cline x1=\'50\' y1=\'50\' x2=\'60\' y2=\'50\' stroke=\'%23475569\' stroke-width=\'1.5\' opacity=\'0.08\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'3\' fill=\'%23475569\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-slate-800',
        borderColor: 'border-slate-400'
      };
      case ProductCategory.MOBILE: return { 
        color: 'indigo', 
        gradient: 'from-indigo-400/40 via-blue-400/25 to-cyan-300/10', 
        accent: 'indigo',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Crect x=\'35\' y=\'15\' width=\'30\' height=\'60\' rx=\'3\' stroke=\'%234f46e5\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'50\' y1=\'70\' x2=\'50\' y2=\'75\' stroke=\'%234f46e5\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-indigo-700',
        borderColor: 'border-indigo-300'
      };
      case ProductCategory.ELECTRONICS: return { 
        color: 'violet', 
        gradient: 'from-violet-400/40 via-purple-400/25 to-fuchsia-300/10', 
        accent: 'violet',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Crect x=\'25\' y=\'20\' width=\'50\' height=\'40\' rx=\'2\' stroke=\'%236d28d9\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'35\' y1=\'30\' x2=\'65\' y2=\'30\' stroke=\'%236d28d9\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3Cline x1=\'35\' y1=\'40\' x2=\'65\' y2=\'40\' stroke=\'%236d28d9\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3Cline x1=\'35\' y1=\'50\' x2=\'65\' y2=\'50\' stroke=\'%236d28d9\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3Ccircle cx=\'50\' cy=\'70\' r=\'6\' stroke=\'%236d28d9\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-violet-700',
        borderColor: 'border-violet-300'
      };
      case ProductCategory.WOMENS_WATCHES: return { 
        color: 'rose', 
        gradient: 'from-rose-400/40 via-pink-400/25 to-red-300/10', 
        accent: 'rose',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'22\' stroke=\'%23e11d48\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M50 28 L50 50 M50 50 L58 50\' stroke=\'%23e11d48\' stroke-width=\'1.5\' opacity=\'0.08\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'2.5\' fill=\'%23e11d48\' opacity=\'0.08\'/%3E%3Cpath d=\'M50 28 L45 20 M50 72 L45 80 M72 50 L80 45 M28 50 L20 45\' stroke=\'%23e11d48\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-rose-700',
        borderColor: 'border-rose-300'
      };
      case ProductCategory.HOME: return { 
        color: 'emerald', 
        gradient: 'from-emerald-400/40 via-teal-400/25 to-green-300/10', 
        accent: 'emerald',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Cpath d=\'M30 60 L50 30 L70 60 L70 80 L30 80 Z\' stroke=\'%2310b981\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Crect x=\'40\' y=\'50\' width=\'20\' height=\'30\' stroke=\'%2310b981\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.08\'/%3E%3Crect x=\'45\' y=\'55\' width=\'6\' height=\'6\' stroke=\'%2310b981\' stroke-width=\'1\' fill=\'none\' opacity=\'0.08\'/%3E%3Crect x=\'55\' y=\'55\' width=\'6\' height=\'6\' stroke=\'%2310b981\' stroke-width=\'1\' fill=\'none\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-emerald-700',
        borderColor: 'border-emerald-300'
      };
      case ProductCategory.GROCERY: return { 
        color: 'green', 
        gradient: 'from-green-400/40 via-lime-400/25 to-yellow-300/10', 
        accent: 'green',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Ccircle cx=\'40\' cy=\'45\' r=\'12\' stroke=\'%2316a34a\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M40 33 L42 28 L38 28 Z\' stroke=\'%2316a34a\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.08\'/%3E%3Crect x=\'55\' y=\'30\' width=\'18\' height=\'30\' rx=\'2\' stroke=\'%2316a34a\' stroke-width=\'1.5\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'55\' y1=\'40\' x2=\'73\' y2=\'40\' stroke=\'%2316a34a\' stroke-width=\'0.5\' opacity=\'0.08\'/%3E%3Cline x1=\'55\' y1=\'50\' x2=\'73\' y2=\'50\' stroke=\'%2316a34a\' stroke-width=\'0.5\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-green-700',
        borderColor: 'border-green-300'
      };
      case ProductCategory.BEAUTY: return { 
        color: 'fuchsia', 
        gradient: 'from-fuchsia-400/40 via-purple-400/25 to-pink-300/10', 
        accent: 'fuchsia',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Ccircle cx=\'35\' cy=\'35\' r=\'12\' stroke=\'%23d946ef\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M35 23 L32 20 L35 20 L38 20 Z\' stroke=\'%23d946ef\' stroke-width=\'1\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M50 50 Q50 40 65 40 Q65 50 50 50 Z\' stroke=\'%23d946ef\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cpath d=\'M52 48 L63 48\' stroke=\'%23d946ef\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-fuchsia-700',
        borderColor: 'border-fuchsia-300'
      };
      default: return { 
        color: 'indigo', 
        gradient: 'from-slate-500/30 via-indigo-500/20 to-slate-300/10', 
        accent: 'indigo',
        bgColor: 'bg-white',
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Cpath d=\'M30 30 L70 30 L70 70 L30 70 Z\' stroke=\'%34818cf\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'50\' y1=\'30\' x2=\'50\' y2=\'70\' stroke=\'%34818cf\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3Cline x1=\'30\' y1=\'50\' x2=\'70\' y2=\'50\' stroke=\'%34818cf\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-indigo-700',
        borderColor: 'border-indigo-300'
      };
    }
  };

  const theme = getCategoryTheme(selectedCategory);

  return (
    <div className={`relative min-h-screen transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 relative">
        <ScrollToTopOnMount />
        
        <div className="mb-8 md:mb-16 text-center md:text-left">
          <h1 className={`text-4xl md:text-6xl font-black ${theme.textAccent} tracking-tight leading-tight mb-4 flex items-center justify-center md:justify-start gap-4`}>
            {selectedCategory === 'All' ? 'The Collection' : selectedCategory}
            {selectedCategory === 'All' && (
              <img 
                src="https://cdn-icons-png.flaticon.com/128/9198/9198132.png" 
                alt="Collection Icon" 
                className="w-10 h-10 md:w-16 md:h-16 object-contain collection-icon-animated animate-fade-in"
              />
            )}
            {(selectedCategory === ProductCategory.WOMENS_WEAR || selectedCategory === ProductCategory.WOMENS_WATCHES) && (
              <img 
                src="https://cdn-icons-png.flaticon.com/128/8863/8863863.png" 
                alt="Women's Icon" 
                className="w-10 h-10 md:w-16 md:h-16 object-contain cursor-pointer womens-icon-animated animate-fade-in"
              />
            )}
            {selectedCategory === ProductCategory.GROCERY && (
              <img 
                src="https://cdn-icons-png.flaticon.com/128/3514/3514211.png" 
                alt="Grocery Icon" 
                className="w-10 h-10 md:w-16 md:h-16 object-contain collection-icon-animated animate-fade-in"
              />
            )}
          </h1>
          <p className="text-slate-600 font-medium text-lg md:text-xl max-w-2xl">
            Discover our meticulously selected {selectedCategory === 'All' ? 'inventory' : selectedCategory.toLowerCase()} for your lifestyle.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-3 md:p-6 rounded-3xl border border-white shadow-2xl shadow-indigo-100/20 mb-12 flex flex-col gap-6 sticky top-28 z-30 transition-all">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all whitespace-nowrap border-2 ${
                  selectedCategory === cat 
                  ? `bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 scale-105` 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'All' : (cat === ProductCategory.MOBILE ? 'Phones' : cat)}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search by name, category or specs..."
              value={searchTerm}
              onFocus={() => setIsAutocompleteOpen(true)}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsAutocompleteOpen(true);
                setActiveIndex(-1);
              }}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-3.5 md:py-4 pl-12 pr-4 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder-slate-400 shadow-inner"
            />
          </div>
        </div>

        {loading ? (
          <SiteLoader message={`Filtering ${selectedCategory}...`} />
        ) : filteredProducts.length > 0 ? (
          <div className={`flex flex-wrap gap-8 justify-center items-start py-16 px-6 md:px-10 rounded-[2.5rem] border-3 ${theme.borderColor} ${theme.bgPattern} bg-white/95 backdrop-blur-xl shadow-2xl`}>
            {filteredProducts.map(product => (
              <div key={product.id} className="w-full sm:w-80 flex justify-center">
                <ExpandableProductCard 
                  product={product}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
            <Search size={48} className="text-gray-100 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">No Matches Found</h2>
            <p className="text-gray-400 font-bold text-sm">We couldn't find any products matching "{searchTerm}".</p>
            <button onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} className="mt-6 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
