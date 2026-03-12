import { Link, useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../store/api/ordersApi';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderByIdQuery(id!);

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-flipgreen mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-6">Your order has been confirmed and will be delivered soon.</p>

        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-600">Order ID</p>
          <p className="font-bold text-gray-900 text-lg">{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-sm text-gray-500 mt-2">Estimated Delivery: 3-5 business days</p>
        </div>

        <div className="text-left mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Items Ordered</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b">
              <img src={item.product.images?.[0]} alt={item.product.name} className="w-12 h-12 object-contain border rounded p-1" />
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-3 pt-2 border-t">
            <span>Total Paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="bg-flipblue text-white px-6 py-2.5 rounded font-semibold hover:bg-blue-700 text-sm">View Orders</Link>
          <Link to="/" className="border border-flipblue text-flipblue px-6 py-2.5 rounded font-semibold hover:bg-blue-50 text-sm">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
