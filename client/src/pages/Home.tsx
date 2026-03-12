import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useGetCategoriesQuery, useGetProductsQuery } from "../store/api/productsApi";
import ProductSkeleton from "../components/common/Skeleton";
import { formatCurrency } from "../utils/formatCurrency";

interface HeroBanner {
  title: string;
  subtitle: string;
  cta: string;
  category: string;
  bg: string;
}

const HERO_BANNERS: HeroBanner[] = [
  {
    title: "Big Savings Days",
    subtitle: "Latest deals on top brands",
    cta: "Shop now",
    category: "electronics",
    bg: "bg-gradient-to-r from-[#df2d45] to-[#ed5f72]",
  },
  {
    title: "Hottest picks this summer",
    subtitle: "Fashion and lifestyle from Rs 299",
    cta: "Explore",
    category: "fashion",
    bg: "bg-gradient-to-r from-[#c11a67] to-[#ee4f8d]",
  },
  {
    title: "Get extra cashback",
    subtitle: "Credit card offers + exchange",
    cta: "Know more",
    category: "electronics",
    bg: "bg-gradient-to-r from-[#0a60a8] to-[#2f86d0]",
  },
];

function RailItem({
  id,
  name,
  price,
  mrp,
  image,
  tag,
}: {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  tag?: string;
}) {
  const fallbackImage = `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`;

  return (
    <Link to={`/product/${id}`} className="fk-card min-w-[196px] max-w-[196px] overflow-hidden rounded-sm bg-white">
      <div className="h-[172px] bg-[#f7f7f7] p-2">
        <img
          src={image || fallbackImage}
          alt={name}
          className="h-full w-full object-contain"
          onError={(event) => {
            (event.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>
      <div className="p-2.5">
        <p className="line-clamp-2 min-h-[36px] text-[14px] leading-[1.3] text-[#212121]">{name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[18px] font-semibold leading-none text-[#212121]">{formatCurrency(price)}</span>
          <span className="text-[12px] text-[#878787] line-through">{formatCurrency(mrp)}</span>
        </div>
        {tag ? <p className="mt-1 text-[12px] font-semibold text-[#388e3c]">{tag}</p> : null}
      </div>
    </Link>
  );
}

function RailSection({
  title,
  products,
  loading,
  highlight,
}: {
  title: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    mrp: number;
    images: string[];
  }>;
  loading: boolean;
  highlight?: boolean;
}) {
  return (
    <section
      className={`mb-4 rounded-sm border ${highlight ? "border-[#d6e69e] bg-[#c7e53a]" : "fk-surface bg-white"} p-3`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="fk-section-title">{title}</h2>
        <Link to="/products" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a55e5] text-white">
          <FiArrowRight className="text-base" />
        </Link>
      </div>

      <div className={`rounded-sm ${highlight ? "bg-[#f4f4f4] p-2" : ""}`}>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
            : products.map((product) => {
              const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
              return (
                <RailItem
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  mrp={product.mrp}
                  image={product.images?.[0]}
                  tag={discount >= 40 ? "Hot Deal" : "Top Rated"}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: categories } = useGetCategoriesQuery();
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 40 });

  const products = data?.products ?? [];
  const suggested = products.slice(0, 10);
  const shoes = products.filter((item) => item.category?.slug === "fashion").slice(0, 8);
  const spotlight = products.slice(10, 20);

  return (
    <div className="pb-8">
      <div className="fk-page pt-4">
        <div className="fk-surface mb-4 rounded-sm bg-white px-3 py-3">
          <div className="scrollbar-hide flex gap-6 overflow-x-auto px-1">
            {categories?.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}&tab=${category.slug}`}
                className="flex min-w-[90px] flex-col items-center gap-2"
              >
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-[#f1f3f6] p-1.5">
                  <img
                    src={category.imageUrl ?? "https://via.placeholder.com/64x64"}
                    alt={category.name}
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                <span className="text-[13px] font-medium text-[#212121]">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {HERO_BANNERS.map((banner, idx) => (
            <Link
              key={banner.title}
              to={`/products?category=${banner.category}`}
              className={`${banner.bg} relative overflow-hidden rounded-lg p-4 text-white shadow-sm ${idx < 2 ? "lg:col-span-5" : "lg:col-span-2"
                }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/90">{banner.subtitle}</p>
              <h3 className={`mt-2 font-bold leading-tight ${idx < 2 ? "text-[28px]" : "text-[24px]"}`}>{banner.title}</h3>
              <span className="mt-3 inline-flex items-center gap-2 rounded bg-black/20 px-3 py-1.5 text-[13px] font-semibold">
                {banner.cta} <FiArrowRight />
              </span>
            </Link>
          ))}
        </div>

        <RailSection title="Suggested For You" products={suggested} loading={isLoading} />
        <RailSection
          title="Men's Casual Shoes For You"
          products={shoes.length ? shoes : suggested.slice(0, 8)}
          loading={isLoading}
          highlight
        />
        <RailSection title="In The Spotlight" products={spotlight.length ? spotlight : suggested} loading={isLoading} />
      </div>
    </div>
  );
}

