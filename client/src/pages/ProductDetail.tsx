import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiBatteryCharging,
  FiCamera,
  FiChevronDown,
  FiChevronRight,
  FiCpu,
  FiHeart,
  FiMapPin,
  FiShare2,
  FiShield,
  FiShoppingCart,
  FiSmartphone,
  FiThumbsUp,
  FiTruck,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useGetProductByIdQuery, useGetProductsQuery } from "../store/api/productsApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/api/wishlistApi";
import { useAppSelector } from "../hooks/redux";
import { calculateDiscount, formatCurrency } from "../utils/formatCurrency";
import type { Product } from "../types";
import toast from "react-hot-toast";

type DetailsTab = "showcase" | "specifications" | "warranty" | "manufacturer";

const SERVICE_ITEMS = [
  { label: "7-day\nbrand support", icon: FiShield },
  { label: "Cash on\nDelivery", icon: FiShoppingCart },
  { label: "Flipkart\nAssured", icon: FiThumbsUp },
];

const HIGHLIGHT_ICONS = [FiCpu, FiSmartphone, FiCamera, FiBatteryCharging, FiCamera, FiTruck];

function buildMediaTiles(images: string[]) {
  const source = images.length
    ? images
    : ["https://via.placeholder.com/700x700?text=No+Image"];
  const output: string[] = [];
  while (output.length < 10) {
    output.push(source[output.length % source.length]);
  }
  return output;
}

