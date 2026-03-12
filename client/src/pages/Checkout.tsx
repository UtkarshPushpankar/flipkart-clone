import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../store/api/cartApi';
import { useAppSelector } from '../hooks/redux';
import { formatCurrency } from '../utils/formatCurrency';
import type { Address } from '../types';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI Payment', icon: '📱' },
  { id: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');

  const [address, setAddress] = useState<Address>({
    fullName: '', phone: '', pincode: '', street: '', city: '', state: '',
  });

  const total = cartItems?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;
  const savings = cartItems?.reduce((sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity, 0) ?? 0;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const required: (keyof Address)[] = ['fullName', 'phone', 'pincode', 'street', 'city', 'state'];
    if (required.some((f) => !address[f]?.toString().trim())) {
      toast.error('Please fill all address fields');
      return;
    }
    if (address.phone.length !== 10) { toast.error('Enter a valid 10-digit phone number'); return; }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ address, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message as string);
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data.id as string}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems?.length) { navigate('/cart'); return null; }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center mb-6 flex-wrap gap-2">
        {(['Delivery Address', 'Order Summary & Payment'] as const).map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 ${step === i + 1 ? 'bg-flipblue text-white rounded' : step > i + 1 ? 'text-flipblue' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= i + 1 ? 'bg-flipblue text-white' : 'bg-gray-300 text-white'}`}>{i + 1}</span>
              {s}
            </div>
            {i < 1 && <div className="w-8 h-px bg-gray-300"></div>}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          {step === 1 && (
            <div className="bg-white rounded shadow-sm p-6">
              <h2 className="text-flipblue font-bold text-sm uppercase mb-4">Delivery Address</h2>
              <form onSubmit={handleContinue} className="grid grid-cols-2 gap-4">
                {([
                  { name: 'fullName', label: 'Full Name', placeholder: 'Enter full name', colSpan: false },
                  { name: 'phone', label: 'Phone Number', placeholder: '10-digit mobile number', colSpan: false },
                  { name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', colSpan: false },
                  { name: 'city', label: 'City', placeholder: 'City', colSpan: false },
                  { name: 'street', label: 'Address', placeholder: 'House No., Building, Street, Area', colSpan: true },
                  { name: 'state', label: 'State', placeholder: 'State', colSpan: false },
                ] as const).map((field) => (
                  <div key={field.name} className={field.colSpan ? 'col-span-2' : ''}>
                    <label className="text-xs text-gray-500 mb-1 block">{field.label} *</label>
                    <input
                      name={field.name}
                      value={address[field.name as keyof Address] ?? ''}
                      onChange={handleAddressChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-flipblue"
                    />
                  </div>
                ))}
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="bg-fliporange text-white font-bold px-10 py-2.5 rounded hover:bg-orange-600">CONTINUE</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded shadow-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-flipblue font-bold text-sm uppercase">Delivery Address</h2>
                  <button onClick={() => setStep(1)} className="text-flipblue text-sm font-semibold hover:underline">Change</button>
                </div>
                <p className="font-semibold text-sm">{address.fullName} <span className="font-normal text-gray-500 ml-2">{address.phone}</span></p>
                <p className="text-sm text-gray-600 mt-1">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>

              <div className="bg-white rounded shadow-sm p-4">
                <h2 className="text-flipblue font-bold text-sm uppercase mb-3">Payment Method</h2>
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={`flex items-center gap-3 p-3 rounded border cursor-pointer mb-2 ${paymentMethod === method.id ? 'border-flipblue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="accent-flipblue" />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={handlePlaceOrder} disabled={isLoading} className="bg-fliporange hover:bg-orange-600 text-white font-bold px-12 py-3 rounded shadow-md disabled:opacity-50">
                  {isLoading ? 'Placing Order...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded shadow-sm p-4 sticky top-20">
            <h2 className="text-gray-500 font-semibold text-sm uppercase border-b pb-3 mb-3">Price Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>{formatCurrency(cartItems.reduce((s, i) => s + i.product.mrp * i.quantity, 0))}</span>
              </div>
              <div className="flex justify-between text-flipgreen"><span>Discount</span><span>- {formatCurrency(savings)}</span></div>
              <div className="flex justify-between"><span>Platform Fee</span><span>₹7</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="text-flipgreen">Free</span></div>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold">
              <span>Total Amount</span>
              <span>{formatCurrency(total + 7)}</span>
            </div>
            {savings > 0 && (
              <div className="bg-green-50 text-flipgreen text-sm font-semibold text-center mt-3 p-2 rounded border border-green-200">
                You will save {formatCurrency(savings)} 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
