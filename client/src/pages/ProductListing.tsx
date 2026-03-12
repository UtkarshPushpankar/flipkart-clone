import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiChevronRight, FiFilter } from "react-icons/fi";
import { useGetCategoriesQuery, useGetProductsQuery } from "../store/api/productsApi";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/common/Skeleton";

interface SortOption {
  label: string;
  value: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "" },
  { label: "Popularity", value: "rating" },
  { label: "Price -- Low to High", value: "price_asc" },
  { label: "Price -- High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

const PAGE_SIZE = 16;

export default function ProductListing() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";
  const page = Math.max(1, Number(params.get("page") || "1"));
  const resolvedSort = sort === "newest" ? "" : sort;

  const { data, isLoading } = useGetProductsQuery({
    search,
    category,
    sort: resolvedSort,
    page,
    limit: PAGE_SIZE,
  });
  const { data: categories } = useGetCategoriesQuery();

  const activeCategoryLabel = useMemo(() => {
    if (!category) return "All Products";
    return categories?.find((item) => item.slug === category)?.name || "Products";
  }, [categories, category]);

  const rangeStart = data?.total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = data?.total ? Math.min(page * PAGE_SIZE, data.total) : 0;

  const onCategorySelect = (slug: string) => {
    const next = new URLSearchParams(params);
    if (!slug) {
      next.delete("category");
      next.delete("tab");
    } else {
      next.set("category", slug);
      next.set("tab", slug);
    }
    next.set("page", "1");
    setParams(next);
  };

  const onSortSelect = (value: string) => {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete("sort");
    } else {
      next.set("sort", value);
    }
    next.set("page", "1");
    setParams(next);
  };

  const onPageChange = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
  };

  return (
    <div className="fk-page py-4">
      <div className="mb-3 text-xs text-[#878787]">
        Home <FiChevronRight className="inline" /> {activeCategoryLabel}
        {search ? (
          <>
            <FiChevronRight className="inline" /> Search for "{search}"
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="fk-surface hidden rounded-sm bg-white p-4 lg:block">
          <div className="mb-4 flex items-center justify-between border-b border-[#f0f0f0] pb-3">
            <h2 className="text-lg font-semibold">Filters</h2>
            <FiFilter className="text-[#2a55e5]" />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-[#212121]">Categories</p>
            <button
              onClick={() => onCategorySelect("")}
              className={`mb-2 block w-full rounded-sm px-2 py-1.5 text-left text-sm ${
                !category ? "bg-[#f0f5ff] font-semibold text-[#2a55e5]" : "hover:bg-[#f8f8f8]"
              }`}
            >
              All Categories
            </button>
            <div className="space-y-1">
              {categories?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onCategorySelect(item.slug)}
                  className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm ${
                    category === item.slug
                      ? "bg-[#f0f5ff] font-semibold text-[#2a55e5]"
                      : "text-[#212121] hover:bg-[#f8f8f8]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-[#2a55e5]"
                    checked={category === item.slug}
                    readOnly
                  />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="fk-surface rounded-sm bg-white">
          <div className="border-b border-[#f0f0f0] px-4 py-3">
            <h1 className="text-[14px] text-[#212121]">
              {search ? (
                <>
                  <span className="font-semibold">
                    Showing {rangeStart} - {rangeEnd}
                  </span>{" "}
                  of <span className="font-semibold">{data?.total ?? 0}</span> results for{" "}
                  <span className="font-semibold">"{search}"</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">{activeCategoryLabel}</span>
                  <span className="ml-2 text-[#878787]">
                    ({data?.total ?? 0} items)
                  </span>
                </>
              )}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-[14px]">
              <span className="font-medium text-[#212121]">Sort By</span>
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value || "relevance"}
                  onClick={() => onSortSelect(option.value)}
                  className={`relative pb-1 ${
                    sort === option.value
                      ? "font-semibold text-[#2a55e5]"
                      : "text-[#212121] hover:text-[#2a55e5]"
                  }`}
                >
                  {option.label}
                  {sort === option.value ? (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded bg-[#2a55e5]" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : data?.products?.length ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {data.totalPages > 1 ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-[#f0f0f0] pt-4">
                    <button
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-sm border border-[#d9d9d9] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: data.totalPages }, (_, idx) => idx + 1).map((value) => (
                      <button
                        key={value}
                        onClick={() => onPageChange(value)}
                        className={`min-w-8 rounded-sm px-3 py-1.5 text-sm ${
                          value === page ? "bg-[#2a55e5] text-white" : "border border-[#d9d9d9]"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                    <button
                      onClick={() => onPageChange(Math.min(data.totalPages, page + 1))}
                      disabled={page === data.totalPages}
                      className="rounded-sm border border-[#d9d9d9] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-2 text-center">
                <h3 className="text-2xl font-semibold text-[#212121]">No products found</h3>
                <p className="text-sm text-[#878787]">Try another search or clear active filters.</p>
                <Link to="/products" className="mt-2 rounded-sm bg-[#2a55e5] px-6 py-2 text-sm font-semibold text-white">
                  View all products
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