function fallbackImage(name: string) {
  return `https://via.placeholder.com/320x320?text=${encodeURIComponent(name)}`;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailsTab>("showcase");

  const { data: product, isLoading } = useGetProductByIdQuery(id!);
  const categorySlug = product?.category?.slug || "";
  const { data: similarData } = useGetProductsQuery(
    { category: categorySlug, page: 1, limit: 24 },
    { skip: !categorySlug },
  );
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isWishlisted = wishlist?.some((item) => item.productId === product?.id) ?? false;
  const discount = product ? calculateDiscount(product.price, product.mrp) : 0;
  const mediaTiles = useMemo(() => buildMediaTiles(product?.images ?? []), [product?.images]);
  const colorSwatches = useMemo(() => mediaTiles.slice(0, 3), [mediaTiles]);
  const specEntries = useMemo(
    () => Object.entries(product?.specifications || {}),
    [product?.specifications],
  );
  const highlights = useMemo(() => specEntries.slice(0, 6), [specEntries]);
  const similarProducts = useMemo(() => {
    return (similarData?.products ?? [])
      .filter((item) => item.id !== product?.id)
      .slice(0, 12);
  }, [similarData?.products, product?.id]);

  const variantOptions = useMemo(() => {
    if (!product) return [];
    const lowerPrice = Math.max(product.price - 2000, 999);
    const lowerMrp = Math.max(product.mrp - 3000, lowerPrice + 800);
    return [
      {
        label: "128 GB + 8 GB",
        price: lowerPrice,
        mrp: lowerMrp,
        discount: calculateDiscount(lowerPrice, lowerMrp),
      },
      {
        label: "256 GB + 8 GB",
        price: product.price,
        mrp: product.mrp,
        discount,
      },
    ];
  }, [product, discount]);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedVariant(variantOptions.length > 1 ? 1 : 0);
    setActiveTab("showcase");
  }, [product?.id, variantOptions.length]);

  const selectedVariantData = variantOptions[selectedVariant] || variantOptions[0];
  const offerAmount = product ? Math.max(product.mrp - product.price, 500) : 0;
  const ratingBase = product?.rating || 4.2;
  const ratingMetrics = [
    { label: "Camera", value: Math.min(5, ratingBase + 0.1).toFixed(1) },
    { label: "Battery", value: Math.min(5, ratingBase + 0.2).toFixed(1) },
    { label: "Display", value: Math.min(5, ratingBase + 0.3).toFixed(1) },
    { label: "Design", value: Math.min(5, ratingBase + 0.2).toFixed(1) },
    { label: "Performance", value: Math.min(5, ratingBase + 0.1).toFixed(1) },
  ];
  const reviewPhotos = mediaTiles.slice(1, 6);

  const handleAddToCart = async () => {
    if (!product) return false;
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      toast.success("Added to cart");
      return true;
    } catch {
      toast.error("Failed to add product");
      return false;
    }
  };

  const handleBuyNow = async () => {
    const added = await handleAddToCart();
    if (added) navigate("/checkout");
  };

  const handleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
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
      <div className="fk-page py-3 pb-28">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_560px]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-[320px] animate-pulse rounded-[12px] bg-[#ededed]" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-[110px] animate-pulse rounded-[12px] bg-[#ededed]" />
            ))}
          </div>
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
    <div className="fk-page py-3 pb-28">
      <div className="mb-3 text-[13px] text-[#878787]">
        Home <FiChevronRight className="inline" /> {product.category?.name || "Products"}{" "}
        <FiChevronRight className="inline" />{" "}
        <span className="line-clamp-1 align-middle text-[#4a4a4a]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_560px]">
        <section className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mediaTiles.map((image, idx) => (
              <div
                key={`${image}-${idx}`}
                className={`relative overflow-hidden rounded-[12px] border border-[#e3e3e3] bg-[#e7e7e7] ${
                  idx < 2 ? "h-[520px]" : "h-[320px]"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = fallbackImage(product.name);
                  }}
                />
                {idx === 0 && (
                  <button
                    onClick={handleWishlist}
                    className="absolute right-3 top-3 rounded-[10px] bg-white p-2 text-[#444] shadow-sm"
                    aria-label="toggle wishlist"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-[18px] text-[#ff4f4f]" />
                    ) : (
                      <FiHeart className="text-[18px]" />
                    )}
                  </button>
                )}
                {idx === 1 && (
                  <button
                    className="absolute right-3 top-3 rounded-[10px] bg-white p-2 text-[#444] shadow-sm"
                    aria-label="share product"
                  >
                    <FiShare2 className="text-[18px]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-3 lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-128px)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-[12px] border border-[#e4e4e4] bg-white">
            <div className="mx-3 mt-3 rounded-[10px] bg-[#f2f2f2] px-3 py-2 text-[13px] text-[#575757]">
              Sponsored: Upgrade to flagship mobile deals.
            </div>

            <div className="px-3 pb-3 pt-2">
              <p className="text-[18px] font-semibold text-[#3a3a3a]">
                Selected Color:{" "}
                <span className="font-normal text-[#4d4d4d]">Color {selectedColor + 1}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {colorSwatches.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedColor(index)}
                    className={`h-[70px] w-[70px] overflow-hidden rounded-[10px] border-2 p-0.5 ${
                      selectedColor === index ? "border-[#2a55e5]" : "border-[#d7d7d7]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Color ${index + 1}`}
                      className="h-full w-full rounded-[8px] object-cover"
                      onError={(event) => {
                        (event.target as HTMLImageElement).src = fallbackImage(product.name);
                      }}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-3 text-[18px] font-semibold text-[#3a3a3a]">
                Variant:{" "}
                <span className="font-normal text-[#4d4d4d]">{selectedVariantData?.label}</span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {variantOptions.map((variant, idx) => (
                  <button
                    key={variant.label}
                    onClick={() => setSelectedVariant(idx)}
                    className={`rounded-[10px] border p-2 text-left ${
                      selectedVariant === idx
                        ? "border-[#2a55e5] bg-[#f5f8ff]"
                        : "border-[#dddddd] bg-white"
                    }`}
                  >
                    <p className="text-[13px] font-semibold text-[#303030]">{variant.label}</p>
                    <p className="mt-1 text-[13px] text-[#388e3c]">{variant.discount}% off</p>
                    <p className="text-[13px] font-semibold text-[#212121]">
                      {formatCurrency(variant.price)}
                    </p>
                    <p className="text-[12px] text-[#878787] line-through">
                      {formatCurrency(variant.mrp)}
                    </p>
                  </button>
                ))}
              </div>

              <p className="mt-3 text-[14px] font-semibold text-[#212121]">
                {product.brand} <span className="font-normal text-[#2a55e5]">Visit store</span>
              </p>
              <h1 className="mt-0.5 text-[32px] leading-[1.25] text-[#212121]">{product.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-[#388e3c] px-1.5 py-0.5 text-[12px] font-semibold text-white">
                  {product.rating.toFixed(1)} <FaStar className="text-[9px]" />
                </span>
                <span className="text-[13px] text-[#878787]">
                  {product.reviewCount.toLocaleString()} Ratings
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[34px] font-semibold text-[#212121]">
                  {formatCurrency(selectedVariantData?.price || product.price)}
                </span>
                <span className="text-[34px] text-[#388e3c]">{discount}%</span>
                <span className="text-[34px] text-[#878787] line-through">
                  {formatCurrency(selectedVariantData?.mrp || product.mrp)}
                </span>
              </div>
              <p className="text-[13px] text-[#6f6f6f]">+ Protect Promise Fee</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[12px] border border-[#9cc7ff] bg-white">
            <div className="flex items-center justify-between bg-[#115adf] px-3 py-2 text-[14px] font-semibold text-white">
              <span>Apply offers for maximum savings</span>
              <FiChevronDown />
            </div>
            <div className="space-y-2 bg-[#edf5ff] p-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[10px] border border-[#8cc0ff] bg-white p-2">
                  <p className="text-[20px] font-semibold text-[#212121]">
                    {formatCurrency(product.price - offerAmount)}
                  </p>
                  <p className="text-[13px] text-[#5f5f5f]">Lowest price for you</p>
                </div>
                <div className="rounded-[10px] border border-[#8cc0ff] bg-white p-2">
                  <p className="text-[20px] font-semibold text-[#212121]">
                    {formatCurrency(Math.round(product.price / 12))} x 12m
                  </p>
                  <p className="text-[13px] text-[#5f5f5f]">No Cost EMI</p>
                </div>
              </div>
              <div className="rounded-[10px] border border-[#dcecff] bg-white p-2">
                <p className="text-[14px]">
                  <span className="font-semibold">Exchange offer </span>
                  <span className="text-[#fb641b]">Pincode not Serviceable</span>
                </p>
                <p className="text-[22px] font-semibold">Up to {formatCurrency(offerAmount)}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[10px] border border-[#dcecff] bg-white p-2 text-[13px]"
                  >
                    <p className="font-semibold">{formatCurrency(Math.round(offerAmount / 2))} off</p>
                    <p className="text-[#5f5f5f]">Credit Card Cashback</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <h2 className="text-[18px] font-semibold text-[#212121]">Delivery details</h2>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 rounded-[10px] bg-[#edf5ff] p-2 text-[14px]">
                <FiMapPin className="text-[#2a55e5]" />
                <span>
                  Location not set{" "}
                  <span className="font-semibold text-[#2a55e5]">Select delivery location</span>
                </span>
              </div>
              <div className="rounded-[10px] bg-[#f5f5f5] p-2 text-[14px]">
                <p className="flex items-center gap-2 text-[#212121]">
                  <FiTruck /> Delivery by <strong>16 Mar, Mon</strong>
                </p>
                <p className="pl-6 text-[#fb641b]">Order in 01h 59m for same week delivery</p>
              </div>
              <div className="rounded-[10px] bg-[#f5f5f5] p-2 text-[14px] text-[#515151]">
                <p className="flex items-center gap-2">
                  <FiShield /> Fulfilled by Retail partner
                </p>
                <p className="pl-6">
                  {product.rating.toFixed(1)} star seller with {Math.max(2, Math.floor(product.reviewCount / 50))}
                  + years on Flipkart
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <p className="text-[15px] text-[#3a3a3a]">
              1 Year Manufacturer Warranty for {product.category?.name || "this product"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            {SERVICE_ITEMS.map(({ label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <span className="mb-2 rounded-[10px] bg-[#eef5ff] p-2 text-[#2a55e5]">
                  <Icon className="text-[18px]" />
                </span>
                <span className="whitespace-pre-line text-[13px] leading-[1.3] text-[#505050]">{label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#212121]">Product highlights</h2>
              <button className="rounded-[10px] bg-[#f2f2f2] p-1.5">
                <FiChevronDown className="text-[#5a5a5a]" />
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map(([key, value], idx) => {
                const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="rounded-[10px] bg-[#eef5ff] p-2 text-[#2a55e5]">
                      <Icon className="text-[17px]" />
                    </span>
                    <p className="text-[15px] text-[#3a3a3a]">
                      {key}: <span className="text-[#2f2f2f]">{value}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#212121]">All details</h2>
              <button className="rounded-[10px] bg-[#f2f2f2] p-1.5">
                <FiChevronDown className="text-[#5a5a5a]" />
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("showcase")}
                className={`rounded-[10px] border px-3 py-1.5 text-[14px] ${
                  activeTab === "showcase"
                    ? "border-[#212121] bg-[#212121] text-white"
                    : "border-[#d8d8d8] bg-white text-[#3a3a3a]"
                }`}
              >
                Showcase
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`rounded-[10px] border px-3 py-1.5 text-[14px] ${
                  activeTab === "specifications"
                    ? "border-[#212121] bg-[#212121] text-white"
                    : "border-[#d8d8d8] bg-white text-[#3a3a3a]"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("warranty")}
                className={`rounded-[10px] border px-3 py-1.5 text-[14px] ${
                  activeTab === "warranty"
                    ? "border-[#212121] bg-[#212121] text-white"
                    : "border-[#d8d8d8] bg-white text-[#3a3a3a]"
                }`}
              >
                Warranty
              </button>
              <button
                onClick={() => setActiveTab("manufacturer")}
                className={`rounded-[10px] border px-3 py-1.5 text-[14px] ${
                  activeTab === "manufacturer"
                    ? "border-[#212121] bg-[#212121] text-white"
                    : "border-[#d8d8d8] bg-white text-[#3a3a3a]"
                }`}
              >
                Manufacturer info
              </button>
            </div>

            {activeTab === "showcase" && (
              <div>
                <p className="text-[15px] leading-6 text-[#3f3f3f]">{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="border-b border-[#efefef] pb-2">
                    <p className="text-[13px] text-[#7a7a7a]">{key}</p>
                    <p className="text-[15px] font-medium text-[#2d2d2d]">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "warranty" && (
              <div className="text-[15px] text-[#3a3a3a]">
                <span className="font-semibold">Warranty Summary:</span> 1 Year Manufacturer
                Warranty for Phone and 6 Months for in-box accessories.
              </div>
            )}

            {activeTab === "manufacturer" && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div className="border-b border-[#efefef] pb-2">
                  <p className="text-[13px] text-[#7a7a7a]">Generic Name</p>
                  <p className="text-[15px] font-medium text-[#2d2d2d]">
                    {product.category?.name || "Electronics"}
                  </p>
                </div>
                <div className="border-b border-[#efefef] pb-2">
                  <p className="text-[13px] text-[#7a7a7a]">Country of Origin</p>
                  <p className="text-[15px] font-medium text-[#2d2d2d]">India</p>
                </div>
                <div className="col-span-1 border-b border-[#efefef] pb-2 sm:col-span-2">
                  <p className="text-[13px] text-[#7a7a7a]">Name and address of the Manufacturer</p>
                  <p className="text-[15px] font-medium text-[#2d2d2d]">
                    G-Mobile Devices Pvt Ltd, Noida, Uttar Pradesh.
                  </p>
                </div>
                <div className="col-span-1 pb-2 sm:col-span-2">
                  <p className="text-[13px] text-[#7a7a7a]">Name and address of the Packer</p>
                  <p className="text-[15px] font-medium text-[#2d2d2d]">
                    Padget Electronics Private Limited.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#212121]">Ratings and reviews</h2>
              <button className="rounded-[10px] bg-[#f2f2f2] p-1.5">
                <FiChevronDown className="text-[#5a5a5a]" />
              </button>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[30px] font-semibold text-[#2f2f2f]">{product.rating.toFixed(1)}</span>
              <FaStar className="text-[#388e3c]" />
              <span className="rounded-[8px] bg-[#e4f4ea] px-2 py-0.5 text-[13px] text-[#2f7d35]">
                Very Good
              </span>
            </div>
            <p className="text-[14px] text-[#666]">
              based on {product.reviewCount.toLocaleString()} ratings by verified buyers
            </p>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="col-span-2 row-span-2 overflow-hidden rounded-[10px]">
                <img
                  src={reviewPhotos[0]}
                  alt="review photo"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = fallbackImage(product.name);
                  }}
                />
              </div>
              {reviewPhotos.slice(1).map((item, idx) => (
                <div key={`${item}-${idx}`} className="overflow-hidden rounded-[10px]">
                  <img
                    src={item}
                    alt="review photo"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      (event.target as HTMLImageElement).src = fallbackImage(product.name);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {ratingMetrics.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full bg-[#edf5ff] px-2 py-0.5 text-[13px] text-[#264f9f]"
                >
                  {item.label} <span className="font-semibold">{item.value}</span>
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-[10px] bg-[#f8f8f8] p-3">
                <p className="text-[17px] font-semibold text-[#2c2c2c]">5 star Terrific</p>
                <p className="mt-1 text-[15px] text-[#3f3f3f]">
                  Battery backup good and display refresh rate very good.
                </p>
                <p className="mt-2 text-[13px] text-[#6b6b6b]">Anuj Sharma - Silver Reviewer</p>
              </div>
              <div className="rounded-[10px] bg-[#f8f8f8] p-3">
                <p className="text-[17px] font-semibold text-[#2c2c2c]">5 star Excellent</p>
                <p className="mt-1 text-[15px] text-[#3f3f3f]">
                  Great camera and performance with premium feel.
                </p>
                <p className="mt-2 text-[13px] text-[#6b6b6b]">Rukumuddin - Verified Buyer</p>
              </div>
            </div>

            <button className="mt-3 w-full rounded-[12px] border border-[#d8d8d8] px-3 py-2 text-[16px] font-semibold text-[#2f2f2f]">
              Show all reviews
            </button>
          </div>

          <div className="rounded-[12px] border border-[#e4e4e4] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#212121]">Questions and Answers</h2>
              <button className="rounded-[10px] bg-[#f2f2f2] p-1.5">
                <FiChevronDown className="text-[#5a5a5a]" />
              </button>
            </div>
            <p className="text-[14px] text-[#6a6a6a]">No questions and answers available.</p>
          </div>

          <div className="rounded-[12px] border border-[#d7ebff] bg-gradient-to-r from-[#f3fbff] to-[#eef8ff] p-3">
            <p className="text-[20px] font-semibold text-[#2f2f2f]">Extra 5% Off on your purchases</p>
            <p className="text-[26px] font-semibold text-[#2874f0]">Shop using SuperCoins</p>
          </div>
        </aside>
      </div>

      <section className="mt-4 rounded-[12px] border border-[#e4e4e4] bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-[#212121]">Similar Products</h2>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f6feb] text-white">
            <FiChevronRight />
          </button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
          {similarProducts.map((item: Product) => {
            const itemDiscount = calculateDiscount(item.price, item.mrp);
            return (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="min-w-[220px] max-w-[220px] rounded-[10px] border border-[#ececec] bg-white p-2 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                <div className="relative h-[220px] overflow-hidden rounded-[8px] bg-[#f5f6f7]">
                  <img
                    src={item.images?.[0] || fallbackImage(item.name)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      (event.target as HTMLImageElement).src = fallbackImage(item.name);
                    }}
                  />
                  <span className="absolute left-1.5 top-1.5 rounded bg-[#388e3c] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {item.rating.toFixed(1)} <FaStar className="inline text-[9px]" />
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[14px] leading-tight text-[#212121]">{item.name}</p>
                <p className="mt-1 text-[13px] font-semibold text-[#388e3c]">{itemDiscount}% OFF</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-semibold text-[#212121]">{formatCurrency(item.price)}</span>
                  <span className="text-[12px] text-[#878787] line-through">{formatCurrency(item.mrp)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#d7d7d7] bg-white/95 backdrop-blur-sm">
        <div className="fk-page">
          <div className="ml-auto flex w-full items-center gap-2 py-2 lg:max-w-[560px]">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="h-[50px] w-[50px] rounded-[12px] border border-[#d7d7d7] bg-white text-[#2f2f2f] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="add to cart"
            >
              <FiShoppingCart className="mx-auto text-[22px]" />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="h-[50px] flex-1 rounded-[12px] border border-[#d7d7d7] bg-white text-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="block text-[22px] font-semibold leading-[1.05] text-[#212121]">
                Buy with EMI
              </span>
              <span className="block text-[16px] leading-[1.05] text-[#454545]">
                From {formatCurrency(Math.round(product.price / 12))}/m
              </span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="h-[50px] flex-1 rounded-[12px] bg-[#ffe100] text-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="block text-[22px] font-semibold leading-[1.05] text-[#212121]">Buy now</span>
              <span className="block text-[16px] font-semibold leading-[1.05] text-[#212121]">
                at {formatCurrency(selectedVariantData?.price || product.price)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
