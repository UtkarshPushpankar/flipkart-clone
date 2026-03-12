import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { formatCurrency, calculateDiscount } from "../../utils/formatCurrency";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../store/api/wishlistApi";
import { useAppSelector } from "../../hooks/redux";
import type { Product } from "../../types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlist?.some((item) => item.productId === product.id) ?? false;
  const discount = calculateDiscount(product.price, product.mrp);

  const handleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist({ productId: product.id }).unwrap();
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="fk-card block overflow-hidden rounded-sm bg-white hover:-translate-y-[1px]"
    >
      <div className="relative px-3 pt-3">
        <div className="flex h-[190px] items-center justify-center bg-white">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/280x280?text=No+Image"}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-200 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-[#717478] shadow-sm"
          aria-label="Toggle wishlist"
        >
          {isWishlisted ? <FaHeart className="text-sm text-[#ff4343]" /> : <FiHeart className="text-sm" />}
        </button>

        {product.rating > 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-sm bg-[#388e3c] px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {product.rating.toFixed(1)} <FaStar className="text-[9px]" />
          </span>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        <p className="line-clamp-2 min-h-[38px] text-[14px] leading-[1.35] text-[#212121]">{product.name}</p>
        <p className="mt-0.5 text-[12px] text-[#878787]">{product.brand}</p>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[17px] font-semibold leading-none text-[#212121]">{formatCurrency(product.price)}</span>
          <span className="fk-price-cut text-[12px]">{formatCurrency(product.mrp)}</span>
          {discount > 0 ? <span className="text-[12px] font-semibold text-[#388e3c]">{discount}% off</span> : null}
        </div>

        <p className="mt-1 text-[12px] text-[#388e3c]">
          {discount >= 45 ? "Hot Deal" : "Free delivery"}
        </p>

        {product.stock === 0 ? (
          <p className="mt-1 text-[12px] font-semibold text-[#d32f2f]">Out of stock</p>
        ) : null}
      </div>
    </Link>
  );
}
