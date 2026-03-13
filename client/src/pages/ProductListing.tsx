import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiSliders,
  FiStar,
  FiX,
} from "react-icons/fi";
import {
  useGetCategoriesQuery,
  useGetProductFacetsQuery,
  useGetProductsQuery,
} from "../store/api/productsApi";
import ProductCard from "../components/product/ProductCard";
import ProductSkeleton from "../components/common/Skeleton";
import type { Category, ProductFacetBrand } from "../types";

interface SortOption {
  label: string;
  value: string;
}

interface PriceOption {
  label: string;
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  categories: Category[];
  brands: ProductFacetBrand[];
  catalogMaxPrice: number;
  activeCategory: string;
  activeBrands: string[];
  activeMinPrice?: number;
  activeMaxPrice?: number;
  activeMinRating?: number;
  categorySearch: string;
  brandSearch: string;
  onCategorySearchChange: (value: string) => void;
  onBrandSearchChange: (value: string) => void;
  onCategorySelect: (slug: string) => void;
  onBrandToggle: (brand: string) => void;
  onPriceSelect: (option?: PriceOption) => void;
  onRatingSelect: (rating?: number) => void;
  onClearAll: () => void;
  onClose?: () => void;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "" },
  { label: "Popularity", value: "rating" },
  { label: "Price -- Low to High", value: "price_asc" },
  { label: "Price -- High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

const PAGE_SIZE = 16;
const RATING_OPTIONS = [4, 3, 2];

function getPriceOptions(maxPrice: number): PriceOption[] {
  return [
    { label: "Under Rs. 500", max: 500 },
    { label: "Rs. 500 - Rs. 1000", min: 500, max: 1000 },
    { label: "Rs. 1000 - Rs. 5000", min: 1000, max: 5000 },
    { label: `Above Rs. 5000`, min: 5000, max: maxPrice || undefined },
  ];
}

function isPriceOptionActive(
  option: PriceOption,
  activeMinPrice?: number,
  activeMaxPrice?: number,
) {
  return (option.min ?? undefined) === activeMinPrice && (option.max ?? undefined) === activeMaxPrice;
}

function FilterPanel({
  categories,
  brands,
  catalogMaxPrice,
  activeCategory,
  activeBrands,
  activeMinPrice,
  activeMaxPrice,
  activeMinRating,
  categorySearch,
  brandSearch,
  onCategorySearchChange,
  onBrandSearchChange,
  onCategorySelect,
  onBrandToggle,
  onPriceSelect,
  onRatingSelect,
  onClearAll,
  onClose,
}: FilterPanelProps) {
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const query = categorySearch.trim().toLowerCase();
    return categories.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query),
    );
  }, [categories, categorySearch]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const query = brandSearch.trim().toLowerCase();
    return brands.filter((item) => item.name.toLowerCase().includes(query));
  }, [brands, brandSearch]);

  const activeFiltersCount =
    (activeCategory ? 1 : 0) +
    activeBrands.length +
    (activeMinPrice !== undefined || activeMaxPrice !== undefined ? 1 : 0) +
    (activeMinRating ? 1 : 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-4">
        <div>
          <h2 className="text-[18px] font-semibold text-[#212121]">Filters</h2>
          <p className="text-[12px] text-[#878787]">
            {activeFiltersCount ? `${activeFiltersCount} active filters` : "Refine results"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount ? (
            <button
              onClick={onClearAll}
              className="text-[12px] font-semibold uppercase tracking-[0.3px] text-[#2874f0]"
            >
              Clear all
            </button>
          ) : null}
          {onClose ? (
            <button
              onClick={onClose}
              className="rounded-full p-1 text-[#5f5f5f] hover:bg-[#f5f5f5]"
              aria-label="Close filters"
            >
              <FiX className="text-[18px]" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="minimal-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <div className="border-b border-[#f0f0f0] px-4 py-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] text-[#212121]">
            Category
          </p>
          <div className="relative mb-3">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#878787]" />
            <input
              value={categorySearch}
              onChange={(event) => onCategorySearchChange(event.target.value)}
              placeholder="Search category"
              className="h-[40px] w-full rounded-[8px] border border-[#d7d7d7] bg-white pl-10 pr-3 text-[14px] text-[#212121] outline-none focus:border-[#2874f0]"
            />
          </div>
          <div className="space-y-2">
            <button
              onClick={() => onCategorySelect("")}
              className={`flex w-full items-center justify-between rounded-[10px] border px-3 py-3 text-left ${
                !activeCategory
                  ? "border-[#2874f0] bg-[#f5f8ff]"
                  : "border-[#ececec] bg-white hover:border-[#c9dcff]"
              }`}
            >
              <span className="text-[14px] font-medium text-[#212121]">All Categories</span>
              <span className="text-[12px] text-[#878787]">{categories.length} groups</span>
            </button>
            {filteredCategories.map((item) => (
              <button
                key={item.id}
                onClick={() => onCategorySelect(item.slug)}
                className={`flex w-full items-center gap-3 rounded-[10px] border px-3 py-3 text-left ${
                  activeCategory === item.slug
                    ? "border-[#2874f0] bg-[#f5f8ff]"
                    : "border-[#ececec] bg-white hover:border-[#c9dcff]"
                }`}
              >
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                    activeCategory === item.slug
                      ? "border-[#2874f0] bg-[#2874f0]"
                      : "border-[#c7c7c7] bg-white"
                  }`}
                >
                  {activeCategory === item.slug ? (
                    <span className="h-[8px] w-[8px] rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-[#212121]">{item.name}</span>
                  <span className="block text-[12px] text-[#878787]">
                    {item._count?.products ?? 0} products
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-[#f0f0f0] px-4 py-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] text-[#212121]">
            Brand
          </p>
          <div className="relative mb-3">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#878787]" />
            <input
              value={brandSearch}
              onChange={(event) => onBrandSearchChange(event.target.value)}
              placeholder="Search brand"
              className="h-[40px] w-full rounded-[8px] border border-[#d7d7d7] bg-white pl-10 pr-3 text-[14px] text-[#212121] outline-none focus:border-[#2874f0]"
            />
          </div>
          <div className="space-y-2">
            {filteredBrands.map((brand) => {
              const selected = activeBrands.includes(brand.name);
              return (
                <button
                  key={brand.name}
                  onClick={() => onBrandToggle(brand.name)}
                  className={`flex w-full items-center justify-between rounded-[10px] border px-3 py-2.5 text-left ${
                    selected
                      ? "border-[#2874f0] bg-[#f5f8ff]"
                      : "border-[#ececec] bg-white hover:border-[#c9dcff]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border ${
                        selected
                          ? "border-[#2874f0] bg-[#2874f0]"
                          : "border-[#c7c7c7] bg-white"
                      }`}
                    >
                      {selected ? <span className="text-[11px] font-bold text-white">✓</span> : null}
                    </span>
                    <span className="text-[14px] font-medium text-[#212121]">{brand.name}</span>
                  </span>
                  <span className="text-[12px] text-[#878787]">{brand.count}</span>
                </button>
              );
            })}
            {!filteredBrands.length ? (
              <div className="rounded-[10px] border border-dashed border-[#d8d8d8] px-3 py-5 text-center text-[13px] text-[#878787]">
                No matching brands found.
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-b border-[#f0f0f0] px-4 py-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] text-[#212121]">
            Price
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onPriceSelect(undefined)}
              className={`flex w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left ${
                activeMinPrice === undefined && activeMaxPrice === undefined
                  ? "border-[#2874f0] bg-[#f5f8ff]"
                  : "border-[#ececec] bg-white hover:border-[#c9dcff]"
              }`}
            >
              <span className="text-[14px] font-medium text-[#212121]">All Prices</span>
            </button>
            {getPriceOptions(catalogMaxPrice).map((option) => (
              <button
                key={option.label}
                onClick={() => onPriceSelect(option)}
                className={`flex w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left ${
                  isPriceOptionActive(option, activeMinPrice, activeMaxPrice)
                    ? "border-[#2874f0] bg-[#f5f8ff]"
                    : "border-[#ececec] bg-white hover:border-[#c9dcff]"
                }`}
              >
                <span className="text-[14px] font-medium text-[#212121]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.4px] text-[#212121]">
            Customer Ratings
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onRatingSelect(undefined)}
              className={`flex w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left ${
                !activeMinRating
                  ? "border-[#2874f0] bg-[#f5f8ff]"
                  : "border-[#ececec] bg-white hover:border-[#c9dcff]"
              }`}
            >
              <span className="text-[14px] font-medium text-[#212121]">All Ratings</span>
            </button>
            {RATING_OPTIONS.map((rating) => (
              <button
                key={rating}
                onClick={() => onRatingSelect(rating)}
                className={`flex w-full items-center justify-between rounded-[10px] border px-3 py-2.5 text-left ${
                  activeMinRating === rating
                    ? "border-[#2874f0] bg-[#f5f8ff]"
                    : "border-[#ececec] bg-white hover:border-[#c9dcff]"
                }`}
              >
                <span className="inline-flex items-center gap-2 text-[14px] font-medium text-[#212121]">
                  {rating} <FiStar className="text-[#388e3c]" /> & above
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductListing() {
  const [params, setParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";
  const brand = params.get("brand") || "";
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const minRating = params.get("minRating");
  const page = Math.max(1, Number(params.get("page") || "1"));

  const activeBrands = useMemo(
    () => brand.split(",").map((item) => item.trim()).filter(Boolean),
    [brand],
  );

  const activeMinPrice = minPrice ? Number(minPrice) : undefined;
  const activeMaxPrice = maxPrice ? Number(maxPrice) : undefined;
  const activeMinRating = minRating ? Number(minRating) : undefined;

  const deferredCategorySearch = useDeferredValue(categorySearch.trim().toLowerCase());
  const deferredBrandSearch = useDeferredValue(brandSearch.trim().toLowerCase());
  const resolvedSort = sort === "newest" ? "" : sort;

  const { data, isLoading } = useGetProductsQuery({
    search,
    category,
    brand: activeBrands.join(",") || undefined,
    minPrice: activeMinPrice,
    maxPrice: activeMaxPrice,
    minRating: activeMinRating,
    sort: resolvedSort,
    page,
    limit: PAGE_SIZE,
  });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: facets } = useGetProductFacetsQuery({ search, category });

  const categories = useMemo(() => {
    const base = [...(categoriesData ?? [])].sort((a, b) => {
      const countDiff = (b._count?.products ?? 0) - (a._count?.products ?? 0);
      if (countDiff !== 0) return countDiff;
      return a.name.localeCompare(b.name);
    });

    if (!deferredCategorySearch) return base;

    return base.filter(
      (item) =>
        item.name.toLowerCase().includes(deferredCategorySearch) ||
        item.slug.toLowerCase().includes(deferredCategorySearch),
    );
  }, [categoriesData, deferredCategorySearch]);

  const brands = useMemo(() => {
    const base = facets?.brands ?? [];
    if (!deferredBrandSearch) return base;
    return base.filter((item) => item.name.toLowerCase().includes(deferredBrandSearch));
  }, [facets?.brands, deferredBrandSearch]);

  const quickCategoryChips = useMemo(() => (categoriesData ?? []).slice(0, 6), [categoriesData]);
  const activeCategory = useMemo(
    () => categoriesData?.find((item) => item.slug === category) || null,
    [categoriesData, category],
  );

  const rangeStart = data?.total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = data?.total ? Math.min(page * PAGE_SIZE, data.total) : 0;
  const catalogMaxPrice = facets?.priceRange.max ?? 50000;
  const activeFiltersCount =
    (category ? 1 : 0) +
    activeBrands.length +
    (activeMinPrice !== undefined || activeMaxPrice !== undefined ? 1 : 0) +
    (activeMinRating ? 1 : 0);

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
    setIsMobileFiltersOpen(false);
  };

  const onBrandToggle = (brandName: string) => {
    const next = new URLSearchParams(params);
    const current = new Set(activeBrands);

    if (current.has(brandName)) {
      current.delete(brandName);
    } else {
      current.add(brandName);
    }

    const values = Array.from(current);
    if (values.length) {
      next.set("brand", values.join(","));
    } else {
      next.delete("brand");
    }

    next.set("page", "1");
    setParams(next);
  };

  const onPriceSelect = (option?: PriceOption) => {
    const next = new URLSearchParams(params);
    if (!option) {
      next.delete("minPrice");
      next.delete("maxPrice");
    } else {
      if (option.min !== undefined) next.set("minPrice", String(option.min));
      else next.delete("minPrice");

      if (option.max !== undefined) next.set("maxPrice", String(option.max));
      else next.delete("maxPrice");
    }
    next.set("page", "1");
    setParams(next);
  };

  const onRatingSelect = (rating?: number) => {
    const next = new URLSearchParams(params);
    if (rating) next.set("minRating", String(rating));
    else next.delete("minRating");
    next.set("page", "1");
    setParams(next);
  };

  const onClearAll = () => {
    const next = new URLSearchParams(params);
    next.delete("category");
    next.delete("tab");
    next.delete("brand");
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("minRating");
    next.set("page", "1");
    setCategorySearch("");
    setBrandSearch("");
    setParams(next);
    setIsMobileFiltersOpen(false);
  };

  const onSortSelect = (value: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete("sort");
    else next.set("sort", value);
    next.set("page", "1");
    setParams(next);
  };

  const onPageChange = (nextPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(nextPage));
    setParams(next);
  };

  return (
    <div className="fk-page py-3 sm:py-4">
      <div className="mb-3 hidden text-xs text-[#878787] sm:block">
        Home <FiChevronRight className="inline" /> {activeCategory?.name || "All Products"}
        {search ? (
          <>
            <FiChevronRight className="inline" /> Search for "{search}"
          </>
        ) : null}
      </div>

      <div className="mb-3 rounded-[12px] border border-[#e7e7e7] bg-white p-3 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 rounded-[10px] border border-[#d9d9d9] px-3 py-2 text-[14px] font-medium text-[#212121]"
          >
            <FiFilter className="text-[#2874f0]" />
            Filters
            {activeFiltersCount ? (
              <span className="rounded-full bg-[#2874f0] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex gap-2">
              <button
                onClick={() => onCategorySelect("")}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-[13px] ${
                  !category
                    ? "border-[#2874f0] bg-[#f5f8ff] text-[#2874f0]"
                    : "border-[#e1e1e1] bg-white text-[#3a3a3a]"
                }`}
              >
                All
              </button>
              {quickCategoryChips.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onCategorySelect(item.slug)}
                  className={`whitespace-nowrap rounded-full border px-3 py-2 text-[13px] ${
                    category === item.slug
                      ? "border-[#2874f0] bg-[#f5f8ff] text-[#2874f0]"
                      : "border-[#e1e1e1] bg-white text-[#3a3a3a]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="fk-surface hidden overflow-hidden rounded-[12px] bg-white lg:sticky lg:top-[104px] lg:block lg:h-[calc(100vh-124px)] lg:self-start">
          <FilterPanel
            categories={categories}
            brands={brands}
            catalogMaxPrice={catalogMaxPrice}
            activeCategory={category}
            activeBrands={activeBrands}
            activeMinPrice={activeMinPrice}
            activeMaxPrice={activeMaxPrice}
            activeMinRating={activeMinRating}
            categorySearch={categorySearch}
            brandSearch={brandSearch}
            onCategorySearchChange={setCategorySearch}
            onBrandSearchChange={setBrandSearch}
            onCategorySelect={onCategorySelect}
            onBrandToggle={onBrandToggle}
            onPriceSelect={onPriceSelect}
            onRatingSelect={onRatingSelect}
            onClearAll={onClearAll}
          />
        </aside>

        <section className="fk-surface overflow-hidden rounded-[12px] bg-white">
          <div className="border-b border-[#f0f0f0] px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[13px] text-[#212121] sm:text-[14px]">
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
                      <span className="font-semibold">
                        {activeCategory?.name || "All Products"}
                      </span>
                      <span className="ml-2 text-[#878787]">({data?.total ?? 0} items)</span>
                    </>
                  )}
                </h1>

                {activeCategory ? (
                  <button
                    onClick={() => onCategorySelect("")}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f0f5ff] px-3 py-1 text-[12px] font-medium text-[#2874f0]"
                  >
                    {activeCategory.name}
                    <FiX className="text-[14px]" />
                  </button>
                ) : null}
                {activeBrands.map((item) => (
                  <button
                    key={item}
                    onClick={() => onBrandToggle(item)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#fff7e6] px-3 py-1 text-[12px] font-medium text-[#9a5a00]"
                  >
                    {item}
                    <FiX className="text-[14px]" />
                  </button>
                ))}
                {activeMinRating ? (
                  <button
                    onClick={() => onRatingSelect(undefined)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#edf8ef] px-3 py-1 text-[12px] font-medium text-[#2b7a31]"
                  >
                    {activeMinRating}+ Rating
                    <FiX className="text-[14px]" />
                  </button>
                ) : null}
                {activeMinPrice !== undefined || activeMaxPrice !== undefined ? (
                  <button
                    onClick={() => onPriceSelect(undefined)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#f6f1ff] px-3 py-1 text-[12px] font-medium text-[#5e3ea1]"
                  >
                    Price filtered
                    <FiX className="text-[14px]" />
                  </button>
                ) : null}
              </div>

              <div className="scrollbar-hide -mx-1 flex items-center gap-3 overflow-x-auto px-1 text-[13px] sm:flex-wrap sm:gap-4 sm:text-[14px]">
                <span className="inline-flex items-center gap-2 font-medium text-[#212121]">
                  <FiSliders className="text-[#2874f0]" />
                  Sort By
                </span>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value || "relevance"}
                    onClick={() => onSortSelect(option.value)}
                    className={`relative whitespace-nowrap pb-1 ${
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
          </div>

          <div className="p-3 sm:p-4">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : data?.products?.length ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {data.totalPages > 1 ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-[#f0f0f0] pt-4">
                    <button
                      onClick={() => onPageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-[8px] border border-[#d9d9d9] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: data.totalPages }, (_, idx) => idx + 1).map((value) => (
                      <button
                        key={value}
                        onClick={() => onPageChange(value)}
                        className={`min-w-8 rounded-[8px] px-3 py-1.5 text-sm ${
                          value === page
                            ? "bg-[#2a55e5] text-white"
                            : "border border-[#d9d9d9] bg-white text-[#212121]"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                    <button
                      onClick={() => onPageChange(Math.min(data.totalPages, page + 1))}
                      disabled={page === data.totalPages}
                      className="rounded-[8px] border border-[#d9d9d9] px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
                <button
                  onClick={onClearAll}
                  className="mt-2 rounded-[8px] bg-[#2a55e5] px-6 py-2 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {isMobileFiltersOpen ? (
        <div className="fixed inset-0 z-[70] bg-black/40 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 top-[72px] rounded-t-[20px] bg-white shadow-2xl sm:top-[88px]">
            <FilterPanel
              categories={categories}
              brands={brands}
              catalogMaxPrice={catalogMaxPrice}
              activeCategory={category}
              activeBrands={activeBrands}
              activeMinPrice={activeMinPrice}
              activeMaxPrice={activeMaxPrice}
              activeMinRating={activeMinRating}
              categorySearch={categorySearch}
              brandSearch={brandSearch}
              onCategorySearchChange={setCategorySearch}
              onBrandSearchChange={setBrandSearch}
              onCategorySelect={onCategorySelect}
              onBrandToggle={onBrandToggle}
              onPriceSelect={onPriceSelect}
              onRatingSelect={onRatingSelect}
              onClearAll={onClearAll}
              onClose={() => setIsMobileFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
