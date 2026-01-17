import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { AppContext, formatCurrency, CategoryBackground } from '../shared';
import { api } from '../services/api';
import { Product } from '../types';
import { ExpandableProductCard } from '../components/ExpandableProductCard';

const WishlistPage: React.FC = () => {
  const context = useContext(AppContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const all = await api.getProducts();
      const wishlisted = all.filter(p => context?.wishlist.includes(p.id));
      setProducts(wishlisted);
      setLoading(false);
    };
    fetchWishlistItems();
  }, [context?.wishlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CategoryBackground category="General" />

        <div className="max-w-4xl mx-auto px-4 py-32 text-center relative z-10">
        <div className="bg-pink-100 p-10 rounded-full w-fit mx-auto mb-10">
          <Heart size={80} className="text-pink-500" />
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Your wishlist is empty</h1>
        <p className="text-gray-500 text-xl font-medium mb-12 max-w-md mx-auto">Save items you love and they will appear here. Ready to find something special?</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-10 py-5 bg-pink-600 hover:bg-pink-700 text-white rounded-3xl font-black text-lg transition-all shadow-2xl shadow-pink-100"
        >
          <ArrowLeft className="mr-3" size={24} />
          Explore Market
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="General" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
        <div>
          <h1 className="text-6xl font-black text-gray-900 mb-2 tracking-tighter"><span className="static-brand-gradient">Wishlist</span></h1>
          <p className="text-gray-500 text-lg font-medium">Keep track of items you're keeping an eye on in India.</p>
        </div>
        <div className="bg-pink-100 border border-pink-200 px-6 py-4 rounded-3xl flex items-center gap-3">
          <Heart className="text-pink-600" size={24} />
          <span className="text-pink-700 font-black">{products.length} Favorites Found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
        {products.map(product => (
          <div key={product.id} className="py-10">
            <ExpandableProductCard product={product} />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default WishlistPage;