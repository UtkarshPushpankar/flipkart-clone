import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../store/api/ordersApi";
import { useAppSelector } from "../hooks/redux";
import { formatCurrency } from "../utils/formatCurrency";
import type { Order } from "../types";

const STATUS_COLORS: Record<Order["status"], string> = {
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderHistory() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: orders, isLoading } = useGetOrdersQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-2xl font-semibold">Please login to view your orders</h1>
        <Link to="/login" className="mt-4 inline-block rounded-sm bg-[#2a55e5] px-6 py-2 text-white">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="fk-page py-16 text-center text-[#878787]">Loading orders...</div>;
  }

  if (!orders?.length) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <Link to="/products" className="mt-4 inline-block rounded-sm bg-[#2a55e5] px-6 py-2 text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="fk-page py-3">
      <h1 className="mb-3 text-xl font-semibold text-[#212121]">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="fk-surface rounded-sm bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#f0f0f0] pb-3">
              <div>
                <p className="text-xs text-[#878787]">Order ID</p>
                <p className="text-sm font-semibold text-[#212121]">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-[#878787]">Order Date</p>
                <p className="text-sm text-[#212121]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
              <p className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</p>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-12 w-12 rounded border border-[#efefef] object-contain p-1"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm text-[#212121]">{item.product.name}</p>
                    <p className="text-xs text-[#878787]">{item.product.brand} | Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
