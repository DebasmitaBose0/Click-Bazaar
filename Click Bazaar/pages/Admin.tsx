
import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, 
  Plus, Edit, Trash2, Check, X, ArrowLeft, Loader2, Truck
} from 'lucide-react';
import { api } from '../services/api';
import { AppContext, formatCurrency } from '../shared';
import { UserRole, Product, Order, DashboardStats, OrderStatus, ProductCategory } from '../types';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.getAdminStats();
      setStats(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  const cards = [
    { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Orders', value: stats?.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'In Transit', value: stats?.inTransit || 0, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Customers', value: stats?.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Real-time Tracking Pulse */}
      <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              Logistics Hub <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            </h2>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">January 2026 Live Monitoring</p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <p className="text-indigo-300 text-xs font-black uppercase mb-1">Pending</p>
              <p className="text-3xl font-black">{stats?.pending || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-indigo-300 text-xs font-black uppercase mb-1">Delivered</p>
              <p className="text-3xl font-black">{stats?.delivered || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
            <div className={`p-4 rounded-2xl w-fit ${card.bg} ${card.color} mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <p className="text-gray-500 text-sm font-black uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6">2026 Sales Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          Analytics Chart Placeholder
        </div>
      </div>
    </div>
  );
};

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await api.getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await api.adminDeleteProduct(id);
      fetch();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.adminUpsertProduct(isEditing!);
    setIsEditing(null);
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <button 
          onClick={() => setIsEditing({ name: '', price: 0, stock: 0, category: ProductCategory.GROCERY, description: '', image: '' })}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">{isEditing.id ? 'Edit' : 'Add'} Product</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                <input required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={isEditing.name} onChange={e => setIsEditing({...isEditing, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={isEditing.category} onChange={e => setIsEditing({...isEditing, category: e.target.value as any})}>
                  {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                <input type="number" step="0.01" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={isEditing.price} onChange={e => setIsEditing({...isEditing, price: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                <input type="number" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={isEditing.stock} onChange={e => setIsEditing({...isEditing, stock: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                <input className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={isEditing.image} onChange={e => setIsEditing({...isEditing, image: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="submit" className="flex-grow py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(null)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 font-bold text-indigo-600">{formatCurrency(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setIsEditing(p)} className="p-2 text-gray-400 hover:text-indigo-600"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const fetch = async () => setOrders(await api.getOrders());
  useEffect(() => { fetch(); }, []);

  const handleStatusUpdate = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    fetch();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{o.id}</td>
                <td className="px-6 py-4 text-sm">
                  <p className="font-semibold">{o.shippingAddress.name}</p>
                  <p className="text-gray-400 text-xs">{o.shippingAddress.email}</p>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600">{formatCurrency(o.total)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    o.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select 
                    className="text-sm bg-gray-50 border border-gray-100 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={o.status}
                    onChange={(e) => handleStatusUpdate(o.id, e.target.value as OrderStatus)}
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (context?.user?.role !== UserRole.ADMIN) navigate('/shop');
  }, [context, navigate]);

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 hidden md:block">
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Main Menu</p>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductManager />} />
            <Route path="/orders" element={<OrderManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
