import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, Search, ExternalLink, X, MapPin, Calendar, ArrowRight, Box, Download, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { AppContext, formatCurrency, CategoryBackground } from '../shared';
import { generateOrderReceipt } from '../services/logistics';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs = {
    [OrderStatus.PLACED]: { icon: Clock, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    [OrderStatus.PACKED]: { icon: Package, color: 'bg-amber-100 text-amber-700 border-amber-200' },
    [OrderStatus.SHIPPED]: { icon: Truck, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    [OrderStatus.DELIVERED]: { icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' }
  };
  const config = configs[status] || configs[OrderStatus.PLACED];
  const { icon: Icon, color } = config;
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

const ShipmentModal: React.FC<{ order: Order; isOpen: boolean; onClose: () => void }> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const createdAt = new Date(order.createdAt);
  const addTime = (date: Date, days: number, hour: number, minute: number) => {
    const r = new Date(date);
    r.setDate(r.getDate() + days);
    r.setHours(hour, minute, 0);
    return r;
  };

  const timeline = [
    { label: 'Order Placed', date: createdAt, icon: Package, active: true },
    { label: 'Tentative Shipment', date: addTime(createdAt, 1, 9, 30), icon: Box, active: order.status !== OrderStatus.PLACED },
    { label: 'Out for Delivery', date: addTime(createdAt, 3, 11, 45), icon: Truck, active: order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED },
    { label: 'Tentative Arrival', date: addTime(createdAt, 5, 17, 15), icon: CheckCircle2, active: order.status === OrderStatus.DELIVERED }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
          <X size={24} className="text-gray-900" />
        </button>

        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-black mb-1">Track Shipment</h2>
          <p className="text-indigo-100 text-sm opacity-80 uppercase tracking-widest font-bold">Tracking ID: {order.id}</p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="space-y-8 relative">
            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

            {timeline.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start relative z-10">
                <div className={`p-3 rounded-2xl shadow-sm ${step.active ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                  <step.icon size={22} />
                </div>
                <div className="flex-grow pt-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</h4>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      {step.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Expected: {step.date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-indigo-600" />
                <h5 className="text-xs font-black uppercase text-gray-400 tracking-widest">Destination</h5>
              </div>
              <p className="text-sm font-bold text-gray-700 truncate">{order.shippingAddress.city}, India - {order.shippingAddress.zip}</p>
            </div>
            <button 
              onClick={onClose}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderHistoryPage: React.FC = () => {
  const context = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackId, setTrackId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (context?.user) {
        const data = await api.getOrders();
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
      setLoading(false);
    };
    fetch();
  }, [context?.user]);

  const handleTrack = async () => {
    if (!trackId.trim()) return;
    const order = await api.getOrderById(trackId);
    if (order) {
      setOrders([order]);
      setSelectedOrder(order);
    } else {
      alert("Invalid Tracking ID. Please try again.");
    }
  };

  if (!context?.user && !loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CategoryBackground category="General" />

        <div className="max-w-4xl mx-auto px-4 py-24 text-center relative z-10">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">Track Your Order</h1>
        <p className="text-gray-500 mb-12 max-w-md mx-auto">Enter your unique 2026 Tracking ID to see live logistics status.</p>
        <div className="max-w-md mx-auto relative group">
          <input 
            className="w-full bg-white border-2 border-indigo-200 rounded-[1.5rem] py-5 px-8 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none shadow-xl transition-all font-bold text-indigo-900"
            placeholder="e.g. ORD-AB1234"
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
          />
          <button 
            onClick={handleTrack}
            className="absolute right-3 top-3 bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-all"
          >
            <Search size={24} />
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="General" />

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter"><span className="static-brand-gradient">My Orders</span></h1>
          <p className="text-gray-500 font-medium">Manage and track your active shipments in India.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <input 
            className="w-full md:w-72 bg-white border border-gray-200 rounded-xl py-3 px-5 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all"
            placeholder="Quick Search Tracking ID..."
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
          />
          <button 
            onClick={handleTrack}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600 p-1"
          >
            <Search size={22} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh] animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all overflow-hidden border-t-4 border-t-indigo-600">
              <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Tracking ID</p>
                  <p className="font-black text-gray-900 text-lg">{order.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => generateOrderReceipt(order)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-indigo-600 font-bold text-xs border border-indigo-100 shadow-sm hover:bg-indigo-50 transition-all"
                  >
                    <Download size={16} /> PDF Invoice
                  </button>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Order Items</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-700">{item.name} <span className="text-indigo-400 ml-1">x{item.quantity}</span></span>
                        <span className="text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-black text-gray-900 text-lg">Total Paid</span>
                      <span className="text-2xl font-black text-indigo-600">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50/30 rounded-[1.5rem] p-6 border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={18} className="text-indigo-600" />
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Shipping Destination</h4>
                    </div>
                    <p className="text-sm font-black text-gray-900">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city} - {order.shippingAddress.zip}
                    </p>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="mt-6 w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      View Shipment Details <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/50 border-4 border-dashed border-indigo-100 rounded-[3rem]">
          <Package size={80} className="text-indigo-200 mx-auto mb-8" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">No History Yet</h2>
          <Link to="/shop" className="mt-8 inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">Explore Market</Link>
        </div>
      )}

      {selectedOrder && (
        <ShipmentModal 
          order={selectedOrder} 
          isOpen={!!selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;