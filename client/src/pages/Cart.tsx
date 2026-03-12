import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShieldAlt } from 'react-icons/fa';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../store/api/cartApi';
import { useAppSelector } from '../hooks/redux';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cartItems, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();

  if (!isAuthenticated) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-semibold text-gray-700">Please login to view cart</h2>
      <Link to="/login" className="mt-4 inline-block bg-flipblue text-white px-8 py-2 rounded font-semibold">Login</Link>
    </div>
  );

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading cart...</div>;

  if (!cartItems?.length) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded shadow-sm p-16 max-w-md mx-auto">
        <div className="text-8xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-6 text-sm">Add items to it now</p>
        <Link to="/products" className="bg-flipblue text-white px-8 py-3 rounded font-semibold hover:bg-blue-700">Shop Now</Link>
      </div>
    </div>
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const discount = cartItems.reduce((sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity, 0);
  const total = subtotal - discount + 7;
  const savings = discount - 7;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4 items-start">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded shadow-sm">
            <div className="p-4 border-b">
              <h1 className="text-lg font-semibold text-gray-800">My Cart ({cartItems.length})</h1>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 border-b flex gap-4 hover:bg-gray-50">
                <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0 border border-gray-100 rounded p-1 flex items-center justify-center">
                  <img src={item.product.images?.[0]} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-flipblue line-clamp-2">{item.product.name}</Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.product.brand}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-bold text-gray-900">{formatCurrency(item.product.price)}</span>
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(item.product.mrp)}</span>
                    <span className="text-xs text-flipgreen font-semibold">{Math.round(((item.product.mrp - item.product.price) / item.product.mrp) * 100)}% off</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => item.quantity > 1
                          ? updateItem({ productId: item.productId, quantity: item.quantity - 1 })
                          : removeItem(item.productId)
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg"
                      >-</button>
                      <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateItem({ productId: item.productId, quantity: item.quantity + 1 })}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg"
                      >+</button>
                    </div>
                    <button
                      onClick={async () => { await removeItem(item.productId); toast.success('Removed from cart'); }}
                      className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1"
                    >
                      <FaTrash className="text-xs" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 flex justify-end border-t">
              <button onClick={() => navigate('/checkout')} className="bg-fliporange hover:bg-orange-600 text-white font-bold px-12 py-3 rounded shadow-md text-sm">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="w-80 flex-shrink-0 sticky top-20">
          <div className="bg-white rounded shadow-sm p-4">
            <h2 className="text-gray-500 font-semibold text-sm uppercase border-b pb-3 mb-3">Price Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-flipgreen">
                <span>Discount</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between"><span>Platform Fee</span><span>₹7</span></div>
              <div className="flex justify-between"><span>Delivery Charges</span><span className="text-flipgreen font-semibold">Free</span></div>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold text-base">
              <span>Total Amount</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {savings > 0 && (
              <div className="bg-green-50 border border-green-200 rounded mt-3 p-2 text-flipgreen text-sm font-semibold text-center">
                You will save {formatCurrency(savings)} on this order 🎉
              </div>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 border-t pt-3">
              <FaShieldAlt className="text-flipgreen" />
              <span>Safe and secure payments. 100% Authentic products.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
