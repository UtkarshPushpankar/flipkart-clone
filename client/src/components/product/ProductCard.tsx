import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { formatCurrency, calculateDiscount } from '../../utils/formatCurrency';
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from '../../store/api/wishlistApi';
import { useAppSelector } from '../../hooks/redux';
import type { Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlist?.some((w) => w.productId === product.id) ?? false;
  const discount = calculateDiscount(product.price, product.mrp);

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ productId: product.id }).unwrap();
        toast.success('Added to wishlist ❤️');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div
        className="bg-white flex flex-col group cursor-pointer transition-shadow duration-200 hover:shadow-lg"
        style={{ border: '1px solid #f0f0f0', borderRadius: '2px' }}
      >
        {/* Image Container */}
        <div className="relative flex items-center justify-center p-3" style={{ height: '180px', backgroundColor: '#fff' }}>
          <img
            src={product.images?.[0] || `https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x200?text=No+Image`;
            }}
          />
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Toggle wishlist"
          >
            {isWishlisted
              ? <FaHeart style={{ color: '#ff6161', fontSize: '16px' }} />
              : <FaRegHeart style={{ color: '#878787', fontSize: '16px' }} />
            }
          </button>
          {product.stock === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            >
              <span className="font-semibold text-sm" style={{ color: '#ff6161', border: '1px solid #ff6161', padding: '4px 12px', borderRadius: '2px' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3 pb-3 flex-1 flex flex-col">
          <p className="text-sm text-gray-800 line-clamp-2 mb-1 leading-snug" style={{ fontWeight: 400 }}>
            {product.name}
          </p>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              <span
                className="flex items-center gap-0.5 text-xs font-bold text-white px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#388e3c' }}
              >
                {product.rating} <FaStar style={{ fontSize: '9px' }} />
              </span>
              <span className="text-xs" style={{ color: '#878787' }}>
                ({product.reviewCount?.toLocaleString()})
              </span>
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-center gap-2 mt-auto flex-wrap">
            <span className="font-semibold text-base text-gray-900">{formatCurrency(product.price)}</span>
            <span className="text-xs line-through" style={{ color: '#878787' }}>{formatCurrency(product.mrp)}</span>
            {discount > 0 && (
              <span className="text-xs font-semibold" style={{ color: '#388e3c' }}>{discount}% off</span>
            )}
          </div>

          {/* Free delivery tag */}
          <p className="text-xs mt-1" style={{ color: '#388e3c' }}>
            ✓ Free Delivery
          </p>
        </div>
      </div>
    </Link>
  );
}
