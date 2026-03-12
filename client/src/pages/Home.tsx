import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { useGetProductsQuery } from "../store/api/productsApi";
import { formatCurrency } from "../utils/formatCurrency";

/* ═══════════════════════════════════════
   3-UP BANNER SLIDER  (rounded, gapped)
═══════════════════════════════════════ */
const BANNERS = [
  "/Banner-1-hero.webp",
  "/Banner-2-hero.webp",
  "/Banner-3-hero.webp",
  "/Banner-4-hero.webp",
  "/Banner-5-hero.webp",
  "/Banner-6-hero.webp",
  "/Banner-7-hero.webp",
];

function BannerSlider() {
  const GAP = 12; // px gap between banners
  const VISIBLE = 3;
  // Clone first VISIBLE banners for seamless loop
  const slides = [...BANNERS, ...BANNERS.slice(0, VISIBLE)];
  const N = slides.length;
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => p + 1), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (idx === BANNERS.length) {
      const t = setTimeout(() => {
        setAnim(false);
        setIdx(0);
        setTimeout(() => setAnim(true), 50);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [idx]);

  const slideWidthPct = 100 / VISIBLE; // each banner = 1/3 of container

  return (
    <div className="overflow-hidden" ref={containerRef} style={{ marginBottom: "12px" }}>
      <div
        className="flex"
        style={{
          gap: `${GAP}px`,
          width: `calc(${(N / VISIBLE) * 100}% + ${Math.floor(N * GAP)}px)`,
          transform: `translateX(calc(-${idx * (100 / N)}% - ${idx * GAP}px))`,
          transition: anim ? "transform 0.5s ease" : "none",
        }}
      >
        {slides.map((src, i) => (
          <Link
            key={i}
            to="/products"
            className="block flex-shrink-0 overflow-hidden rounded-2xl"
            style={{ width: `calc(${slideWidthPct / (N / VISIBLE)}% )` }}
          >
            <img src={src} alt={`Banner ${i + 1}`} className="block h-auto w-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   GREEN FASHION SECTION  (below banners)
═══════════════════════════════════════ */
interface Tile {
  id: string;
  label: string;
  sublabel: string;
  image: string;
}

function GreenFashionSection({ tiles }: { tiles: Tile[] }) {
  if (!tiles.length) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-2xl shadow-sm"
      style={{
        backgroundImage: "url(/green-bg-hero.webp)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "auto 100%",
        backgroundColor: "#c7e53a", // fallback if image missing
      }}
    >
      {/* Green header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "rgba(0,0,0,0.08)" }}>
        <h2 className="text-[18px] font-bold text-[#212121]">Best Value Deals on Fashion</h2>
        <Link
          to="/products?category=fashion"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#212121] text-white shadow"
        >
          <FiChevronRight className="text-base" />
        </Link>
      </div>
      {/* White card */}
      <div className="mx-3 mb-3 mt-2 rounded-xl bg-white">
        <div className="scrollbar-hide flex divide-x divide-[#f0f0f0] overflow-x-auto">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              to="/products"
              className="flex min-w-[170px] max-w-[220px] flex-1 flex-shrink-0 flex-col"
            >
              <div className="flex h-[160px] items-center justify-center bg-[#f5f5f5] p-2">
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                  }}
                />
              </div>
              <div className="px-2 pb-3 pt-1">
                <p className="text-[13px] text-[#555]">{tile.label}</p>
                <p className="text-[13px] font-bold text-[#212121]">{tile.sublabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RED-HEADER HERO SECTION  (bg-hero-banner)
═══════════════════════════════════════ */
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
      className="mb-4 overflow-hidden rounded-2xl shadow-sm"
      style={{
        backgroundImage: "url(/bg-hero-banner.webp)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "auto 100%",
      }}
    >
      <div className="flex items-center justify-between bg-[#c0392b] px-4 py-3">
        <h2 className="text-[18px] font-bold text-white">{title}</h2>
        <Link
          to="/products"
          className="flex items-center gap-1 rounded-full border border-white bg-white/10 px-4 py-1 text-[13px] text-white hover:bg-white/20"
        >
          View All <FiChevronRight />
        </Link>
      </div>
      <div className="mx-3 mb-3 mt-2 rounded-xl bg-white">
        <div className="scrollbar-hide flex divide-x divide-[#f0f0f0] overflow-x-auto">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              to="/products"
              className="flex min-w-[170px] max-w-[220px] flex-1 flex-shrink-0 flex-col"
            >
              {variant === "trending" ? (
                <>
                  <div className="h-[170px] overflow-hidden">
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                      }}
                    />
                  </div>
                  <div className="bg-[#e31837] py-2 text-center text-[13px] font-semibold text-white">
                    {tile.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-[160px] items-center justify-center bg-[#f5f5f5] p-2">
                    <img
                      src={tile.image}
                      alt={tile.label}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/200x200?text=${encodeURIComponent(tile.label)}`;
                      }}
                    />
                  </div>
                  <div className="px-2 pb-3 pt-1">
                    <p className="text-[13px] text-[#555]">{tile.label}</p>
                    <p className={`text-[13px] font-bold ${variant === "finds" ? "text-[#c0392b]" : "text-[#212121]"}`}>
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

/* ═══════════════════════════════════════
   IN THE SPOTLIGHT  (ad-banner cards)
═══════════════════════════════════════ */
function SpotlightSlider({
  products,
}: {
  products: Array<{ id: string; name: string; price: number; mrp: number; images: string[] }>;
}) {
  if (!products.length) return null;
  return (
    <div className="mb-4 rounded-2xl bg-white py-4 shadow-sm">
      <h2 className="mb-3 px-4 text-[18px] font-bold text-[#212121]">In The Spotlight</h2>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2">
        {products.map((p) => {
          const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);
          const fallback = `https://placehold.co/200x200?text=${encodeURIComponent(p.name)}`;
          return (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="relative flex-shrink-0 overflow-hidden rounded-xl"
              style={{ width: "195px", height: "175px" }}
            >
              <img
                src={p.images?.[0] || fallback}
                alt={p.name}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="mb-0.5 inline-block rounded-sm bg-[#26a541] px-2 py-0.5 text-[11px] font-bold text-white">
                  {disc > 0 ? `Min. ${disc}% Off` : "Top Pick"}
                </span>
                <p className="text-[13px] font-semibold text-white">{formatCurrency(p.price)}</p>
              </div>
              <span className="absolute right-1.5 top-1.5 rounded-sm bg-black/40 px-1 py-0.5 text-[10px] text-white/80">AD</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   APP ZONE BUTTONS
═══════════════════════════════════════ */
const APP_ZONES = [
  { label: "For GenZ", color: "#7b2d8b", emoji: "🎮" },
  { label: "Flipkart...", color: "#1565c0", emoji: "P" },
  { label: "Gift Cards", color: "#c62828", emoji: "🎁" },
  { label: "BLACK", color: "#212121", emoji: "⬛" },
  { label: "SuperC...", color: "#e65100", emoji: "🪙" },
  { label: "Next-Gen", color: "#2e7d32", emoji: "⚡" },
];

function AppZones() {
  return (
    <div className="mb-4 flex gap-5 overflow-x-auto scrollbar-hide px-1 py-2">
      {APP_ZONES.map((z) => (
        <Link key={z.label} to="/products" className="flex flex-shrink-0 flex-col items-center gap-1.5">
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-2xl text-white shadow"
            style={{ background: z.color }}
          >
            {z.emoji}
          </div>
          <span className="text-[12px] text-[#555]">{z.label}</span>
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   RANDOM PRODUCT GRID  (above footer)
═══════════════════════════════════════ */
function ProductGrid({
  products,
}: {
  products: Array<{ id: string; name: string; price: number; mrp: number; images: string[] }>;
}) {
  if (!products.length) return null;
  return (
    <div className="mb-4 rounded-2xl bg-white py-4 shadow-sm">
      <div className="grid grid-cols-2 gap-px bg-[#f0f0f0] sm:grid-cols-4">
        {products.map((p) => {
          const fallback = `https://placehold.co/240x240?text=${encodeURIComponent(p.name)}`;
          return (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group relative flex flex-col bg-white p-3 hover:shadow-md"
            >
              {/* Best Seller badge */}
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-sm bg-[#2874f0] px-2 py-0.5 text-[11px] font-bold text-white">
                Best Seller
              </span>
              {/* Product image */}
              <div className="mb-2 flex h-[160px] items-center justify-center bg-[#f5f7fa]">
                <img
                  src={p.images?.[0] || fallback}
                  alt={p.name}
                  className="h-full w-full object-contain p-2"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                />
              </div>
              {/* Name */}
              <p className="line-clamp-2 text-[13px] leading-tight text-[#212121]">
                <span className="font-semibold">{p.name.split(" ")[0]}</span>{" "}
                {p.name.split(" ").slice(1).join(" ")}
              </p>
              {/* Price */}
              <div className="mt-1.5 flex items-baseline gap-2">
                {p.mrp > p.price && (
                  <span className="text-[12px] text-[#878787] line-through">{formatCurrency(p.mrp)}</span>
                )}
                <span className="text-[15px] font-semibold text-[#212121]">{formatCurrency(p.price)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BRAND DIRECTORY (footer text section)
═══════════════════════════════════════ */
const BRAND_SECTIONS = [
  {
    title: "MOST SEARCHED FOR ON FLIPKART",
    links: ["Ugadi Sale","iPhone 17e","Nothing 4a","POCO C85x","Nothing 4a Pro","Samsung S26 Series","Samsung Galaxy S26 5G","Samsung Galaxy S26 Plus 5G","Samsung Galaxy S26 Ultra 5G","Motorola Edge 70 Fusion","Lumio Projectors","Big Saving Days Sale","Eid Sale","Bags for Men","Laptop Store","Mixer Juicer Grinder","Men's Shoes","Adidas Men's Shoes","Boat Earbuds","Body Lotion","Campus Shoes","Earphones","Red Tape Shoes","Men's Slippers","Helmets","Nike Shoes","Puma Shoes","Trimmers","Vivo Phones","Iqoo Phones","Smartwatches","Biscuits","Women's Footwear","Trolley Bags","Water Bottles","Men's Jackets","Anarkali Suits","Hoodies for Men","Men's Watches","Men's Winter Jackets","Women's Watches","Teddy Bears","Premium Laptops","Ray Ban Meta Smart Glasses","Rings","Earrings","Airpods","Urbn Power Banks","GoBoult Wireless Earphones","Bose Soundbars","Jewellery"],
  },
  {
    title: "MOBILES",
    links: ["4G Mobiles","Nokia Phones","Samsung Mobiles","Oppo Mobiles","Apple Phones","Realme Mobiles","Nothing Phones","OnePlus Mobiles","Blackberry Phones","POCO Mobiles","Feature Mobile Phones","Redmi Phones","Motorola Mobiles","Mobile Phones Under 10000","Mobile Phones Under 15000","Mobile Phones Under 20000","Mobile Phones Under 25000","256 GB Mobiles","512 GB Mobiles","5.5 Inch Mobiles"],
  },
  {
    title: "CAMERA",
    links: ["Akaso Action Camera","Nikon Cameras","Canon Cameras","Sony Cameras","Instant Cameras","DSLR Mirrorless Cameras","GoPro Cameras","Insta360 Cameras","Drones","Sports Action Cameras"],
  },
  {
    title: "LAPTOPS",
    links: ["Apple Laptops","Acer Laptops","Lenovo Laptops","Gaming Laptops","Dell Laptops","Asus Laptops","HP Laptops","Samsung Laptops","Laptops Under 50000","Laptops Under 40000","Laptops Under 30000","i5 Laptops","i7 Laptops"],
  },
  {
    title: "TVS",
    links: ["LG TVs","Sony TVs","Samsung TVs","Mi TVs","LED TVs","OLED TVs","Smart TVs","Android TVs","4K TVs","8K TVs","LED TVs Under 15000","Best TV Brands"],
  },
  {
    title: "LARGE APPLIANCES",
    links: ["Air Conditioners","Air Coolers","Microwave Ovens","Air Fryers","Refrigerators","Washing Machines","Water Purifiers","Induction Stove","Water Geyser","Room Heaters","1.5 Ton ACs","Dish Washers","Electric Cookers"],
  },
  {
    title: "CLOTHING",
    links: ["Sarees","Lehengas","Kurtas/Kurtis","Ethnic Sets","Women's Tops","Women's Night Suits","Women's Shirts","Women's T-shirts","Women's Jeans","Gowns","Women's Trousers","Women's Sweaters","Women's Hoodies","Women's Jackets","Casual Shirts","Formal Shirts","Men's T-shirts","Men's Jeans","Men's Trousers","Men's Track Pants","Blazers","Men's Sweatshirts","Men's Sweaters"],
  },
  {
    title: "FOOTWEAR",
    links: ["Footwear","Kids Footwear","Men's Formal Shoes","Men's Casual Shoes","Men's Sneakers","Sports Shoes","Women's Sandals","Women's Slippers & Flip Flops","Heels","Women's Sneakers","Women's Sports Shoes","Boys Shoes","Girls Shoes","Skechers Shoes","Crocs"],
  },
  {
    title: "GROCERIES",
    links: ["Staples","Snacks & Beverages","Packaged Foods","Household Care","Personal & Baby Care","Masalas & Spices","Dals & Pulses","Ghee & Oils","Dry Fruits, Nuts & Seeds","Chips & Namkeens","Cookies","Noodles & Pasta","Soft Drinks","Chocolates & Sweets","Repellants & Fresheners","Laundry Detergents"],
  },
  {
    title: "BEST SELLING ON FLIPKART",
    links: ["Google Pixel 10a","Infinix Note Edge","Motorola Signature","Oppo K14x 5G","Oppo Reno 15 Pro","Vivo V70","Chocolate Horlicks","Minimalist Face Cleanser","Garnier Vitamin C Face Serum","Motorola LED Smart Google TV","Simple Face Wash (Pack of 2)","Mamaearth Anti Hair Fall Shampoo","Whirlpool Semi Automatic Top Load Washing Machine","Campus Running Shoes","LG Convection Microwave Oven","Goboult Y1 Pro Bluetooth","Fastrack Analog Metal Strap Watch","Vivo V50 5G","Puma Running Shoes","Asus Vivobook Laptop","Kent Grand LED Water Purifier","Boat Bluetooth Airdopes","Realme C71","OnePlus Nord Bluetooth Buds","Derma Co 2% Kojic Acid Face Serum","Apple iPhone 17","Apple iPhone 16 Pro","Nothing Phone 3a","Apple iPhone 16","Poco X7 Pro 5G","Samsung Galaxy S24 Ultra 5G","Apple iPhone 17 Pro","Iqoo Neo 10R 5G","Oppo F31 Pro 5G","Samsung Galaxy S25 Ultra 5G","OnePlus 15 5G"],
  },
  {
    title: "FURNITURE",
    links: ["Furniture Store","Beds","Dining Table Sets","Wardrobes","TV Units & Cabinets","Office & Study Chairs","Office & Study Tables","Sofa Sets","Mattress","Sofa Beds","Shoe Racks","Dressing Tables","Home Temples","Kitchen Cabinets","King Size Beds","Queen Size Beds"],
  },
  {
    title: "BGMH",
    links: ["NCERT Books","Toys Online Store","Pens & Stationery","Beauty And Grooming","Makeup Kits","Body, Face & Skin Care","Perfumes","Books Online Store","Automotive Accessories","Car Accessories","Bike Accessories","Food Products","Health Care","Health Supplements","Sports Equipment","Exercise & Fitness Accessories","Baby Care","Household Supplies","Home Cleaning & Bathroom Accessories","Home Decor","Home Improvement Tools","Kitchen Cookware & Serveware","Wallpapers","Home Furnishings","Wall Decor","Tableware & Dinnerware","Cookware Sets","Bed Linen & Blankets","Cushions & Pillows","Curtains","Festive Decor & Gifting"],
  },
];

function BrandDirectory() {
  return (
    <div className="mb-0 bg-[#f5f5f5] px-4 py-6 text-[13px] text-[#666]">
      <div className="fk-page">
        <p className="mb-4 text-[15px] font-semibold text-[#212121]">Top Stories : Brand Directory</p>
        {BRAND_SECTIONS.map((section) => (
          <div key={section.title} className="mb-3">
            <span className="font-semibold text-[#212121]">{section.title}:&nbsp;</span>
            {section.links.map((link, i) => (
              <span key={link}>
                <Link to="/products" className="text-[#2874f0] hover:underline">
                  {link}
                </Link>
                {i < section.links.length - 1 && <span className="mx-1 text-[#ccc]">|</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════ */
export default function Home() {
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 80 });
  const products = data?.products ?? [];

  const discLabel = (p: (typeof products)[0]) => {
    const d = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    return d >= 50 ? `Min. ${d}% Off` : d > 0 ? `Up to ${d}% Off` : "Special offer";
  };

  const toTile = (p: (typeof products)[0], sub?: string): Tile => ({
    id: p.id,
    label: p.name.split(" ").slice(0, 4).join(" "),
    sublabel: sub ?? discLabel(p),
    image: p.images?.[0] ?? `https://placehold.co/200x200?text=${encodeURIComponent(p.name)}`,
  });

  const fashionItems = products.filter((p) => p.category?.slug === "fashion");
  const gadgets   = products.slice(0, 8).map((p) => toTile(p));
  const popular   = products.slice(8, 16).map((p) => toTile(p));
  const fashionTiles = (fashionItems.length >= 4 ? fashionItems : products.slice(16, 22)).slice(0, 6).map((p) => toTile(p));
  const trendsItems  = (fashionItems.length >= 4 ? fashionItems : products.slice(16, 22)).slice(0, 6).map((p) => ({
    ...toTile(p),
    sublabel: p.name.split(" ")[0],
  }));
  const spotlight  = products.slice(22, 34);
  const homeItems  = products.slice(34, 42).map((p) => toTile(p, p.mrp > p.price ? "Special offer" : "Min. 50% Off"));
  const interesting = products.slice(42, 50).map((p) => {
    const d = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const sub = p.price < 500 ? "Under ₹499" : d >= 70 ? "Up to 90% Off" : d >= 40 ? `Min. ${d}% Off` : "Top Rated";
    return toTile(p, sub);
  });
  const gridProducts = products.slice(50, 58);

  return (
    <div className="bg-white pb-0">
      {/* ── 3-up Banner Slider ── */}
      <div className="fk-page pt-3">
        <BannerSlider />
      </div>

      <div className="fk-page pb-6">
        {/* ── Best Value Deals on Fashion (green) ── */}
        {!isLoading && <GreenFashionSection tiles={fashionTiles} />}

        {/* ── Best Gadgets & Appliances ── */}
        {!isLoading && <HeroSection title="Best Gadgets & Appliances" tiles={gadgets} />}

        {/* ── Popular nearby ── */}
        {!isLoading && <HeroSection title="Popular nearby" tiles={popular} />}

        {/* ── Trends you may like ── */}
        {!isLoading && <HeroSection title="Trends you may like" tiles={trendsItems} variant="trending" />}

        {/* ── In The Spotlight ── */}
        {!isLoading && <SpotlightSlider products={spotlight} />}

        {/* ── Make your home stylish ── */}
        {!isLoading && <HeroSection title="Make your home stylish" tiles={homeItems} />}

        {/* ── App zone buttons ── */}
        <AppZones />

        {/* ── Interesting finds ── */}
        {!isLoading && <HeroSection title="Interesting finds" tiles={interesting} variant="finds" />}

        {/* ── Random product grid ── */}
        {!isLoading && <ProductGrid products={gridProducts} />}
      </div>

      {/* ── Brand Directory ── */}
      <BrandDirectory />
    </div>
  );
}
