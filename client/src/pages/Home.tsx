import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useGetProductsQuery } from "../store/api/productsApi";
import { formatCurrency } from "../utils/formatCurrency";

const BANNERS = [
  "/Banner-1-hero.webp",
  "/Banner-2-hero.webp",
  "/Banner-3-hero.webp",
  "/Banner-4-hero.webp",
  "/Banner-5-hero.webp",
  "/Banner-6-hero.webp",
  "/Banner-7-hero.webp",
];

interface Tile {
  id: string;
  label: string;
  sublabel: string;
  image: string;
}

const APP_ZONES = [
  { label: "For GenZ", color: "#7b2d8b", emoji: "🎮" },
  { label: "Flipkart...", color: "#1565c0", emoji: "P" },
  { label: "Gift Cards", color: "#c62828", emoji: "🎁" },
  { label: "BLACK", color: "#212121", emoji: "⬛" },
  { label: "SuperC...", color: "#e65100", emoji: "🪙" },
  { label: "Next-Gen", color: "#2e7d32", emoji: "⚡" },
];

const BRAND_SECTIONS = [
  {
    title: "MOST SEARCHED FOR ON FLIPKART",
    links: ["Ugadi Sale", "iPhone 17e", "Nothing 4a", "POCO C85x", "Samsung S26 Series", "Big Saving Days Sale", "Eid Sale", "Bags for Men", "Men's Shoes", "Boat Earbuds", "Body Lotion", "Campus Shoes", "Earphones", "Nike Shoes", "Puma Shoes", "Vivo Phones", "Iqoo Phones", "Smartwatches", "Women's Footwear", "Men's Jackets"],
  },
  {
    title: "MOBILES",
    links: ["4G Mobiles", "Nokia Phones", "Samsung Mobiles", "Oppo Mobiles", "Apple Phones", "Realme Mobiles", "OnePlus Mobiles", "POCO Mobiles", "Feature Mobile Phones", "Redmi Phones", "Motorola Mobiles", "Mobile Phones Under 10000", "Mobile Phones Under 20000"],
  },
  {
    title: "LAPTOPS",
    links: ["Apple Laptops", "Acer Laptops", "Lenovo Laptops", "Gaming Laptops", "Dell Laptops", "Asus Laptops", "HP Laptops", "Samsung Laptops", "Laptops Under 50000", "i5 Laptops", "i7 Laptops"],
  },
  {
    title: "FOOTWEAR",
    links: ["Footwear", "Kids Footwear", "Men's Formal Shoes", "Men's Casual Shoes", "Men's Sneakers", "Sports Shoes", "Women's Sandals", "Women's Sneakers", "Women's Sports Shoes", "Skechers Shoes", "Crocs"],
  },
];

function BankOfferTimer() {
  const [time, setTime] = useState({ h: 2, m: 59, s: 59 });

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 0;
          m = 0;
          s = 0;
        }
        return { h, m, s };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="mb-3 rounded-[14px] border border-[#e7ecf3] bg-[#f5f7ff] px-3 py-2 text-[#555] shadow-sm sm:mb-4 sm:px-4">
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[12px] sm:text-[13px]">
        <span className="font-medium text-[#212121]">Bank offer ends in</span>
        <span className="inline-flex items-center gap-1">
          <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">
            {pad(time.h)}
          </span>
          <span className="text-[11px] font-semibold">Hrs</span>
          <span className="font-bold text-[#333]">:</span>
          <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">
            {pad(time.m)}
          </span>
          <span className="text-[11px] font-semibold">Min</span>
          <span className="font-bold text-[#333]">:</span>
          <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">
            {pad(time.s)}
          </span>
          <span className="text-[11px] font-semibold">Sec</span>
        </span>
      </div>
    </div>
  );
}

