import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Loader2, ShoppingBag, Award } from 'lucide-react';
import { AppContext, formatCurrency, SiteLoader } from '../shared';
import { getDB } from '../db';

const BrandPage: React.FC = () => {
  const { brand } = useParams<{ brand: string }>();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const brandName = brand?.charAt(0).toUpperCase() + brand?.slice(1).toLowerCase();
    const db = getDB();
    
    // Filter products by brand - we'll use a mapping system
    const brandProducts = filterProductsByBrand(db.products, brandName || '');
    setProducts(brandProducts.slice(0, 5)); // Limit to 5 products
    setLoading(false);
  }, [brand]);

  const filterProductsByBrand = (products: Product[], brandName: string): Product[] => {
    const brandMap: { [key: string]: string[] } = {
      'Apple': ['mob1', 'e5', 'e1', 'e10', 'e9'],
      'Samsung': ['mob2', 'e2', 'e7'],
      'Sony': ['e6', 'e4'],
      'Nike': ['mw3', 'ww4'],
      'Adidas': ['mw1', 'mw2']
    };

    const productIds = brandMap[brandName] || [];
    return products.filter(p => productIds.includes(p.id));
  };


  const formatBrandName = (name?: string) => {
    return name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase() || '';
  };

  const brandName = formatBrandName(brand);

  if (loading) {
    return <SiteLoader message={`Loading ${brandName}`} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-slate-100 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-10 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} /> Back to Bazaar
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-6">
                < Award size={14} className="text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Certified Partner</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                {brandName}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                Discover the exclusive craftsmanship and innovation of {brandName}. From timeless designs 
                to modern essentials, explore a collection that defines your status.
              </p>
            </div>
            
            <div className="flex gap-8 border-l border-slate-200 pl-8 hidden md:flex">
              <div>
                <p className="text-3xl font-black text-slate-900 line-height-1">{products.length}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 line-height-1">4.9</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {products.length > 0 ? (
          <div className="flex flex-wrap gap-x-12 gap-y-16 justify-center items-start">
            {products.map(product => (
              <ExpandableProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-lg mb-4">No products found for {brandName}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
