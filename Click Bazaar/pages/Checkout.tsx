import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Loader2, ShoppingBag, Download, AlertCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { AppContext, formatCurrency, TransactionLoader, CategoryBackground } from '../shared';
import { api } from '../services/api';
import { Product, Order } from '../types';
import { generateOrderReceipt } from '../services/logistics';

const CheckoutPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [success, setSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [zipError, setZipError] = useState('');

  const [formData, setFormData] = useState({
    name: context?.user?.name || '',
    email: context?.user?.email || '',
    address: '',
    city: '',
    zip: '',
  });

  useEffect(() => {
    if (!context?.user && !success) {
      navigate('/auth?redirect=checkout');
      return;
    }
    if (!context?.cart.length && !success) {
      navigate('/shop');
      return;
    }
    const fetch = async () => {
      const data = await api.getProducts();
      const map: any = {};
      data.forEach(p => map[p.id] = p);
      setProducts(map);
    };
    fetch();
  }, [context, navigate, success]);

  const validateUpi = (id: string) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(id);
  };

  const validateZip = (zip: string) => {
    return /^\d{6}$/.test(zip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setZipError('');
    setUpiError('');

    if (!context?.user) {
      navigate('/auth?redirect=checkout');
      return;
    }

    if (!validateZip(formData.zip)) {
      setZipError('Pincode must be exactly 6 numeric digits.');
      return;
    }

    if (paymentMode === 'upi') {
      if (!validateUpi(upiId)) {
        setUpiError('Please enter a valid UPI ID (e.g., user@bank)');
        return;
      }
    }
    
    setLoading(true);
    try {
      // Validate cart and user
      if (!context.cart || context.cart.length === 0) {
        throw new Error('Cart is empty');
      }
      
      if (!formData.name.trim()) {
        throw new Error('Please enter your full name');
      }
      
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!formData.address.trim()) {
        throw new Error('Please enter your shipping address');
      }
      
      if (!formData.city.trim()) {
        throw new Error('Please enter your city');
      }

      const order = await api.placeOrder(context.cart, {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip
      });

      // Track this order for notifications
      try {
        const activeOrders = JSON.parse(localStorage.getItem('clickbazaar_active_orders') || '[]');
        if (!activeOrders.includes(order.id)) {
            localStorage.setItem('clickbazaar_active_orders', JSON.stringify([...activeOrders, order.id]));
        }
      } catch (e) {
        console.error('Error saving active order:', e);
      }

      setLastOrder(order);
      setSuccess(true);
      context.clearCart();
    } catch (err: any) {
      console.error('Order error:', err);
      alert(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    if (!lastOrder) return;
    generateOrderReceipt(lastOrder);
  };

  const subtotal = context?.cart.reduce((acc, i) => acc + (products[i.productId]?.price || 0) * i.quantity, 0) || 0;
  const total = subtotal + (subtotal > 1500 ? 0 : 99) + (subtotal * 0.12);

  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CategoryBackground category="General" />

        <div className="max-w-2xl mx-auto px-4 py-12 md:py-24 text-center relative z-10">
        {/* Success Notification Card */}
        <div className="success-card mx-auto mb-8 md:mb-12">
          <svg className="wave" viewBox="0 0 320 80" preserveAspectRatio="none">
            <path d="M0,30 Q10,15 20,30 T40,30 T60,30 T80,30 T100,30 T120,30 T140,30 T160,30 T180,30 T200,30 T220,30 T240,30 T260,30 T280,30 T300,30 T320,30 L320,80 L0,80 Z" />
          </svg>
          <div className="icon-container">
            <svg className="checkmark" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#04e400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="message-text-container">
            <p className="message-text">Order Confirmed!</p>
            <p className="sub-text">Thanks for your purchase</p>
          </div>
          <svg className="cross-icon" viewBox="0 0 24 24" fill="none" onClick={() => navigate('/shop')}>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </div>

        <div className="bg-white/70 backdrop-blur border border-white rounded-xl md:rounded-2xl p-6 md:p-8 mb-8 text-left shadow-xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Truck size={20} className="text-green-600" />
              Shipping Info
            </h3>
            <button 
              onClick={downloadReceipt}
              className="flex items-center justify-center gap-2 text-green-600 font-semibold hover:underline bg-white px-4 py-2 rounded-lg border border-green-100 transition-all text-sm"
            >
              <Download size={16} /> PDF Invoice
            </button>
          </div>
          <p className="text-gray-700 font-semibold">{formData.name}</p>
          <p className="text-gray-600 text-sm md:text-base">{formData.address}, {formData.city}, {formData.zip}</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Paid by: {paymentMode === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
            {paymentMode === 'upi' && <p className="text-xs text-gray-500 mt-1">{upiId}</p>}
            <p className="text-xs text-green-600 font-semibold mt-3">Order ID: {lastOrder?.id}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center">
          <button onClick={() => navigate('/orders')} className="w-full md:w-auto md:px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">Track Order</button>
          <button onClick={() => navigate('/shop')} className="w-full md:w-auto md:px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all border border-gray-200">Keep Shopping</button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="General" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
      {loading && <TransactionLoader message="Processing Payment" />}
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 md:gap-12">
        <div className="flex-grow space-y-6 md:space-y-8">
          <div className="bg-white border border-gray-100 rounded-lg md:rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <Truck size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Delivery Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium text-sm"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium text-sm"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Address</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium text-sm"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">City</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium text-sm"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  placeholder="Your city"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block mb-2">PIN Code</label>
                <input 
                  required
                  maxLength={6}
                  placeholder="6 digits"
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 font-medium text-sm ${zipError ? 'border-red-500' : 'border-gray-200'}`}
                  value={formData.zip}
                  onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})}
                />
                {zipError && <p className="text-xs text-red-500 font-semibold mt-1">{zipError}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg md:rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Payment Method</h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex gap-3 md:gap-4">
                <button 
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`flex-1 p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${paymentMode === 'upi' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                >
                  <ShoppingCart size={20} />
                  <span className="font-semibold text-sm">UPI</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMode('cod')}
                  className={`flex-1 p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all flex flex-col items-center gap-2 group ${paymentMode === 'cod' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                >
                  <Truck size={20} />
                  <span className="font-semibold text-sm">Cash on Delivery</span>
                </button>
              </div>

              {paymentMode === 'upi' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">UPI ID</label>
                  <div className="relative">
                    <input 
                      required
                      placeholder="user@bank"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-600 outline-none transition-all font-medium text-sm ${upiError ? 'border-red-500' : 'border-gray-200'}`}
                      value={upiId}
                      onChange={e => {
                        setUpiId(e.target.value);
                        setUpiError('');
                      }}
                    />
                  </div>
                  {upiError && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-2">
                      <AlertCircle size={12} /> {upiError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <div className="bg-white border border-gray-100 rounded-lg md:rounded-2xl p-6 md:p-8 shadow-sm sticky top-4 md:top-24">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Order Total</h2>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {context?.cart.map(item => {
                const p = products[item.productId];
                return (
                  <div key={item.productId} className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
                    <div className="text-gray-700 font-medium truncate flex-1">{p?.name}</div>
                    <span className="text-indigo-600 font-semibold">{formatCurrency((p?.price || 0) * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold">{subtotal > 1500 ? 'FREE' : formatCurrency(99)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span className="font-semibold">{formatCurrency(subtotal * 0.12)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              {loading ? 'Processing Your Order...' : 'Complete Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CheckoutPage;