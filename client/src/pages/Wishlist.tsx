import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../store/api/wishlistApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { useAppSelector } from '../hooks/redux';
import { formatCurrency, calculateDiscount } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: wishlist, isLoading } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  if (!isAuthenticated) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Please login to view wishlist</h2>
      <Link to="/login" className="bg-flipblue text-white px-8 py-2 rounded font-semibold">Login</Link>
    </div>
  );

  if (isLoading) return <div className="text-center py-20 text-gray-500">Loading wishlist...</div>;

  if (!wishlist?.length) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">❤️</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
      <Link to="/products" className="mt-4 inline-block bg-flipblue text-white px-8 py-2 rounded font-semibold">Explore Products</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded shadow-sm p-3 flex flex-col">
            <Link to={`/product/${item.productId}`} className="flex items-center justify-center h-44 mb-3 border border-gray-100 rounded p-2">
              <img src={item.product.images?.[0]} alt={item.product.name} className="max-h-full max-w-full object-contain" />
            </Link>
            <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{item.product.name}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-900">{formatCurrency(item.product.price)}</span>
              <span className="text-xs text-flipgreen font-semibold">{calculateDiscount(item.product.price, item.product.mrp)}% off</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={async () => {
                  await addToCart({ productId: item.productId, quantity: 1 }).unwrap();
                  toast.success('Added to cart!');
                }}
                className="flex-1 bg-fliporange text-white text-xs font-bold py-2 rounded hover:bg-orange-600"
              >
                ADD TO CART
              </button>
              <button
                onClick={async () => {
                  await removeFromWishlist(item.productId).unwrap();
                  toast.success('Removed');
                }}
                className="p-2 border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-red-500"
                aria-label="Remove from wishlist"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
