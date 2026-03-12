import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api/productsApi';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/common/Skeleton';
import { FaFilter } from 'react-icons/fa';

interface SortOption {
  label: string;
  value: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useGetProductsQuery({ search, category, sort, page, limit: 12 });
  const { data: categories } = useGetCategoriesQuery();

  useEffect(() => { setPage(1); }, [search, category, sort]);

  const handleCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded shadow-sm p-4 sticky top-20">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2">
              <FaFilter className="text-flipblue" /> Filters
            </h3>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">CATEGORY</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategory('')}
                    className={`text-sm w-full text-left py-1 px-2 rounded ${!category ? 'text-flipblue font-semibold' : 'text-gray-600 hover:text-flipblue'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategory(cat.slug)}
                      className={`text-sm w-full text-left py-1 px-2 rounded flex items-center gap-2 ${category === cat.slug ? 'text-flipblue font-semibold' : 'text-gray-600 hover:text-flipblue'}`}
                    >
                      <input type="checkbox" readOnly checked={category === cat.slug} className="accent-flipblue" />
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="bg-white rounded shadow-sm p-3 mb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-semibold text-gray-800">
                {search
                  ? `Results for "${search}"`
                  : category
                  ? categories?.find((c) => c.slug === category)?.name
                  : 'All Products'}
              </span>
              {data && <span className="text-sm text-gray-500 ml-2">({data.total} items)</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-semibold">Sort By:</span>
              <div className="flex gap-2 overflow-x-auto">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded whitespace-nowrap font-medium transition-colors ${sort === opt.value ? 'text-flipblue border-b-2 border-flipblue' : 'text-gray-600 hover:text-flipblue'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array(12).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : data?.products?.length === 0 ? (
            <div className="bg-white rounded shadow-sm p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try a different search or category</p>
              <Link to="/products" className="mt-4 inline-block text-flipblue font-semibold hover:underline">View all products</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {data?.products?.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white rounded shadow text-sm font-medium disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={`px-3 py-2 rounded text-sm font-medium ${p === page ? 'bg-flipblue text-white' : 'bg-white shadow hover:bg-gray-50'}`}>{p}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="px-4 py-2 bg-white rounded shadow text-sm font-medium disabled:opacity-40 hover:bg-gray-50">Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