function BannerSlider() {
  const [visible, setVisible] = useState(3);
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncVisible = () => {
      if (window.innerWidth < 768) {
        setVisible(1);
      } else if (window.innerWidth < 1100) {
        setVisible(2);
      } else {
        setVisible(3);
      }
    };

    syncVisible();
    window.addEventListener("resize", syncVisible);
    return () => window.removeEventListener("resize", syncVisible);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setIdx((prev) => prev + 1), 3500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (idx === BANNERS.length) {
      const timer = window.setTimeout(() => {
        setAnim(false);
        setIdx(0);
        window.setTimeout(() => setAnim(true), 50);
      }, 520);
      return () => window.clearTimeout(timer);
    }
  }, [idx]);

  useEffect(() => {
    setAnim(false);
    setIdx(0);
    const timer = window.setTimeout(() => setAnim(true), 50);
    return () => window.clearTimeout(timer);
  }, [visible]);

  const gap = visible === 1 ? 8 : 12;
  const slides = useMemo(() => [...BANNERS, ...BANNERS.slice(0, visible)], [visible]);
  const slideWidthPct = 100 / visible;
  const slidesCount = slides.length;

  return (
    <div className="overflow-hidden" ref={containerRef} style={{ marginBottom: "12px" }}>
      <div
        className="flex"
        style={{
          gap: `${gap}px`,
          width: `calc(${(slidesCount / visible) * 100}% + ${Math.floor(slidesCount * gap)}px)`,
          transform: `translateX(calc(-${idx * (100 / slidesCount)}% - ${idx * gap}px))`,
          transition: anim ? "transform 0.5s ease" : "none",
        }}
      >
        {slides.map((src, index) => (
          <Link
            key={`${src}-${index}`}
            to="/products"
            className="block flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl"
            style={{ width: `calc(${slideWidthPct / (slidesCount / visible)}% )` }}
          >
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="block h-[148px] w-full object-cover sm:h-[190px] lg:h-auto"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

function GreenFashionSection({ tiles }: { tiles: Tile[] }) {
  if (!tiles.length) return null;

  return (
    <div
      className="mb-3 overflow-hidden rounded-xl shadow-sm sm:mb-4 sm:rounded-2xl"
      style={{
        backgroundImage: "url(/green-bg-hero.webp)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "auto 100%",
        backgroundColor: "#c7e53a",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3"
        style={{ background: "rgba(0,0,0,0.08)" }}
      >
        <h2 className="text-[16px] font-bold text-[#212121] sm:text-[18px]">
          Best Value Deals on Fashion
        </h2>
        <Link
          to="/products?category=fashion"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#212121] text-white shadow sm:h-9 sm:w-9"
        >
          <FiChevronRight className="text-base" />
        </Link>
      </div>

      <div className="mx-2 mb-2 mt-2 rounded-[14px] bg-white sm:mx-3 sm:mb-3 sm:rounded-xl">
        <div className="scrollbar-hide flex divide-x divide-[#f0f0f0] overflow-x-auto">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              to="/products"
              className="flex min-w-[145px] max-w-[180px] flex-1 flex-shrink-0 flex-col sm:min-w-[170px] sm:max-w-[220px]"
            >
              <div className="flex h-[136px] items-center justify-center bg-[#f5f5f5] p-2 sm:h-[160px]">
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src =
                      `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                  }}
                />
              </div>
              <div className="px-2 pb-2.5 pt-1 sm:pb-3">
                <p className="text-[12px] text-[#555] sm:text-[13px]">{tile.label}</p>
                <p className="text-[12px] font-bold text-[#212121] sm:text-[13px]">
                  {tile.sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection({
  title,
  tiles,
  variant = "default",
}: {
  title: string;
  tiles: Tile[];
  variant?: "default" | "trending" | "finds";
}) {
  if (!tiles.length) return null;

  return (
    <div
      className="mb-3 overflow-hidden rounded-xl shadow-sm sm:mb-4 sm:rounded-2xl"
      style={{
        backgroundImage: "url(/bg-hero-banner.webp)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "auto 100%",
      }}
    >
      <div className="flex items-center justify-between bg-[#c0392b] px-3 py-2.5 sm:px-4 sm:py-3">
        <h2 className="text-[16px] font-bold text-white sm:text-[18px]">{title}</h2>
        <Link
          to="/products"
          className="flex items-center gap-1 rounded-full border border-white bg-white/10 px-3 py-1 text-[12px] text-white hover:bg-white/20 sm:px-4 sm:text-[13px]"
        >
          View All <FiChevronRight />
        </Link>
      </div>

      <div className="mx-2 mb-2 mt-2 rounded-[14px] bg-white sm:mx-3 sm:mb-3 sm:rounded-xl">
        <div className="scrollbar-hide flex divide-x divide-[#f0f0f0] overflow-x-auto">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              to="/products"
              className="flex min-w-[145px] max-w-[180px] flex-1 flex-shrink-0 flex-col sm:min-w-[170px] sm:max-w-[220px]"
            >
              {variant === "trending" ? (
                <>
                  <div className="h-[148px] overflow-hidden sm:h-[170px]">
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-cover object-top"
                      onError={(event) => {
                        (event.target as HTMLImageElement).src =
                          `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                      }}
                    />
                  </div>
                  <div className="bg-[#e31837] py-2 text-center text-[12px] font-semibold text-white sm:text-[13px]">
                    {tile.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-[136px] items-center justify-center bg-[#f5f5f5] p-2 sm:h-[160px]">
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        (event.target as HTMLImageElement).src =
                          `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                      }}
                    />
                  </div>
                  <div className="px-2 pb-2.5 pt-1 sm:pb-3">
                    <p className="text-[12px] text-[#555] sm:text-[13px]">{tile.label}</p>
                    <p
                      className={`text-[12px] font-bold sm:text-[13px] ${
                        variant === "finds" ? "text-[#c0392b]" : "text-[#212121]"
                      }`}
                    >
                      {tile.sublabel}
                    </p>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpotlightSlider({
  products,
}: {
  products: Array<{ id: string; name: string; price: number; mrp: number; images: string[] }>;
}) {
  if (!products.length) return null;

  return (
    <div className="mb-3 rounded-xl bg-white py-3 shadow-sm sm:mb-4 sm:rounded-2xl sm:py-4">
      <h2 className="mb-3 px-3 text-[16px] font-bold text-[#212121] sm:px-4 sm:text-[18px]">
        In The Spotlight
      </h2>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pb-2 sm:gap-3 sm:px-4">
        {products.map((product) => {
          const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
          const fallback = `https://placehold.co/200x200?text=${encodeURIComponent(product.name)}`;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="relative h-[156px] w-[165px] flex-shrink-0 overflow-hidden rounded-xl sm:h-[175px] sm:w-[195px]"
            >
              <img
                src={product.images?.[0] || fallback}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  (event.target as HTMLImageElement).src = fallback;
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="mb-0.5 inline-block rounded-sm bg-[#26a541] px-2 py-0.5 text-[11px] font-bold text-white">
                  {discount > 0 ? `Min. ${discount}% Off` : "Top Pick"}
                </span>
                <p className="text-[13px] font-semibold text-white">{formatCurrency(product.price)}</p>
              </div>
              <span className="absolute right-1.5 top-1.5 rounded-sm bg-black/40 px-1 py-0.5 text-[10px] text-white/80">
                AD
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AppZones() {
  return (
    <div className="mb-4 flex gap-4 overflow-x-auto px-1 py-2 scrollbar-hide sm:gap-5">
      {APP_ZONES.map((zone) => (
        <Link key={zone.label} to="/products" className="flex flex-shrink-0 flex-col items-center gap-1.5">
          <div
            className="flex h-[48px] w-[48px] items-center justify-center rounded-[14px] text-xl text-white shadow sm:h-[52px] sm:w-[52px] sm:text-2xl"
            style={{ background: zone.color }}
          >
            {zone.emoji}
          </div>
          <span className="text-[11px] text-[#555] sm:text-[12px]">{zone.label}</span>
        </Link>
      ))}
    </div>
  );
}

function ProductGrid({
  products,
}: {
  products: Array<{ id: string; name: string; price: number; mrp: number; images: string[] }>;
}) {
  if (!products.length) return null;

  return (
    <div className="mb-3 rounded-xl bg-white py-3 shadow-sm sm:mb-4 sm:rounded-2xl sm:py-4">
      <div className="grid grid-cols-2 gap-px bg-[#f0f0f0] md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const fallback = `https://placehold.co/240x240?text=${encodeURIComponent(product.name)}`;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative flex flex-col bg-white p-2.5 hover:shadow-md sm:p-3"
            >
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-sm bg-[#2874f0] px-2 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                Best Seller
              </span>
              <div className="mb-2 flex h-[132px] items-center justify-center bg-[#f5f7fa] sm:h-[160px]">
                <img
                  src={product.images?.[0] || fallback}
                  alt={product.name}
                  className="h-full w-full object-contain p-2"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = fallback;
                  }}
                />
              </div>
              <p className="line-clamp-2 text-[12px] leading-tight text-[#212121] sm:text-[13px]">
                <span className="font-semibold">{product.name.split(" ")[0]}</span>{" "}
                {product.name.split(" ").slice(1).join(" ")}
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                {product.mrp > product.price ? (
                  <span className="text-[11px] text-[#878787] line-through sm:text-[12px]">
                    {formatCurrency(product.mrp)}
                  </span>
                ) : null}
                <span className="text-[14px] font-semibold text-[#212121] sm:text-[15px]">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function BrandDirectory() {
  return (
    <div className="mb-0 hidden bg-[#f5f5f5] px-4 py-6 text-[13px] text-[#666] md:block">
      <div className="fk-page">
        <p className="mb-4 text-[15px] font-semibold text-[#212121]">Top Stories : Brand Directory</p>
        {BRAND_SECTIONS.map((section) => (
          <div key={section.title} className="mb-3">
            <span className="font-semibold text-[#212121]">{section.title}:&nbsp;</span>
            {section.links.map((link, index) => (
              <span key={link}>
                <Link to="/products" className="text-[#2874f0] hover:underline">
                  {link}
                </Link>
                {index < section.links.length - 1 ? <span className="mx-1 text-[#ccc]">|</span> : null}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 80 });
  const products = data?.products ?? [];

  const discountLabel = (product: (typeof products)[0]) => {
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    return discount >= 50 ? `Min. ${discount}% Off` : discount > 0 ? `Up to ${discount}% Off` : "Special offer";
  };

  const toTile = (product: (typeof products)[0], sublabel?: string): Tile => ({
    id: product.id,
    label: product.name.split(" ").slice(0, 4).join(" "),
    sublabel: sublabel ?? discountLabel(product),
    image: product.images?.[0] ?? `https://placehold.co/200x200?text=${encodeURIComponent(product.name)}`,
  });

  const fashionItems = products.filter((product) => product.category?.slug === "fashion");
  const gadgets = products.slice(0, 8).map((product) => toTile(product));
  const popular = products.slice(8, 16).map((product) => toTile(product));
  const fashionTiles = (fashionItems.length >= 4 ? fashionItems : products.slice(16, 22))
    .slice(0, 6)
    .map((product) => toTile(product));
  const trendsItems = (fashionItems.length >= 4 ? fashionItems : products.slice(16, 22))
    .slice(0, 6)
    .map((product) => ({
      ...toTile(product),
      sublabel: product.name.split(" ")[0],
    }));
  const spotlight = products.slice(22, 34);
  const homeItems = products
    .slice(34, 42)
    .map((product) => toTile(product, product.mrp > product.price ? "Special offer" : "Min. 50% Off"));
  const interesting = products.slice(42, 50).map((product) => {
    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const sublabel =
      product.price < 500
        ? "Under Rs. 499"
        : discount >= 70
          ? "Up to 90% Off"
          : discount >= 40
            ? `Min. ${discount}% Off`
            : "Top Rated";
    return toTile(product, sublabel);
  });
  const gridProducts = products.slice(50, 58);

  return (
    <div className="bg-white pb-0">
      <div className="fk-page pt-2.5 sm:pt-3">
        <BannerSlider />
      </div>

      <div className="fk-page pb-5 sm:pb-6">
        <BankOfferTimer />
        {!isLoading ? <GreenFashionSection tiles={fashionTiles} /> : null}
        {!isLoading ? <HeroSection title="Best Gadgets & Appliances" tiles={gadgets} /> : null}
        {!isLoading ? <HeroSection title="Popular nearby" tiles={popular} /> : null}
        {!isLoading ? <HeroSection title="Trends you may like" tiles={trendsItems} variant="trending" /> : null}
        {!isLoading ? <SpotlightSlider products={spotlight} /> : null}
        {!isLoading ? <HeroSection title="Make your home stylish" tiles={homeItems} /> : null}
        <AppZones />
        {!isLoading ? <HeroSection title="Interesting finds" tiles={interesting} variant="finds" /> : null}
        {!isLoading ? <ProductGrid products={gridProducts} /> : null}
      </div>

      <BrandDirectory />
    </div>
  );
}
