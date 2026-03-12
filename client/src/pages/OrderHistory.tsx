import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../store/api/ordersApi';
import { useAppSelector } from '../hooks/redux';
import { formatCurrency } from '../utils/formatCurrency';
import type { Order } from '../types';

const STATUS_COLORS: Record<Order['status'], string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrderHistory() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: orders, isLoading } = useGetOrdersQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Please login to view your orders</h2>
      <Link to="/login" className="bg-flipblue text-white px-8 py-2 rounded font-semibold">Login</Link>
    </div>
  );

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading orders...</div>;

  if (!orders?.length) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
      <Link to="/products" className="mt-4 inline-block bg-flipblue text-white px-8 py-2 rounded font-semibold">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded shadow-sm p-4">
            <div className="flex items-center justify-between mb-3 border-b pb-3 flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-bold text-gray-800">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Order Date</p>
                <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              <p className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                <img src={item.product.images?.[0]} alt={item.product.name} className="w-14 h-14 object-contain border rounded p-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.product.brand} · Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold mt-0.5">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
