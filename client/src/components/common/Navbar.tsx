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
  icon: React.ReactNode;
  category?: string;
  path?: string;
}

/* ── Flipkart-style SVG icons (32×32, stroke #333, yellow #ffe51f fill) ── */
const ForYouSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M9.93061 6.51562H22.0706C24.0006 6.51562 25.6206 7.98562 25.8306 9.92562L27.5106 25.2356C27.7606 27.5056 26.0006 29.4856 23.7506 29.4856H8.25061C5.99061 29.4856 4.24061 27.5056 4.49061 25.2356L6.17061 9.92562C6.38061 7.98562 8.00061 6.51562 9.93061 6.51562Z" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"/><path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" fill="#ffe51f"/><path d="M22.0507 11.7061C22.0507 15.0861 19.3407 17.8261 16.0107 17.8261C12.6807 17.8261 9.9707 15.0861 9.9707 11.7061" stroke="#333333" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round"/></svg>);
const FashionSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M12 4H20L24 10L20 12V28H12V12L8 10L12 4Z" fill="#ffe51f"/><path d="M12 4H20L24 10L20 12V28H12V12L8 10L12 4Z" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/><path d="M12 4C12 4 13 7 16 7C19 7 20 4 20 4" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const MobilesSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="8" y="2" width="16" height="28" rx="3" fill="#ffe51f"/><rect x="8" y="2" width="16" height="28" rx="3" stroke="#333333" strokeWidth="1.4"/><rect x="11" y="5" width="10" height="18" rx="1" fill="white"/><rect x="11" y="5" width="10" height="18" rx="1" stroke="#333333" strokeWidth="1.2"/><circle cx="16" cy="27" r="1.2" fill="#333333"/></svg>);
const BeautySVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M13 4H19V10H13V4Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round"/><path d="M11 10H21C22.1 10 23 10.9 23 12V27C23 28.1 22.1 29 21 29H11C9.9 29 9 28.1 9 27V12C9 10.9 9.9 10 11 10Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><path d="M13 4C13 4 13 2 16 2C19 2 19 4 19 4" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/><path d="M12 17H20M12 21H18" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const ElectronicsSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="5" width="26" height="18" rx="2" fill="#ffe51f"/><rect x="3" y="5" width="26" height="18" rx="2" stroke="#333333" strokeWidth="1.4"/><rect x="6" y="8" width="20" height="12" rx="1" fill="white"/><path d="M11 29H21M16 23V29" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const HomeSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M4 14L16 4L28 14V28H20V20H12V28H4V14Z" fill="#ffe51f"/><path d="M4 14L16 4L28 14V28H20V20H12V28H4V14Z" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>);
const AppliancesSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="5" y="4" width="22" height="25" rx="2" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><circle cx="16" cy="18" r="7" fill="white" stroke="#333333" strokeWidth="1.4"/><circle cx="16" cy="18" r="3.5" stroke="#333333" strokeWidth="1.2"/><rect x="8" y="7" width="14" height="5" rx="1" fill="white" stroke="#333333" strokeWidth="1.2"/></svg>);
const ToysSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="10" cy="22" r="6" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><circle cx="22" cy="22" r="5" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><path d="M10 22L13 10H19L22 22" stroke="#333333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 10C13 10 13 7 16 7C19 7 19 10 19 10" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const FoodSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M7 3V29" stroke="#333333" strokeWidth="1.6" strokeLinecap="round"/><path d="M7 3C7 3 4 8 4 13H10C10 8 7 3 7 3Z" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round"/><path d="M23 3V12C23 14.2 21.2 16 19 16V29" stroke="#333333" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 3V12M23 3V12" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const AutoSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M5 20H27L25 12H7L5 20Z" fill="#ffe51f"/><path d="M5 20H27L25 12H7L5 20Z" stroke="#333333" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 12L9 6H23L25 12" stroke="#333333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="24" r="3.5" fill="white" stroke="#333333" strokeWidth="1.4"/><circle cx="23" cy="24" r="3.5" fill="white" stroke="#333333" strokeWidth="1.4"/><path d="M3 20H29" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const TwoWheelersSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="7" cy="22" r="5.5" fill="white" stroke="#333333" strokeWidth="1.4"/><circle cx="25" cy="22" r="5.5" fill="white" stroke="#333333" strokeWidth="1.4"/><circle cx="7" cy="22" r="2" fill="#ffe51f"/><circle cx="25" cy="22" r="2" fill="#ffe51f"/><path d="M7 22L13 8H19" stroke="#333333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 8L25 22" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/><path d="M15 8L13 14H20" stroke="#333333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 8H23C24 8 25 9 25 10V12" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const SportsSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><path d="M5 11C9 9 23 9 27 11" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 18C7.5 20 24.5 20 28.5 18" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/><path d="M16 3C14 9 14 23 16 29" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/><path d="M16 3C18 9 18 23 16 29" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const BooksSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="4" width="16" height="24" rx="2" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><rect x="7" y="4" width="3" height="24" fill="#e6c700" stroke="#333333" strokeWidth="0.8"/><rect x="20" y="7" width="9" height="21" rx="2" fill="#ffe51f" stroke="#333333" strokeWidth="1.4" opacity="0.8"/><path d="M10 10H17M10 14H17M10 18H15" stroke="#333333" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const FurnitureSVG = () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="5" y="16" width="22" height="9" rx="2" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/><path d="M5 18C5 16 7 14 9 14H23C25 14 27 16 27 18" stroke="#333333" strokeWidth="1.4" strokeLinecap="round"/><path d="M9 25V29M23 25V29" stroke="#333333" strokeWidth="1.6" strokeLinecap="round"/><rect x="8" y="9" width="16" height="6" rx="2" fill="#ffe51f" stroke="#333333" strokeWidth="1.4"/></svg>);

