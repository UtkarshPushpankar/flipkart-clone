import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { useGetProductByIdQuery } from '../store/api/productsApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from '../store/api/wishlistApi';
import { useAppSelector } from '../hooks/redux';
import { formatCurrency, calculateDiscount } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const { data: product, isLoading } = useGetProductByIdQuery(id!);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-4 animate-pulse">
      <div className="bg-white rounded shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const discount = calculateDiscount(product.price, product.mrp);
  const isWishlisted = wishlist?.some((w) => w.productId === product.id) ?? false;

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      navigate('/cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ productId: product.id }).unwrap();
        toast.success('Added to wishlist! ❤️');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Images */}
          <div className="md:sticky md:top-20">
            <div className="border border-gray-100 rounded p-4 flex items-center justify-center h-80 md:h-96 bg-gray-50 mb-3">
              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-14 h-14 border-2 rounded p-1 ${i === selectedImage ? 'border-flipblue' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="bg-[#ff9f00] hover:bg-yellow-500 text-white font-bold py-3 rounded shadow-md transition-colors disabled:opacity-50 text-sm"
              >
                🛒 ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="bg-fliporange hover:bg-orange-600 text-white font-bold py-3 rounded shadow-md transition-colors disabled:opacity-50 text-sm"
              >
                ⚡ BUY NOW
              </button>
            </div>
          </div>

          {/* Right - Details */}
          <div>
            <h1 className="text-xl font-medium text-gray-800 mb-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-3">{product.brand}</p>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <span className="bg-flipgreen text-white text-sm px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                {product.rating} <FaStar className="text-xs" />
              </span>
              <span className="text-sm text-gray-500">{product.reviewCount?.toLocaleString()} Ratings & Reviews</span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-xl font-semibold text-flipgreen">{discount}% off</span>
              </div>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-red-500 text-sm mt-1 font-medium">Only {product.stock} left!</p>
              )}
              {product.stock === 0 && <p className="text-red-500 font-semibold mt-1">Out of Stock</p>}
            </div>

            <div className="border border-gray-200 rounded p-3 mb-4">
              <h3 className="font-semibold text-sm mb-2">Bank Offers</h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
                <li>💳 ₹50 off on BHIM UPI Transactions. Min order value ₹200</li>
                <li>💳 5% Unlimited Cashback on Flipkart Axis Bank Credit Card</li>
                <li>💳 10% off on Kotak Bank Credit Card</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Delivery</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaTruck className="text-flipblue" />
                <span>Delivery by <strong>Sun Mar 15</strong> if ordered now</span>
              </div>
            </div>

            <button
              onClick={handleWishlist}
              className={`flex items-center gap-2 text-sm font-medium mb-4 px-4 py-2 border rounded transition-colors ${isWishlisted ? 'text-red-500 border-red-300 bg-red-50' : 'text-gray-600 border-gray-300 hover:border-red-300 hover:text-red-500'}`}
            >
              {isWishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
            </button>

            <div className="flex gap-6 text-xs text-gray-500 border-t pt-4 mb-4">
              <div className="flex flex-col items-center gap-1"><FaShieldAlt className="text-flipblue text-lg" /><span>Secure Payment</span></div>
              <div className="flex flex-col items-center gap-1"><FaUndo className="text-flipblue text-lg" /><span>10 Day Returns</span></div>
              <div className="flex flex-col items-center gap-1"><FaTruck className="text-flipblue text-lg" /><span>Free Delivery</span></div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2 text-gray-800">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-800">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 pr-4 text-gray-500 w-2/5">{key}</td>
                        <td className="py-2 text-gray-800 font-medium">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
