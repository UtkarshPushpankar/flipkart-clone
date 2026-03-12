import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { FaShoppingCart, FaSearch, FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import { useGetCartQuery } from '../../store/api/cartApi';

interface NavCategory {
  name: string;
  slug: string;
  icon: string;
}

const CATEGORIES: NavCategory[] = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'TVs & Appliances', slug: 'electronics', icon: '📺' },
  { name: 'Men', slug: 'fashion', icon: '👔' },
  { name: 'Women', slug: 'fashion', icon: '👗' },
  { name: 'Home & Furniture', slug: 'home-furniture', icon: '🛋️' },
  { name: 'Beauty', slug: 'beauty', icon: '💄' },
  { name: 'Sports', slug: 'sports', icon: '⚽' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: 'Appliances', slug: 'electronics', icon: '🔌' },
  { name: 'Toys', slug: 'electronics', icon: '🧸' },
];

const POPULAR_SEARCHES = ['iPhone 15', 'Samsung Galaxy', 'Sneakers', 'Laptop', 'Air Fryer', 'Headphones', 'Tablet'];

export default function Navbar() {
  const [search, setSearch] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('Bengaluru');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setShowSearchSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSearchSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div style={{ backgroundColor: '#2874f0' }} className="py-2.5 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          <Link to="/" className="flex-shrink-0 min-w-[140px]">
            <div className="text-white">
              <div className="font-bold text-[22px] italic leading-none tracking-tight">Flipkart</div>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[11px] text-[#ffe500]">Explore</span>
                <span className="text-[11px] text-[#ffe500] font-semibold italic">Plus</span>
                <span className="text-yellow-300 text-[9px] ml-0.5">+</span>
              </div>
            </div>
          </Link>

          <div className="flex-1 max-w-[560px] relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="flex bg-white rounded-sm overflow-hidden h-10 shadow-sm">
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="flex-1 px-4 text-sm outline-none text-gray-800 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-5 flex items-center justify-center bg-white border-l border-gray-200 hover:bg-gray-50 transition"
                >
                  <FaSearch className="text-[#2874f0] text-base" />
                </button>
              </div>
            </form>

            {showSearchSuggestions && search.length === 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl mt-0.5 rounded-sm z-50 border border-gray-100">
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-3 py-2 font-semibold">Popular Searches</div>
                  {POPULAR_SEARCHES.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2 transition"
                    >
                      <FaSearch className="text-gray-400 text-xs" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-8 flex-shrink-0 ml-auto">
            <button className="flex items-center gap-1.5 text-white font-medium text-sm hover:text-gray-100 transition">
              <FaMapMarkerAlt className="text-sm" />
              <span>{location}</span>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-white font-medium text-sm hover:bg-blue-600 px-3 py-1.5 rounded-sm transition-colors"
              >
                <span>{isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}</span>
                <FaChevronDown className="text-xs" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-[240px] bg-white shadow-2xl rounded-sm z-50 overflow-hidden">
                  {!isAuthenticated ? (
                    <div className="px-4 py-3 border-b bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">New customer?</span>
                        <Link
                          to="/signup"
                          className="text-sm font-semibold text-[#2874f0] hover:underline"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-b bg-white">
                      <p className="font-semibold text-base text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>
                  )}

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Wishlist</span>
                  </Link>

                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => { dispatch(logout()); setShowUserMenu(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 text-gray-800 transition"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <Link to="/products" className="text-white font-medium text-sm hidden lg:block whitespace-nowrap hover:text-gray-100 transition">
              Become a Seller
            </Link>

            <button className="text-white font-medium text-sm hidden lg:flex items-center gap-1.5 hover:bg-blue-600 px-2 py-1 rounded-sm transition-colors">
              <span>More</span>
              <FaChevronDown className="text-xs mt-0.5" />
            </button>

            <Link to="/cart" className="flex items-center gap-2 text-white font-medium text-sm hover:bg-blue-600 px-2 py-1 rounded-sm transition-colors">
              <div className="relative">
                <FaShoppingCart className="text-lg" />
                {cartItems && cartItems.length > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1"
                    style={{ backgroundColor: '#ff6161' }}
                  >
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-1.5 py-1 min-w-fit group hover:no-underline"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#2874f0] whitespace-nowrap transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
