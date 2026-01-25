import React, { useState, useEffect, useContext, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Plus, Minus, X, Truck, Check, Star, ShoppingCart, Sparkles, Heart, Palette } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const autocompleteRef = useRef<HTMLDivElement>(null);
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
        bgPattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'none\' width=\'100\' height=\'100\'/%3E%3Cpath d=\'M30 30 L70 30 L70 70 L30 70 Z\' stroke=\'%234818cf\' stroke-width=\'2\' fill=\'none\' opacity=\'0.08\'/%3E%3Cline x1=\'50\' y1=\'30\' x2=\'50\' y2=\'70\' stroke=\'%234818cf\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3Cline x1=\'30\' y1=\'50\' x2=\'70\' y2=\'50\' stroke=\'%234818cf\' stroke-width=\'1\' opacity=\'0.08\'/%3E%3C/svg%3E")] opacity-100',
        textAccent: 'text-indigo-700',
        borderColor: 'border-indigo-300'
      };
    }
  };

  const theme = getCategoryTheme(selectedCategory);

  return (
    <div className={`relative min-h-screen overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20" />
        
        {/* Animated Gradient Orbs */}
        <div className="hidden md:block absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="hidden md:block absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite 2s' }} />
        <div className="hidden md:block absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animation: 'float 12s ease-in-out infinite 4s' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </div>

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(20px, -20px); }
          50% { transform: translate(-20px, 20px); }
          75% { transform: translate(10px, -10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .shop-header {
          animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .shop-filters {
          animation: slideInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.7);
        }
        
        .shop-catalog {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        
        .grid {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        
        .grid > div {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }
        
        .grid > div:nth-child(1) { animation-delay: 0.05s; }
        .grid > div:nth-child(2) { animation-delay: 0.1s; }
        .grid > div:nth-child(3) { animation-delay: 0.15s; }
        .grid > div:nth-child(4) { animation-delay: 0.2s; }
        .grid > div:nth-child(n+5) { animation-delay: 0.25s; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth transitions for all interactive elements */
        * {
          transition-duration: 0.3s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Category button animations */
        button {
          position: relative;
        }
        
        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
          pointer-events: none;
          border-radius: inherit;
        }
        
        button:hover::before {
          left: 100%;
        }
        
        /* Prevent transition on transform for hover effects */
        .card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        /* Search input focus effect */
        input:focus {
          box-shadow: 0 0 20px rgba(79, 70, 229, 0.3);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 relative">
        <ScrollToTopOnMount />
        
        {/* Header Section */}
        <div className="mb-12 shop-header">
          <div className="flex items-center gap-4 mb-3">
            <h1 className={`text-4xl md:text-5xl font-black text-slate-900 tracking-tight`}>
              {selectedCategory === 'All' ? 'Catalog' : selectedCategory}
            </h1>
            {selectedCategory === ProductCategory.BEAUTY && (
              <div className="animated-icon-container">
                <style>{`
                  @keyframes makeup-brush-motion {
                    0% { 
                      transform: translateX(-8px) translateY(-8px) rotate(-15deg) scale(1);
                    }
                    12% { 
                      transform: translateX(-4px) translateY(-6px) rotate(-10deg) scale(1.05);
                    }
                    25% { 
                      transform: translateX(0px) translateY(-4px) rotate(0deg) scale(1);
                    }
                    37% { 
                      transform: translateX(4px) translateY(-2px) rotate(10deg) scale(1.05);
                    }
                    50% { 
                      transform: translateX(8px) translateY(0px) rotate(15deg) scale(1);
                    }
                    62% { 
                      transform: translateX(4px) translateY(4px) rotate(10deg) scale(1.05);
                    }
                    75% { 
                      transform: translateX(-2px) translateY(6px) rotate(-5deg) scale(1);
                    }
                    87% { 
                      transform: translateX(-6px) translateY(4px) rotate(-12deg) scale(1.05);
                    }
                    100% { 
                      transform: translateX(-8px) translateY(-8px) rotate(-15deg) scale(1);
                    }
                  }
                  
                  @keyframes makeup-glow-pulse {
                    0%, 100% { 
                      filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.4)) drop-shadow(0 0 15px rgba(249, 115, 22, 0.2));
                    }
                    25% { 
                      filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 20px rgba(249, 115, 22, 0.3));
                    }
                    50% { 
                      filter: drop-shadow(0 0 16px rgba(236, 72, 153, 0.7)) drop-shadow(0 0 28px rgba(249, 115, 22, 0.4));
                    }
                    75% { 
                      filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 20px rgba(249, 115, 22, 0.3));
                    }
                  }
                  
                  .makeup-icon-img {
                    animation: makeup-brush-motion 4s cubic-bezier(0.44, 0.09, 0.56, 0.91) infinite, makeup-glow-pulse 4s ease-in-out infinite;
                    width: 56px;
                    height: 56px;
                    object-fit: contain;
                    transform-origin: center;
                    will-change: transform, filter;
                  }
                `}</style>
                <img 
                  src="https://cdn-icons-png.flaticon.com/128/828/828437.png"
                  alt="Makeup"
                  className="makeup-icon-img"
                />
              </div>
            )}
          </div>
          <p className="text-slate-600 font-semibold text-lg max-w-2xl">
            Explore our premium collection of {selectedCategory === 'All' ? 'products' : selectedCategory.toLowerCase()}.
          </p>
        </div>

        {/* Filter & Search Section */}
        <div className="shop-filters rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-12 sticky top-24 z-30">
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4">Categories</h3>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat 
                      ? `bg-indigo-600 text-white border-indigo-600 shadow-md` 
                      : 'bg-gray-100 text-slate-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'All' ? 'All' : (cat === ProductCategory.MOBILE ? 'Phones' : cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onFocus={() => setIsAutocompleteOpen(true)}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsAutocompleteOpen(true);
                setActiveIndex(-1);
              }}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-semibold text-slate-900 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <SiteLoader message={`Loading ${selectedCategory}...`} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start shop-catalog">
            {filteredProducts.map(product => (
              <div key={product.id} className="w-full">
                <ExpandableProductCard 
                  product={product}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200">
            <Search size={48} className="text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">No Products Found</h2>
            <p className="text-slate-600 font-semibold mb-6">We couldn't find any products matching your search.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}} 
              className="bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
