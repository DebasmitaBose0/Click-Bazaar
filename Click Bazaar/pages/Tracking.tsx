import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Package, Truck, CheckCircle2, Clock, AlertCircle, Navigation, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { CategoryBackground } from '../shared';

interface TrackingData {
  orderId: string;
  status: string;
  currentLocation: string;
  estimatedDelivery: string;
  progress: number;
  deliveryDays: number;
  lastUpdated: string;
  milestones: {
    placed: { date: string; completed: boolean };
    packed: { date: string; completed: boolean };
    shipped: { date: string; completed: boolean };
    delivered: { date: string; completed: boolean };
  };
}

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warehouseInfo, setWarehouseInfo] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    const fetchTracking = async () => {
      try {
        setLoading(true);
        const data = await api.getOrderTracking(orderId);

        if (data) {
          setTracking(data);
        } else {
          setError('Order tracking information not available');
        }

        const warehouse = await api.getWarehouseInfo();
        setWarehouseInfo(warehouse);
      } catch (err) {
        setError('Failed to fetch tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();

    const interval = setInterval(fetchTracking, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-gradient-to-br from-blue-300/20 to-cyan-300/10 animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-gradient-to-tr from-indigo-300/20 to-blue-300/10 animate-pulse"
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>

        <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-gradient-to-br from-red-300/20 to-orange-300/10 animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-gradient-to-tr from-yellow-300/20 to-red-300/10 animate-pulse"
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-black text-red-900 mb-1">Tracking Unavailable</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tracking) return null;

  const milestones = [
    { label: 'Order Placed', icon: CheckCircle2, data: tracking.milestones.placed },
    { label: 'Packed', icon: Package, data: tracking.milestones.packed },
    { label: 'Shipped', icon: Truck, data: tracking.milestones.shipped },
    { label: 'Delivered', icon: CheckCircle2, data: tracking.milestones.delivered },
  ];

  const deliveryDate = new Date(tracking.estimatedDelivery);
  const isDelivered = tracking.status === 'DELIVERED';
  const daysRemaining = Math.ceil((deliveryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CategoryBackground category="General" />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative z-10">
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">{tracking.orderId}</h2>
                <p className="text-gray-600 font-bold">
                  {isDelivered ? '✓ Delivered' : `Arriving in ${daysRemaining} days`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-indigo-600">{tracking.progress}%</div>
                <p className="text-gray-500 font-bold text-sm">Complete</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                style={{ width: `${tracking.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Location & Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="text-indigo-600" size={24} />
                <h3 className="text-lg font-black text-gray-900">Current Location</h3>
              </div>
              <p className="text-2xl font-black text-indigo-600 mb-2">{tracking.currentLocation}</p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(tracking.lastUpdated).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-pink-600" size={24} />
                <h3 className="text-lg font-black text-gray-900">Warehouse</h3>
              </div>
              <p className="text-lg font-black text-gray-900 mb-1">{warehouseInfo?.city}</p>
              <p className="text-sm text-gray-600">
                {warehouseInfo?.state}, {warehouseInfo?.country} - {warehouseInfo?.pincode}
              </p>
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-green-600" size={24} />
              <h3 className="text-lg font-black text-gray-900">Estimated Delivery</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-green-600">
                {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-gray-600 font-bold">({tracking.deliveryDays} business days)</p>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">Delivery Timeline</h3>

            <div className="space-y-6">
              {milestones.map((milestone, idx) => {
                const isLast = idx === milestones.length - 1;

                return (
                  <div key={milestone.label}>
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${
                          milestone.data.completed
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`text-lg font-black mb-1 ${
                            milestone.data.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {milestone.label}
                        </h4>

                        <p className="text-sm text-gray-600">
                          {new Date(milestone.data.date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        {milestone.data.completed && (
                          <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-50 rounded-full">
                            <CheckCircle2 size={16} className="text-green-600" />
                            <span className="text-xs font-black text-green-700">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isLast && (
                      <div className="ml-6 mt-6 mb-6 w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-black text-blue-900 mb-3">Delivery Information</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-black mt-1">•</span>
                <span>Shipment originates from Barrackpore, West Bengal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black mt-1">•</span>
                <span>Delivery times vary based on destination city and distance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black mt-1">•</span>
                <span>You'll receive SMS/Email updates at each milestone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black mt-1">•</span>
                <span>For issues, contact customer support immediately</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
