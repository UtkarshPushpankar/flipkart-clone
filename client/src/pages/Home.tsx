import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetFeaturedProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/common/Skeleton';

const BANNERS = [
  {
    bg: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
    title: 'Big Saving Days',
    subtitle: 'Up to 80% Off on Electronics',
    cta: 'Shop Now',
    category: 'electronics',
    emoji: '📱',
    badge: 'SALE',
  },
  {
    bg: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
    title: 'Fashion Fiesta',
    subtitle: 'Min 50% Off on Top Brands',
    cta: 'Explore Now',
    category: 'fashion',
    emoji: '👗',
    badge: 'NEW',
  },
  {
    bg: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    title: 'Home Makeover Sale',
    subtitle: 'Best Deals on Furniture & Décor',
    cta: 'Discover',
    category: 'home-furniture',
    emoji: '🛋️',
    badge: 'HOT',
  },
];

const CATEGORY_ITEMS = [
  { name: 'Mobiles', emoji: '📱', slug: 'electronics' },
  { name: 'Fashion', emoji: '👗', slug: 'fashion' },
  { name: 'Electronics', emoji: '💻', slug: 'electronics' },
  { name: 'Home', emoji: '🏠', slug: 'home-furniture' },
  { name: 'Beauty', emoji: '💄', slug: 'beauty' },
  { name: 'Sports', emoji: '⚽', slug: 'sports' },
  { name: 'Books', emoji: '📚', slug: 'books' },
  { name: 'Toys', emoji: '🧸', slug: 'electronics' },
];

export default function Home() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const [activeBanner, setActiveBanner] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveBanner((p) => (p + 1) % BANNERS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      <div className="max-w-[1300px] mx-auto px-3 py-3">

        {/* ─── Hero Banner ─── */}
        <div className="relative rounded-sm overflow-hidden mb-3 shadow-sm" style={{ height: '280px' }}>
          {BANNERS.map((banner, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-between px-10 md:px-20 transition-opacity duration-700"
              style={{
                background: banner.bg,
                opacity: i === activeBanner ? 1 : 0,
                pointerEvents: i === activeBanner ? 'auto' : 'none',
              }}
            >
              <div className="text-white">
                <span
                  className="inline-block text-[11px] font-bold px-2 py-0.5 rounded mb-3"
                  style={{ backgroundColor: '#fb641b' }}
                >
                  {banner.badge}
                </span>
                <h2 className="text-4xl font-bold leading-tight mb-2">{banner.title}</h2>
                <p className="text-lg opacity-90 mb-5">{banner.subtitle}</p>
                <Link
                  to={`/products?category=${banner.category}`}
                  className="inline-block font-bold px-8 py-2.5 rounded-sm text-sm"
                  style={{ backgroundColor: 'white', color: '#2874f0' }}
                >
                  {banner.cta} →
                </Link>
              </div>
              <div className="text-[120px] hidden md:block select-none" style={{ filter: 'drop-shadow(2px 4px 12px rgba(0,0,0,0.3))' }}>
                {banner.emoji}
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeBanner ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: i === activeBanner ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => setActiveBanner((p) => (p - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
          >
            ‹
          </button>
          <button
            onClick={() => setActiveBanner((p) => (p + 1) % BANNERS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
          >
            ›
          </button>
        </div>

        {/* ─── Shop by Category ─── */}
        <div className="bg-white rounded-sm shadow-sm p-5 mb-3">
          <h2 className="text-[18px] font-bold text-gray-800 mb-5 pb-3" style={{ borderBottom: '2px solid #f1f3f6' }}>
            Shop by Category
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORY_ITEMS.map((cat, i) => (
              <Link
                key={i}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: '#f1f3f6', border: '2px solid #e0e0e0' }}
                >
                  {cat.emoji}
                </div>
                <span className="text-[12px] text-center font-semibold text-gray-700 group-hover:text-[#2874f0]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Featured Products ─── */}
        <div className="bg-white rounded-sm shadow-sm p-5 mb-3">
          <div className="flex items-center justify-between mb-5 pb-3" style={{ borderBottom: '2px solid #f1f3f6' }}>
            <h2 className="text-[20px] font-bold text-gray-800">Featured Products</h2>
            <Link
              to="/products"
              className="text-sm font-semibold px-5 py-1.5 rounded-sm text-white"
              style={{ backgroundColor: '#2874f0' }}
            >
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {featuredLoading
              ? Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)
              : featured?.map((product) => <ProductCard key={product.id} product={product} />)
            }
            {!featuredLoading && !featured?.length && (
              <div className="col-span-6 py-10 text-center text-gray-400">
                <div className="text-5xl mb-3">📦</div>
                <p>No featured products yet. Run the seed script!</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">npm run seed</code>
              </div>
            )}
          </div>
        </div>

        {/* ─── Deal Banners Row ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {[
            { title: 'Best of Electronics', subtitle: 'Upto 60% off', emoji: '💻', slug: 'electronics', from: '#e3f2fd', to: '#bbdefb', text: '#1565C0' },
            { title: 'Clothing Must-Haves', subtitle: 'Min 50% off', emoji: '👔', slug: 'fashion', from: '#fce4ec', to: '#f8bbd0', text: '#880E4F' },
            { title: 'Sports & Outdoors', subtitle: 'Upto 70% off', emoji: '🏋️', slug: 'sports', from: '#e8f5e9', to: '#c8e6c9', text: '#1B5E20' },
          ].map((deal) => (
            <Link
              key={deal.slug + deal.title}
              to={`/products?category=${deal.slug}`}
              className="rounded-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
              style={{ background: `linear-gradient(135deg, ${deal.from}, ${deal.to})` }}
            >
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: deal.text }}>{deal.title}</h3>
                <p className="font-semibold text-sm mb-3" style={{ color: '#388e3c' }}>{deal.subtitle}</p>
                <span className="text-xs font-semibold" style={{ color: deal.text }}>Shop Now →</span>
              </div>
              <span className="text-5xl">{deal.emoji}</span>
            </Link>
          ))}
        </div>

        {/* ─── Banner Strip ─── */}
        <div
          className="rounded-sm p-6 mb-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #2874f0, #1a5dc8)' }}
        >
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-1">Flipkart Plus</h3>
            <p className="text-sm opacity-90">Unlock exclusive benefits — Free delivery, early sale access & more</p>
          </div>
          <Link
            to="/products"
            className="font-bold px-6 py-2.5 rounded-sm text-sm flex-shrink-0"
            style={{ backgroundColor: '#ffe500', color: '#212121' }}
          >
            Explore Plus ✦
          </Link>
        </div>

      </div>
    </div>
  );
}
