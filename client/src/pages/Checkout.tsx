import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../store/api/cartApi";
import { useAppSelector } from "../hooks/redux";
import { formatCurrency } from "../utils/formatCurrency";
import type { Address } from "../types";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery" },
  { id: "UPI", label: "UPI" },
  { id: "CARD", label: "Credit / Debit / ATM Card" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (!cartItems?.length) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateAddress = () => {
    const requiredFields: (keyof Address)[] = ["fullName", "phone", "pincode", "street", "city", "state"];
    for (const field of requiredFields) {
      if (!address[field]?.toString().trim()) {
        toast.error("Please fill all address fields");
        return false;
      }
    }
    if ((address.phone || "").length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const continueToPayment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAddress()) return;
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ address, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message as string);
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${data.id as string}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems?.length) {
    return null;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity,
    0,
  );
  const platformFee = 7;
  const total = subtotal - discount + platformFee;

  return (
    <div className="fk-page py-4 pb-28 md:pb-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          <div className="fk-surface rounded-sm bg-white">
            <div className="flex items-center gap-3 border-b border-[#f0f0f0] p-4">
              <span className="rounded-sm bg-[#f0f5ff] px-2 py-0.5 text-xs font-semibold text-[#2a55e5]">1</span>
              <span className="text-sm font-semibold uppercase text-[#878787]">Login</span>
              <span className="ml-auto text-sm text-[#212121]">{user?.name || "Guest"}</span>
            </div>
          </div>

          <div className="fk-surface rounded-sm bg-white">
            <div className="flex items-center gap-3 bg-[#2874f0] p-4">
              <span className="rounded-sm bg-[#f0f5ff] px-2 py-0.5 text-xs font-semibold text-[#2874f0]">2</span>
              <span className="text-sm font-semibold uppercase text-white">Delivery address</span>
            </div>

            {step >= 1 ? (
              <form onSubmit={continueToPayment} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
                <input
                  name="fullName"
                  value={address.fullName}
                  onChange={handleAddressChange}
                  placeholder="Full Name"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5]"
                />
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleAddressChange}
                  placeholder="Phone Number"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5]"
                />
                <input
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  placeholder="Pincode"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5]"
                />
                <input
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5]"
                />
                <input
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="House No, Building, Street"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5] md:col-span-2"
                />
                <input
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  className="rounded-sm border border-[#d9d9d9] px-3 py-2 text-sm outline-none focus:border-[#2a55e5]"
                />
                <div className="mt-1 hidden md:col-span-2 md:block">
                  <button
                    type="submit"
                    className="fk-btn fk-btn-primary uppercase"
                    style={{ minWidth: "180px" }}
                  >
                    Continue
                  </button>
                </div>
                <div className="mt-1 md:hidden">
                  <button
                    type="submit"
                    className="fk-btn fk-btn-primary w-full uppercase"
                  >
                    Continue to payment
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          <div className="fk-surface rounded-sm bg-white">
            <div className="flex items-center gap-3 bg-[#2874f0] p-4">
              <span className="rounded-sm bg-[#f0f5ff] px-2 py-0.5 text-xs font-semibold text-[#2874f0]">3</span>
              <span className="text-sm font-semibold uppercase text-white">Order summary</span>
            </div>
            <div className="p-4">
              {cartItems.map((item) => (
                <div key={item.id} className="mb-3 flex items-center gap-3 border-b border-[#f0f0f0] pb-3 last:mb-0 last:border-0 last:pb-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-14 w-14 rounded border border-[#efefef] object-contain p-1" />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm text-[#212121]">{item.product.name}</p>
                    <p className="text-xs text-[#878787]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fk-surface rounded-sm bg-white">
            <div className="flex items-center gap-3 bg-[#2874f0] p-4">
              <span className="rounded-sm bg-[#f0f5ff] px-2 py-0.5 text-xs font-semibold text-[#2874f0]">4</span>
              <span className="text-sm font-semibold uppercase text-white">Payment options</span>
            </div>

            <div className="space-y-2 p-4">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-sm border p-3 text-sm ${paymentMethod === method.id
                      ? "border-[#2a55e5] bg-[#f0f5ff]"
                      : "border-[#e0e0e0]"
                    }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-[#2a55e5]"
                  />
                  {method.label}
                </label>
              ))}

              <div className="hidden md:block">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || step < 2}
                  className="fk-btn fk-btn-primary mt-2 uppercase"
                  style={{ minWidth: "220px" }}
                >
                  {isLoading ? "Placing order..." : "Place order"}
                </button>
              </div>
              <div className="md:hidden">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || step < 2}
                  className="fk-btn fk-btn-primary mt-2 w-full uppercase"
                >
                  {isLoading ? "Placing order..." : "Place order"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-[140px] lg:h-fit">
          <div className="fk-surface rounded-sm bg-white p-4">
            <h2 className="border-b border-[#f0f0f0] pb-3 text-sm font-semibold uppercase text-[#878787]">
              Price Details
            </h2>
            <div className="space-y-2 py-3 text-sm">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#388e3c]">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-dashed border-[#e0e0e0] pt-3 text-base font-semibold">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <p className="mt-3 rounded bg-[#e9f8ee] p-2 text-center text-sm font-semibold text-[#388e3c]">
              You will save {formatCurrency(discount - platformFee)} on this order
            </p>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-[#878787]">
            By placing your order, you agree to Flipkart clone terms for this assignment.
          </p>
          <Link to="/cart" className="mt-2 inline-block text-sm font-medium text-[#2a55e5]">
            Back to cart
          </Link>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[70] border-t border-[#e0e0e0] bg-white/98 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <div className="fk-page flex items-center justify-between gap-3 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="text-[12px] text-[#878787]">Total Amount</p>
            <p className="truncate text-[18px] font-semibold text-[#212121]">{formatCurrency(total)}</p>
          </div>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector("form");
                if (form) {
                  form.requestSubmit();
                }
              }}
              className="fk-btn fk-btn-primary min-w-[172px] uppercase tracking-wide"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="fk-btn fk-btn-primary min-w-[172px] uppercase tracking-wide"
            >
              {isLoading ? "Placing..." : "Place order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

