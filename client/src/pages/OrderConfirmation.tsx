import { Link, useParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { useGetOrderByIdQuery } from "../store/api/ordersApi";
import { formatCurrency } from "../utils/formatCurrency";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrderByIdQuery(id!);

  if (isLoading) {
    return <div className="fk-page py-16 text-center text-[#878787]">Loading order...</div>;
  }

  if (!order) {
    return <div className="fk-page py-16 text-center text-[#878787]">Order not found</div>;
  }

  return (
    <div className="fk-page py-8">
      <div className="mx-auto max-w-2xl rounded-sm bg-white p-8 text-center shadow">
        <FiCheckCircle className="mx-auto text-6xl text-[#388e3c]" />
        <h1 className="mt-3 text-2xl font-semibold text-[#212121]">Order placed successfully</h1>
        <p className="mt-2 text-sm text-[#878787]">Your order is confirmed and will be delivered soon.</p>

        <div className="mt-5 rounded-sm border border-[#e8e8e8] bg-[#fafafa] p-4 text-left">
          <p className="text-xs text-[#878787]">Order ID</p>
          <p className="text-lg font-semibold text-[#212121]">{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="mt-1 text-xs text-[#878787]">Estimated delivery in 3-5 business days</p>
        </div>

        <div className="mt-5 text-left">
          <h2 className="mb-2 text-sm font-semibold uppercase text-[#878787]">Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-[#f0f0f0] py-2 last:border-0">
              <img src={item.product.images[0]} alt={item.product.name} className="h-12 w-12 rounded border border-[#efefef] p-1" />
              <div className="flex-1">
                <p className="line-clamp-1 text-sm text-[#212121]">{item.product.name}</p>
                <p className="text-xs text-[#878787]">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-[#f0f0f0] pt-2 text-sm font-semibold">
            <span>Total paid</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/orders" className="rounded-sm bg-[#2874f0] px-5 py-2 text-sm font-semibold text-white">
            View Orders
          </Link>
          <Link to="/" className="rounded-sm border border-[#2874f0] px-5 py-2 text-sm font-semibold text-[#2874f0]">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
