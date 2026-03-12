import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiChevronRight,
  FiHeart,
  FiMapPin,
  FiShield,
  FiShoppingCart,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useGetProductByIdQuery } from "../store/api/productsApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/api/wishlistApi";
import { useAppSelector } from "../hooks/redux";
import { calculateDiscount, formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: product, isLoading } = useGetProductByIdQuery(id!);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlist?.some((item) => item.productId === product?.id) ?? false;
  const discount = useMemo(() => {
    if (!product) return 0;
    return calculateDiscount(product.price, product.mrp);
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add product");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error("Please login to continue");
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

  if (isLoading) {
    return (
      <div className="fk-page py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[520px_1fr]">
          <div className="fk-surface h-[620px] animate-pulse rounded-sm bg-white" />
          <div className="fk-surface h-[620px] animate-pulse rounded-sm bg-white" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fk-page py-16 text-center">
        <h1 className="text-[24px] font-semibold">Product not found</h1>
        <Link className="mt-3 inline-block text-[#2a55e5]" to="/products">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="fk-page py-4 pb-20 md:pb-4">
      <div className="mb-3 text-[13px] text-[#878787]">
        Home <FiChevronRight className="inline" /> {product.category?.name || "Products"}
        <FiChevronRight className="inline" /> <span className="align-middle">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[520px_1fr]">
        <section className="fk-surface rounded-sm bg-white p-4 lg:sticky lg:top-[140px] lg:h-fit">
          <div className="grid grid-cols-[70px_1fr] gap-3">
            <div className="scrollbar-hide flex max-h-[480px] flex-col gap-2 overflow-auto">
              {product.images.map((image, idx) => (
                <button
                  key={`${image}-${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-[68px] w-[68px] overflow-hidden rounded border bg-white p-1 ${
                    idx === selectedImage ? "border-[#2874f0]" : "border-[#ececec]"
                  }`}
                >
                  <img src={image} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>

            <div className="relative flex h-[480px] items-center justify-center rounded bg-[#f7f7f7] p-3">
              <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-contain" />
              <button
                onClick={handleWishlist}
                className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm"
                aria-label="toggle wishlist"
              >
                {isWishlisted ? <FaHeart className="text-[#ff4343]" /> : <FiHeart className="text-[#535766]" />}
              </button>
            </div>
          </div>

          <div className="mt-4 hidden grid-cols-2 gap-3 md:grid">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="fk-btn fk-btn-cart disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiShoppingCart className="mr-2 text-base" /> ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="fk-btn fk-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              BUY NOW
            </button>
          </div>
        </section>

        <section className="fk-surface rounded-sm bg-white p-4">
          <h1 className="text-[28px] font-normal leading-tight text-[#212121]">{product.name}</h1>
          <p className="mt-1 text-[15px] text-[#878787]">Brand: {product.brand}</p>

          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#388e3c] px-1.5 py-0.5 text-[12px] font-semibold text-white">
              {product.rating.toFixed(1)} <FaStar className="text-[9px]" />
            </span>
            <span className="text-[14px] text-[#878787]">{product.reviewCount.toLocaleString()} Ratings</span>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className="text-[34px] font-semibold leading-none text-[#212121]">{formatCurrency(product.price)}</span>
            <span className="fk-price-cut text-[16px]">{formatCurrency(product.mrp)}</span>
            {discount > 0 ? <span className="text-[18px] font-semibold text-[#388e3c]">{discount}% off</span> : null}
          </div>

          {product.stock <= 10 && product.stock > 0 ? (
            <p className="mt-1 text-[14px] font-semibold text-[#d32f2f]">Only {product.stock} left in stock</p>
          ) : null}
          {product.stock === 0 ? <p className="mt-1 text-[14px] font-semibold text-[#d32f2f]">Out of stock</p> : null}

          <div className="mt-4 border-t border-[#f0f0f0] pt-3">
            <h2 className="mb-2 text-[20px] font-semibold text-[#212121]">Available offers</h2>
            <ul className="space-y-2 text-[14px] text-[#212121]">
              <li className="flex items-start gap-2">
                <FiTag className="mt-0.5 text-[#2a55e5]" />
                <span>
                  <strong>Bank Offer</strong> 10% instant discount on selected cards.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FiTag className="mt-0.5 text-[#2a55e5]" />
                <span>
                  <strong>Special Price</strong> Get extra {formatCurrency(Math.max(0, product.mrp - product.price))} off.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FiTag className="mt-0.5 text-[#2a55e5]" />
                <span>
                  <strong>No Cost EMI</strong> on orders above {formatCurrency(3000)}.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 border-t border-[#f0f0f0] pt-3">
            <h2 className="mb-2 text-[20px] font-semibold text-[#212121]">Delivery details</h2>
            <div className="space-y-2 text-[14px]">
              <p className="flex items-center gap-2 rounded bg-[#f0f5ff] p-2 text-[#2a55e5]">
                <FiMapPin /> Location not set <strong>Select delivery location</strong>
              </p>
              <p className="flex items-center gap-2 text-[#212121]">
                <FiTruck /> Delivery by <strong>15 Mar, Sun</strong>
              </p>
              <p className="flex items-center gap-2 text-[#878787]">
                <FiShield /> Safe and secure payment | Easy returns
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#f0f0f0] pt-3">
            <h2 className="mb-3 text-[20px] font-semibold text-[#212121]">Product highlights</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              {Object.entries(product.specifications || {}).map(([label, value]) => (
                <div key={label} className="border-b border-[#f0f0f0] pb-2">
                  <p className="text-[13px] text-[#878787]">{label}</p>
                  <p className="text-[15px] font-medium text-[#212121]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-[#f0f0f0] pt-3">
            <h2 className="mb-2 text-[20px] font-semibold text-[#212121]">Description</h2>
            <p className="text-[15px] leading-6 text-[#212121]">{product.description}</p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 gap-2 border-t border-[#d9d9d9] bg-white p-2 md:hidden">
        <button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock === 0}
          className="fk-btn fk-btn-outline w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          Go to cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="fk-btn bg-[#ffe500] text-[#212121] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Buy at {formatCurrency(product.price)}
        </button>
      </div>
    </div>
  );
}
