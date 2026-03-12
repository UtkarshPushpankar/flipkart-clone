import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { FaShoppingCart, FaSearch, FaChevronDown, FaHeart, FaBolt } from 'react-icons/fa';
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
  { name: 'Sports', slug: 'sports', icon: '🏏' },
  { name: 'Books', slug: 'books', icon: '📚' },
  { name: 'Flights', slug: 'electronics', icon: '✈️' },
  { name: 'Grocery', slug: 'beauty', icon: '🛒' },
];

export default function Navbar() {
  const [search, setSearch] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main Blue Bar */}
      <div style={{ backgroundColor: '#2874f0' }} className="py-2.5 px-4">
        <div className="max-w-[1300px] mx-auto flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 min-w-[100px]">
            <div className="text-white">
              <div className="font-bold text-xl italic leading-none">Flipkart</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[11px] text-[#ffe500]">Explore</span>
                <span className="text-[11px] text-[#ffe500] font-semibold italic">Plus</span>
                <span className="text-yellow-300 text-[10px]">✦</span>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[600px]">
            <div className="flex bg-white rounded-sm overflow-hidden shadow-sm h-9">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 text-sm outline-none text-gray-700 placeholder-gray-400"
                style={{ border: 'none' }}
              />
              <button
                type="submit"
                className="px-4 flex items-center justify-center"
                style={{ backgroundColor: '#2874f0' }}
              >
                <FaSearch className="text-white text-sm" />
              </button>
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">

            {/* Login Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 font-semibold text-sm px-4 py-1.5 rounded-sm min-w-[80px] justify-center"
                style={{ backgroundColor: 'white', color: '#2874f0' }}
              >
                <span>{isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}</span>
                <FaChevronDown className="text-[10px] mt-0.5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-[230px] bg-white shadow-2xl rounded-sm z-50 border border-gray-100">
                  {!isAuthenticated ? (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-700">New customer?</span>
                      <Link
                        to="/signup"
                        className="text-sm font-semibold"
                        style={{ color: '#2874f0' }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                    </div>
                  )}

                  {[
                    { to: '/orders', label: '📦 My Orders' },
                    { to: '/wishlist', label: '❤️ Wishlist' },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      🔑 Login
                    </Link>
                  ) : (
                    <button
                      onClick={() => { dispatch(logout()); setShowUserMenu(false); navigate('/'); }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                      style={{ color: '#fb641b' }}
                    >
                      🚪 Logout
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Become Seller */}
            <Link to="/products" className="text-white font-semibold text-sm hidden lg:block whitespace-nowrap">
              Become a Seller
            </Link>

            {/* More */}
            <div className="text-white font-semibold text-sm hidden lg:flex items-center gap-1 cursor-pointer">
              <span>More</span>
              <FaChevronDown className="text-[10px]" />
            </div>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-1.5 text-white font-semibold text-sm hover:text-gray-200">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cartItems && cartItems.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#fb641b' }}
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

      {/* Category Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-1 py-2 min-w-fit group border-b-2 border-transparent hover:border-[#2874f0] transition-colors"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[12px] font-semibold text-gray-700 group-hover:text-[#2874f0] whitespace-nowrap">
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
