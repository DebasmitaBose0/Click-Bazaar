import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { AppContext, formatCurrency, CategoryBackground } from '../shared';
import { api } from '../services/api';
import { Product } from '../types';

const CartPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const all = await api.getProducts();
      const map: Record<string, Product> = {};
      all.forEach(p => map[p.id] = p);
      setProducts(map);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const cartItems = context?.cart || [];
  const subtotal = cartItems.reduce((acc, item) => {
    const p = products[item.productId];
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);
  const shipping = subtotal > 1500 ? 0 : 99;
  const tax = subtotal * 0.12; // Adjusted for India GST (approx)
  const total = subtotal + shipping + tax;

  const handleCheckoutClick = () => {
    if (!context?.user) {
      // Redirect to auth with a return path
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] relative">
        <CategoryBackground category="General" />
        <Loader2 className="animate-spin text-indigo-600 relative z-10" size={48} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CategoryBackground category="General" />

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center relative z-10">
        <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-8 text-base">Nothing here yet. Let's find something you'll love!</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg md:rounded-xl font-semibold transition-all shadow-lg"
        >
          <ArrowLeft className="mr-2" size={18} />
          Start Shopping
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="General" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        <div className="flex-grow space-y-4 md:space-y-6">
          {cartItems.map(item => {
            const p = products[item.productId];
            if (!p) return null;
            return (
              <div key={item.productId} className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white border border-gray-100 rounded-lg md:rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[7px] md:text-[8px] font-semibold px-2 py-1 rounded-full">
                    #{p.orderId || `ORD-${p.id.slice(0, 6).toUpperCase()}`}
                  </div>
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                      <p className="text-xs md:text-sm text-gray-500">{p.category}</p>
                    </div>
                    <button 
                      onClick={() => context?.removeFromCart(p.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100 shadow-sm">
                      <button 
                        disabled={item.quantity <= 1}
                        onClick={() => context?.addToCart(p.id, -1)}
                        className="p-1.5 hover:bg-white rounded text-indigo-600 transition-colors disabled:opacity-30"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-gray-900 min-w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => context?.addToCart(p.id, 1)}
                        className="p-1.5 hover:bg-white rounded text-indigo-600 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-lg md:text-xl font-bold text-indigo-600">{formatCurrency(p.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl md:rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax</span>
                <span className="font-semibold text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              className="w-full mt-6 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
            >
              Continue to Checkout <ArrowLeft className="rotate-180" size={18} />
            </button>
            
            </div>
          </div>
          
          {subtotal < 1500 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg md:rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-blue-900 mb-1 text-sm">Free Shipping</h4>
              <p className="text-xs md:text-sm text-blue-700 mb-3">Add {formatCurrency(Math.max(0, 1500 - subtotal))} more for free shipping</p>
              <Link to="/shop" className="text-xs font-semibold text-blue-600 hover:underline">Continue Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;