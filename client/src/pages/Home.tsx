import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetFeaturedProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/common/Skeleton';
import { FaChevronRight } from 'react-icons/fa';

const BANNERS = [
  {
    bg: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
    title: 'Best Deals on Electronics',
    subtitle: 'Up to 80% Off',
    cta: 'Shop Now',
    category: 'electronics',
  },
  {
    bg: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
    title: 'Fashion & Apparel',
    subtitle: 'Minimum 50% Off',
    cta: 'Explore',
    category: 'fashion',
  },
  {
    bg: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
    title: 'Home & Furniture',
    subtitle: 'Up to 60% Off',
    cta: 'Discover',
    category: 'home-furniture',
  },
];

const CATEGORY_ITEMS = [
  { name: 'Mobiles', slug: 'electronics' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Appliances', slug: 'electronics' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Home', slug: 'home-furniture' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Books', slug: 'books' },
];

export default function Home() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const [activeBanner, setActiveBanner] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveBanner((p) => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      <div className="max-w-[1300px] mx-auto px-3 py-3">

        {/* Hero Banner Carousel */}
        <div className="relative rounded-sm overflow-hidden mb-3 shadow-md" style={{ height: '320px' }}>
          {BANNERS.map((banner, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-between px-8 md:px-16 transition-opacity duration-500 ease-in-out"
              style={{
                background: banner.bg,
                opacity: i === activeBanner ? 1 : 0,
                pointerEvents: i === activeBanner ? 'auto' : 'none',
              }}
            >
              <div className="text-white max-w-2xl">
                <div className="inline-block text-[12px] font-bold px-3 py-1 rounded mb-4" style={{ backgroundColor: '#ff6b6b' }}>
                  FEATURED
                </div>
                <h2 className="text-5xl font-bold leading-tight mb-3">{banner.title}</h2>
                <p className="text-xl opacity-95 mb-6 font-medium">{banner.subtitle}</p>
                <Link
                  to={`/products?category=${banner.category}`}
                  className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-sm text-sm transition-all hover:scale-105"
                  style={{ backgroundColor: 'white', color: '#2874f0' }}
                >
                  {banner.cta} <FaChevronRight className="text-xs" />
                </Link>
              </div>
            </div>
          ))}

          {/* Carousel Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === activeBanner ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === activeBanner ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveBanner((p) => (p - 1 + BANNERS.length) % BANNERS.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-800 font-bold text-xl z-10 hover:bg-white hover:shadow-lg transition"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            ‹
          </button>
          <button
            onClick={() => setActiveBanner((p) => (p + 1) % BANNERS.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gray-800 font-bold text-xl z-10 hover:bg-white hover:shadow-lg transition"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            ›
          </button>
        </div>

        {/* Category Strip */}
        <div className="bg-white rounded-sm shadow-sm p-0 mb-3 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Shop by Category</h3>
          </div>
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORY_ITEMS.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="flex-shrink-0 w-32 py-6 px-4 text-center hover:bg-gray-50 transition border-r border-gray-100 group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {['📱', '💻', '👗', '🔌', '⚽', '🏠', '💄', '📚'][CATEGORY_ITEMS.indexOf(cat)]}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#2874f0]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Promotional Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div
            className="rounded-sm p-8 flex items-center justify-between hover:shadow-lg transition cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' }}
          >
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Sponsored</h3>
              <p className="text-sm text-white opacity-90">Exclusive offers on brands</p>
            </div>
            <span className="text-5xl">⭐</span>
          </div>
          <div
            className="rounded-sm p-8 flex items-center justify-between hover:shadow-lg transition cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
          >
            <div>
              <h3 className="font-bold text-xl text-white mb-1">Best Sellers</h3>
              <p className="text-sm text-white opacity-90">Top rated products</p>
            </div>
            <span className="text-5xl">🏆</span>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-3">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Best Offers For You</h2>
            <Link
              to="/products"
              className="text-sm font-bold px-5 py-1.5 rounded-sm text-white transition hover:shadow-md"
              style={{ backgroundColor: '#2874f0' }}
            >
              VIEW ALL
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredLoading
                ? Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : featured?.map((product) => <ProductCard key={product.id} product={product} />)
              }
            </div>
            {!featuredLoading && !featured?.length && (
              <div className="col-span-6 py-10 text-center text-gray-400">
                <p>No featured products available</p>
              </div>
            )}
          </div>
        </div>

        {/* Deal of the Day Section */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-3">
          <div className="px-5 py-4 border-b border-gray-200" style={{ backgroundColor: '#ffd89b' }}>
            <h2 className="text-xl font-bold text-gray-800">Deal of the Day</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredLoading
                ? Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                : featured?.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)
              }
            </div>
          </div>
        </div>

        {/* Flipkart Plus Banner */}
        <div
          className="rounded-sm p-8 mb-3 flex items-center justify-between hover:shadow-lg transition"
          style={{ background: 'linear-gradient(135deg, #2874f0, #1a5dc8)' }}
        >
          <div className="text-white flex-1">
            <h3 className="text-2xl font-bold mb-2">Flipkart Plus</h3>
            <p className="text-sm opacity-90">Unlock exclusive benefits — Free delivery, early access & more</p>
          </div>
          <Link
            to="/products"
            className="font-bold px-8 py-3 rounded-sm text-sm flex-shrink-0 hover:shadow-lg transition"
            style={{ backgroundColor: '#ffe500', color: '#212121' }}
          >
            Explore Plus
          </Link>
        </div>

      </div>
    </div>
  );
}
