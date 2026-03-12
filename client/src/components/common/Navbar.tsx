import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiMapPin,
  FiMoreVertical,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { MdFlightTakeoff } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { useGetCartQuery } from "../../store/api/cartApi";

interface NavTab {
  key: string;
  label: string;
  category?: string;
  path?: string;
}

const NAV_TABS: NavTab[] = [
  { key: "for-you", label: "For You", path: "/" },
  { key: "fashion", label: "Fashion", category: "fashion" },
  { key: "mobiles", label: "Mobiles", category: "electronics" },
  { key: "beauty", label: "Beauty", category: "beauty" },
  { key: "electronics", label: "Electronics", category: "electronics" },
  { key: "home", label: "Home", category: "home-furniture" },
  { key: "appliances", label: "Appliances", category: "electronics" },
  { key: "toys", label: "Toys, babies", category: "home-furniture" },
  { key: "food", label: "Food & Health", category: "beauty" },
  { key: "auto", label: "Auto Accessories", category: "sports" },
  { key: "two-wheelers", label: "2 Wheelers", category: "sports" },
  { key: "sports", label: "Sports & Fitness", category: "sports" },
  { key: "books", label: "Books & More", category: "books" },
  { key: "furniture", label: "Furniture", category: "home-furniture" },
];

const POPULAR_SEARCHES = [
  "sneakers",
  "iphone",
  "samsung",
  "laptop",
  "wireless earbuds",
  "smart watch",
  "face wash",
];

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: cartItems } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const cartCount = cartItems?.length ?? 0;

  const activeTab = useMemo(() => {
    if (location.pathname === "/") return "for-you";
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "";
  }, [location.pathname, location.search]);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return POPULAR_SEARCHES;
    return POPULAR_SEARCHES.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const goToSearch = (value: string) => {
    const query = value.trim();
    if (!query) return;
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setShowSearchSuggestions(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToSearch(search);
  };

  const handleTabClick = (tab: NavTab) => {
    if (tab.path) {
      navigate(tab.path);
      return;
    }
    if (!tab.category) return;
    navigate(`/products?category=${tab.category}&tab=${tab.key}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe1e5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="fk-page">
        <div className="flex items-center justify-between gap-2 p-2.5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex h-11 min-w-[126px] items-center gap-2 rounded-xl bg-[#ffe500] px-4"
            >
              <img src="/flipkart-logo.webp" height={25} width={25} alt="flipkart-logo" />
              <div className="leading-tight">
                <p className="text-[15px] font-bold italic text-[#1f1f1f]">Flipkart</p>
              </div>
            </Link>
            <button className="hidden h-11 min-w-[126px] flex items-center gap-2 rounded-xl bg-gray-200 px-4 md:flex">
              <img src="/aeroplane-logo-navbar.webp" height={30} width={30} alt="" />
              <span className="text-[15px] font-semibold text-[#1f1f1f]">Travel</span>
            </button>
          </div>

          <button className="hidden items-center gap-1 text-[14px] font-medium md:flex">
            <FiMapPin className="text-[#111112]" />
            <span className="text-[#111112]">Location not set</span>
            <span className="font-semibold text-[#2a55e5]">Select delivery location</span>
            <FiChevronDown className="-rotate-90 text-sm text-[#2a55e5]" />
          </button>
        </div>

        <div className="flex items-center gap-3 pb-2.5">
          <div className="relative flex-1" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="flex h-11 items-center rounded-xl border-2 border-[#2a55e5] bg-white px-3">
                <FiSearch className="mr-2 text-xl text-[#717478]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setShowSearchSuggestions(true)}
                  className="h-full w-full bg-transparent text-sm text-[#212121] outline-none placeholder:text-[#717478]"
                  placeholder="Search for Products, Brands and More"
                />
              </div>
            </form>

            {showSearchSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-[#e6e6e6] bg-white py-1 shadow-lg">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => goToSearch(item)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#212121] hover:bg-[#f5f5f5]"
                  >
                    <FiSearch className="text-[#878787]" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[#f3f9ff]"
              >
                <FiUser className="text-xl" />
                <span className="hidden text-sm font-medium md:block">
                  {isAuthenticated ? user?.name?.split(" ")[0] : "Login"}
                </span>
                <FiChevronDown className="hidden text-sm md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-sm border border-[#e0e0e0] bg-white shadow-lg">
                  {!isAuthenticated && (
                    <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
                      <span className="text-sm">New customer?</span>
                      <Link
                        to="/signup"
                        onClick={() => setShowUserMenu(false)}
                        className="text-sm font-semibold text-[#2a55e5]"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="block border-b border-[#f0f0f0] px-4 py-3 text-sm hover:bg-[#fafafa]"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="block border-b border-[#f0f0f0] px-4 py-3 text-sm hover:bg-[#fafafa]"
                  >
                    Wishlist
                  </Link>
                  {!isAuthenticated ? (
                    <Link
                      to="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-sm hover:bg-[#fafafa]"
                    >
                      Login
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setShowUserMenu(false);
                        navigate("/");
                      }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#fafafa]"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>

            <button className="hidden items-center gap-1 text-sm font-medium md:flex">
              <span>More</span>
              <FiChevronDown />
            </button>

            <button className="flex items-center gap-1 text-sm font-medium md:hidden">
              <FiMoreVertical className="text-xl" />
            </button>

            <Link to="/cart" className="flex items-center gap-2">
              <div className="relative">
                <FiShoppingCart className="text-[23px]" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-2 min-w-[16px] rounded-full bg-[#e42047] px-1 text-center text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden text-sm md:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#efefef] bg-white">
        <nav className="fk-page">
          <div className="scrollbar-hide flex h-10 items-center gap-8 overflow-x-auto whitespace-nowrap text-[14px]">
            {NAV_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className="relative h-full pb-0.5 font-medium text-[#212121]"
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded bg-[#2a55e5]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