const NAV_TABS: NavTab[] = [
  { key: "for-you",      label: "For You",         icon: <ForYouSVG />,      path: "/" },
  { key: "fashion",      label: "Fashion",          icon: <FashionSVG />,     category: "fashion" },
  { key: "mobiles",      label: "Mobiles",          icon: <MobilesSVG />,     category: "electronics" },
  { key: "beauty",       label: "Beauty",           icon: <BeautySVG />,      category: "beauty" },
  { key: "electronics",  label: "Electronics",      icon: <ElectronicsSVG />, category: "electronics" },
  { key: "home",         label: "Home",             icon: <HomeSVG />,        category: "home-furniture" },
  { key: "appliances",   label: "Appliances",       icon: <AppliancesSVG />,  category: "electronics" },
  { key: "toys",         label: "Toys, ba...",      icon: <ToysSVG />,        category: "home-furniture" },
  { key: "food",         label: "Food & H...",      icon: <FoodSVG />,        category: "beauty" },
  { key: "auto",         label: "Auto Acc...",      icon: <AutoSVG />,        category: "sports" },
  { key: "two-wheelers", label: "2 Wheelers",       icon: <TwoWheelersSVG />, category: "sports" },
  { key: "sports",       label: "Sports & ...",     icon: <SportsSVG />,      category: "sports" },
  { key: "books",        label: "Books & ...",      icon: <BooksSVG />,       category: "books" },
  { key: "furniture",    label: "Furniture",        icon: <FurnitureSVG />,   category: "home-furniture" },
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

/* ── Bank offer countdown ── */
function BankOfferTimer() {
  const [time, setTime] = useState({ h: 2, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-1.5 border-t border-[#f0f0f0] bg-[#f5f7ff] py-1.5 text-[13px] text-[#555]">
      <span className="font-medium text-[#212121]">Bank offer ends in</span>
      <span className="flex items-center gap-1">
        <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">{p(time.h)}</span>
        <span className="text-[11px] font-semibold">Hrs</span>
        <span className="font-bold text-[#333]">:</span>
        <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">{p(time.m)}</span>
        <span className="text-[11px] font-semibold">Min</span>
        <span className="font-bold text-[#333]">:</span>
        <span className="min-w-[26px] rounded bg-[#2874f0] px-1.5 py-0.5 text-center text-[12px] font-bold text-white">{p(time.s)}</span>
        <span className="text-[11px] font-semibold">Sec</span>
      </span>
    </div>
  );
}

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <div className="scrollbar-hide flex overflow-x-auto">
            {NAV_TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className="relative flex flex-shrink-0 flex-col items-center gap-0.5 px-3 py-1.5"
                  style={{ minWidth: "72px" }}
                >
                  {/* SVG icon — collapses smoothly on scroll */}
                  <span
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: scrolled ? "0px" : "36px",
                      opacity: scrolled ? 0 : 1,
                      marginBottom: scrolled ? "0px" : undefined,
                    }}
                  >
                    {tab.icon}
                  </span>
                  <span className={`whitespace-nowrap font-medium transition-all duration-300 ${scrolled ? "text-[13px]" : "text-[11px]"} ${isActive ? "text-[#2874f0]" : "text-[#212121]"}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#2874f0]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bank offer timer — collapses smoothly on scroll */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: scrolled ? "0px" : "60px", opacity: scrolled ? 0 : 1 }}
      >
        <BankOfferTimer />
      </div>
    </header>
  );
}
