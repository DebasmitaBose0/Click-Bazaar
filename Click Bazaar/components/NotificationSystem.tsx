import React, { useState, useEffect, useContext } from 'react';
import { Package, Truck, CheckCircle2, X, Bell } from 'lucide-react';
import { AppContext } from '../shared';
import { api } from '../services/api';
import { OrderStatus } from '../types';

interface Notification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  status: OrderStatus;
  timestamp: Date;
}

const NotificationSystem: React.FC = () => {
    const context = useContext(AppContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastStatuses, setLastStatuses] = useState<Record<string, OrderStatus>>({});

    useEffect(() => {
        if (!context?.user) return;

        const checkStatusUpdates = async () => {
            try {
                const activeOrdersStr = localStorage.getItem('clickbazaar_active_orders');
                if (!activeOrdersStr) return;
                
                const activeOrders = JSON.parse(activeOrdersStr);
                
                for (const orderId of activeOrders) {
                    const tracking = await api.getOrderTracking(orderId);
                    if (tracking) {
                        const prevStatus = lastStatuses[orderId];
                        
                        // If status changed and it's not the first load for this order
                        if (prevStatus && prevStatus !== tracking.status) {
                            const nId = `${orderId}-${tracking.status}`;
                            
                            // Don't show if already showed for this specific status change
                            const alreadyShown = notifications.some(n => n.id === nId);
                            
                            if (!alreadyShown) {
                                addNotification({
                                    id: nId,
                                    orderId,
                                    title: `Order Update: ${orderId}`,
                                    message: getStatusMessage(tracking.status),
                                    status: tracking.status,
                                    timestamp: new Date()
                                });
                            }
                        }
                        
                        setLastStatuses(prev => ({ ...prev, [orderId]: tracking.status }));
                    }
                }
            } catch (err) {
                console.error('Error checking notifications:', err);
            }
        };

        const interval = setInterval(checkStatusUpdates, 10000); // Check every 10s
        checkStatusUpdates(); // Initial check
        
        return () => clearInterval(interval);
    }, [context?.user, lastStatuses, notifications]);

    const getStatusMessage = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PACKED: return 'Your order has been packed and is ready for pickup!';
            case OrderStatus.SHIPPED: return 'Exciting news! Your package has been shipped.';
            case OrderStatus.DELIVERED: return 'Delivered! We hope you love your purchase.';
            default: return `Order status updated to ${status.toLowerCase()}.`;
        }
    };

    const addNotification = (n: Notification) => {
        setNotifications(prev => [n, ...prev]);
        // Auto remove from screen after 8 seconds, but keep in history?
        // For this demo, let's just show them as toasts
        setTimeout(() => {
            setNotifications(prev => prev.filter(item => item.id !== n.id));
        }, 8000);
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-[100] space-y-4 max-w-sm w-full pointer-events-none">
            {notifications.map(n => (
                <div 
                    key={n.id}
                    className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-2xl p-5 shadow-2xl shadow-indigo-200/40 flex gap-4 animate-in slide-in-from-right-10 duration-500"
                >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                        n.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-600' : 
                        n.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-600' : 
                        'bg-indigo-100 text-indigo-600'
                    }`}>
                        {n.status === OrderStatus.SHIPPED ? <Truck size={20} /> : 
                         n.status === OrderStatus.DELIVERED ? <CheckCircle2 size={20} /> : 
                         <Package size={20} />}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-black text-gray-900 text-sm tracking-tight">{n.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400">Just Now</span>
                        </div>
                        <p className="text-gray-600 text-xs font-medium leading-relaxed">{n.message}</p>
                    </div>
                    <button 
                        onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                        className="text-gray-300 hover:text-gray-500 transition-colors self-start pt-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationSystem;
