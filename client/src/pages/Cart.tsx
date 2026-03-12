import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiShield, FiTrash2 } from "react-icons/fi";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "../store/api/cartApi";
import { useAppSelector } from "../hooks/redux";
import { formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cartItems, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();

  if (!isAuthenticated) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-2xl font-semibold">Please login to view your cart</h1>
        <Link to="/login" className="mt-4 inline-block rounded-sm bg-[#2a55e5] px-6 py-2 text-white">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fk-page py-16 text-center text-[#878787]">
        Loading cart...
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="fk-page py-16">
        <div className="mx-auto max-w-md rounded-sm border border-[#e0e0e0] bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#212121]">Your cart is empty</h2>
          <p className="mt-2 text-sm text-[#878787]">Add products to continue checkout.</p>
          <Link to="/products" className="mt-5 inline-block rounded-sm bg-[#2a55e5] px-8 py-2 text-white">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity,
    0,
  );
  const platformFee = 7;
  const total = subtotal - discount + platformFee;

  return (
    <div className="fk-page py-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          <div className="fk-surface rounded-sm bg-white">
            <div className="border-b border-[#f0f0f0] p-4">
              <h1 className="text-[22px] font-medium text-[#212121]">My Cart ({cartItems.length})</h1>
            </div>

            <div className="border-b border-[#f0f0f0] p-4">
              <div className="flex items-center justify-between rounded-sm border border-[#e0e0e0] bg-[#fafafa] px-3 py-2">
                <p className="text-[14px] font-medium text-[#212121]">From Saved Addresses</p>
                <button className="rounded-sm border border-[#d9d9d9] px-3 py-1 text-sm text-[#2a55e5]">
                  Enter Delivery Pincode
                </button>
              </div>
            </div>

            {cartItems.map((item) => {
              const itemDiscount = Math.round(
                ((item.product.mrp - item.product.price) / item.product.mrp) * 100,
              );

              return (
                <div key={item.id} className="border-b border-[#f0f0f0] p-4">
                  <div className="flex gap-4">
                    <Link
                      to={`/product/${item.productId}`}
                      className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded border border-[#f0f0f0] bg-white p-2"
                    >
                      <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-contain" />
                    </Link>

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="line-clamp-2 text-[18px] font-normal leading-tight text-[#212121] hover:text-[#2a55e5]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-[14px] text-[#878787]">{item.product.brand}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[18px] font-semibold leading-none text-[#212121]">{formatCurrency(item.product.price)}</span>
                        <span className="fk-price-cut text-[13px]">{formatCurrency(item.product.mrp)}</span>
                        <span className="text-[14px] font-semibold text-[#388e3c]">{itemDiscount}% off</span>
                      </div>

                      <p className="mt-2 text-[14px] text-[#212121]">Delivery by Sun Mar 15</p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-full border border-[#d9d9d9] bg-white">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                void updateItem({ productId: item.productId, quantity: item.quantity - 1 });
                              } else {
                                void removeItem(item.productId);
                              }
                            }}
                            className="flex h-9 w-9 items-center justify-center text-[#212121]"
                            aria-label="decrease quantity"
                          >
                            <FiMinus />
                          </button>
                          <span className="min-w-12 text-center text-[14px] font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              void updateItem({ productId: item.productId, quantity: item.quantity + 1 })
                            }
                            className="flex h-9 w-9 items-center justify-center text-[#212121]"
                            aria-label="increase quantity"
                          >
                            <FiPlus />
                          </button>
                        </div>

                        <button
                          className="text-[14px] font-semibold uppercase tracking-wide text-[#212121] hover:text-[#2a55e5]"
                          onClick={async () => {
                            await removeItem(item.productId);
                            toast.success("Removed from cart");
                          }}
                        >
                          <span className="inline-flex items-center gap-1">
                            <FiTrash2 /> Remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end p-4">
              <button
                onClick={() => navigate("/checkout")}
                className="fk-btn fk-btn-primary px-12 uppercase tracking-wide"
              >
                Place order
              </button>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-[140px] lg:h-fit">
          <div className="fk-surface rounded-sm bg-white p-4">
            <h2 className="border-b border-[#f0f0f0] pb-3 text-[14px] font-semibold uppercase text-[#878787]">
              Price Details
            </h2>

            <div className="space-y-3 py-3 text-[14px] text-[#212121]">
              <div className="flex items-center justify-between">
                <span>Price ({cartItems.length} item)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#388e3c]">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-y border-dashed border-[#e0e0e0] py-3 text-[18px] font-semibold">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <p className="mt-3 rounded bg-[#e9f8ee] p-2 text-center text-[14px] font-semibold text-[#388e3c]">
              You will save {formatCurrency(discount - platformFee)} on this order
            </p>
          </div>

          <p className="mt-3 flex items-start gap-2 text-sm text-[#878787]">
            <FiShield className="mt-0.5 text-base" />
            Safe and secure payments. Easy returns. 100% Authentic products.
          </p>
        </aside>
      </div>
    </div>
  );
}

