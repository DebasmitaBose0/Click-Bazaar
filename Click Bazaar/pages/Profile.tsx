
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Shield, Package, Heart, ShoppingBag, 
  LogOut, Star, Clock, MapPin, Loader2, ArrowRight
} from 'lucide-react';
import { AppContext, formatCurrency, CategoryBackground } from '../shared';
import CinematicToggle from '../components/CinematicToggle';
import { api } from '../services/api';
import { Order, OrderStatus, ProductCategory } from '../types';

const ProfilePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!context?.user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [context?.user, navigate]);

  const handleLogout = async () => {
    if (context?.logout) {
      await context.logout();
      navigate('/');
    }
  };

  if (!context?.user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <CategoryBackground category="Profile" />
        <Loader2 className="animate-spin text-indigo-600 relative z-10" size={48} />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 3);
  const wishlistCount = context.wishlist.length;
  const cartCount = context.cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="Profile" />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-20 relative z-10">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        
        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6 md:space-y-8">
          <div className="bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 md:w-32 h-24 md:h-32 rounded-xl md:rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-lg md:shadow-2xl md:shadow-indigo-200 mb-4 md:mb-6">
                {context.user.name.charAt(0)}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">{context.user.name}</h1>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-semibold uppercase tracking-widest mb-6 md:mb-8 border border-indigo-100">
                <Star size={10} fill="currentColor" /> Member
              </div>
              
              <div className="w-full space-y-3 md:space-y-4">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-2xl border border-transparent hover:border-gray-100 transition-all text-left">
                  <div className="p-2 md:p-3 bg-white rounded-lg text-gray-400"><Mail size={16} className="md:w-5 md:h-5" /></div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Email</p>
                    <p className="text-xs md:text-sm font-bold text-gray-700 truncate">{context.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-2xl border border-transparent hover:border-gray-100 transition-all text-left">
                  <div className="p-2 md:p-3 bg-white rounded-lg text-gray-400"><Shield size={16} className="md:w-5 md:h-5" /></div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Account</p>
                    <p className="text-xs md:text-sm font-bold text-gray-700">{context.user.role}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-6 md:mt-10 py-3 md:py-4 bg-red-50 text-red-500 rounded-lg md:rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-grow space-y-6 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Link to="/orders" className="bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
              <Package size={20} md:size={28} className="text-indigo-600 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{orders.length}</p>
              <p className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Total Orders</p>
            </Link>
            <Link to="/wishlist" className="bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
              <Heart size={20} md:size={28} className="text-pink-500 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{wishlistCount}</p>
              <p className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Wishlist Items</p>
            </Link>
            <Link to="/cart" className="bg-white border border-gray-100 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
              <ShoppingBag size={20} md:size={28} className="text-amber-500 mb-3 md:mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">{cartCount}</p>
              <p className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">In Bag</p>
            </Link>
          </div>

          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0 mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter">Recent Activity</h2>
                <p className="text-xs md:text-sm text-gray-400 font-medium mt-1">Live tracking of your curated acquisitions.</p>
              </div>
              <Link to="/orders" className="text-indigo-600 font-black text-[7px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:underline whitespace-nowrap">
                View History <ArrowRight size={12} md:size={14} />
              </Link>
            </div>

            <div className="space-y-4 md:space-y-6">
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="p-3 md:p-5 bg-gray-50 rounded-2xl md:rounded-3xl text-indigo-600 flex-shrink-0">
                      <Clock size={20} md:size={32} />
                    </div>
                    <div className="flex-grow text-center md:text-left w-full">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 mb-2">
                        <span className="text-sm md:text-lg font-black text-gray-900 uppercase tracking-tighter">{order.id}</span>
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest border ${
                          order.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600 border-green-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-sm text-gray-500 font-medium">{order.items.length} items • {formatCurrency(order.total)}</p>
                    </div>
                    <Link to="/orders" className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white rounded-lg md:rounded-xl font-bold text-[7px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 whitespace-nowrap">
                       Track Order <ArrowRight size={12} md:size={14} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 md:py-20 bg-white/50 border-2 border-dashed border-indigo-100 rounded-2xl md:rounded-[3rem]">
                   <ShoppingBag size={36} className="text-indigo-200 mx-auto mb-4 md:mb-6" />
                   <p className="text-gray-400 font-black uppercase tracking-widest text-[8px] md:text-sm">No recent transactions</p>
                </div>
              )}
            </div>

            <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold">Preferences</h3>
              <p className="text-sm text-gray-500 mb-4">Control site motion and cinematic effects. Toggle off to reduce animations and improve focus.</p>
              <CinematicToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
