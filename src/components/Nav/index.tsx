"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  FiHeart,
  FiUser,
  FiHome,
  FiInfo,
  FiPhone,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CartIcon } from "@/assets/svg/common";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useGetStoreSettings } from "../Slider/query/storeSettingQuery";
import Image from "next/image";
import logo from "@/assets/img/logo.webp";
import NotificationBell from "./NotificationBell";
// import QuickAddModal from "../../themes/aquamist/components/QuickAddModal";

const NAV_LINKS = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/about-us", label: "About", icon: FiInfo },
  { path: "/contact-us", label: "Contact", icon: FiPhone },
] as const;

const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { wishlistCount } = useWishlist();
  const { setIsAuthModalOpen } = useAppUIContext();
  const { authToken } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  // Use a ref to avoid stale closure in the scroll handler
  const isNavbarVisibleRef = useRef(true);

  const { data: storeSettings } = useGetStoreSettings();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    isNavbarVisibleRef.current = isNavbarVisible;
  }, [isNavbarVisible]);

  const handleScroll = useCallback(() => {
    if (isHomePage || pathname.includes("/all-products")) return;

    const currentScrollY = window.scrollY;
    const navbarHeight = navbarRef.current?.offsetHeight ?? 64;
    const isProductDetailPage = pathname.includes("/product-detail");

    if (currentScrollY > lastScrollY.current && currentScrollY > navbarHeight) {
      // Scrolling down — hide navbar
      if (isNavbarVisibleRef.current) {
        setIsNavbarVisible(false);
        isNavbarVisibleRef.current = false;
      }
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up — show navbar
      if (!isNavbarVisibleRef.current) {
        // If on product detail page, only show when scrolled back to the very top
        if (!isProductDetailPage || currentScrollY <= navbarHeight) {
          setIsNavbarVisible(true);
          isNavbarVisibleRef.current = true;
        }
      }
    }

    lastScrollY.current = currentScrollY;
  }, [isHomePage, pathname]);

  useEffect(() => {
    if (isHomePage || pathname.includes("/all-products")) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, pathname, handleScroll]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMobileMenuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleProfileClick = useCallback(() => {
    closeMobileMenu();
    if (authToken) {
      router.push("/profile");
    } else {
      setIsAuthModalOpen(true);
    }
  }, [authToken, router, setIsAuthModalOpen, closeMobileMenu]);

  const handleNavigation = useCallback(
    (path: string) => {
      closeMobileMenu();
      router.push(path);
    },
    [router, closeMobileMenu],
  );

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      {/* Fixed navbar wrapper */}
      <div
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-transform duration-300 ease-in-out
          ${isHomePage || pathname.includes("/all-products") || isNavbarVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 lg:px-16 flex items-center justify-between h-20 relative">
            {/* Mobile: Hamburger */}
            <button
              className="lg:hidden text-xl text-gray-700 focus:outline-none hover:text-black transition-colors"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              prefetch={true}
              className="absolute left-1/2 -translate-x-1/2 pt-2 lg:pt-0 lg:static lg:transform-none flex items-center lg:mx-0 lg:mr-10 h-full"
              onClick={closeMobileMenu}
            >
              <div className="relative h-full flex items-center">
                <Image
                  src={storeSettings?.logo ?? logo.src}
                  className="object-contain object-center max-h-[56px] w-auto max-w-[200px]"
                  width={200}
                  height={56}
                  alt="Store logo"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 h-full">
              {NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`
                    text-sm tracking-wide font-medium h-full flex items-center
                    border-b-2 transition-colors duration-200
                    ${
                      isActive(path)
                        ? "border-black text-black"
                        : "border-transparent text-gray-700 hover:text-black hover:border-gray-300"
                    }
                  `}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center space-x-5 ml-auto h-full">
              {/* Notifications */}
              <NotificationBell />

              {/* Profile */}
              <Link
                href={authToken ? "/profile" : "/#"}
                onClick={(e) => {
                  if (!authToken) {
                    e.preventDefault();
                    setIsAuthModalOpen(true);
                  }
                }}
                aria-label="Profile"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <FiUser size={20} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wish-list"
                aria-label="Wishlist"
                className="relative flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <FiHeart
                  size={20}
                  fill={isClient && wishlistCount > 0 ? "currentColor" : "none"}
                  className={
                    isClient && wishlistCount > 0 ? "text-red-500" : ""
                  }
                />
                {isClient && wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <CartIcon className="text-lg" />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: Icons (always visible) */}
            <div className="lg:hidden flex items-center space-x-4">
              <NotificationBell />
              <Link
                className="relative text-gray-700 hover:text-black transition-colors"
                href="/cart"
                aria-label="Cart"
              >
                <CartIcon className="text-lg" />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-in Menu */}
      <div
        className={`
          lg:hidden fixed inset-0 z-40 mt-20
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          className={`
            absolute top-0 left-0 h-full w-72 bg-white shadow-xl
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* User action */}
            <div className="p-5 border-b border-gray-100">
              <Link
                href={authToken ? "/profile" : "/#"}
                onClick={(e) => {
                  if (!authToken) {
                    e.preventDefault();
                    setIsAuthModalOpen(true);
                  } else {
                    closeMobileMenu();
                  }
                }}
                className="flex items-center gap-3 w-full text-left group"
              >
                <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 group-hover:text-black transition-colors">
                  <FiUser size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {authToken ? "My Profile" : "Sign In"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {authToken ? "View your account" : "Login or register"}
                  </p>
                </div>
              </Link>
            </div>

            {/* Nav Links */}
            <nav className="p-4 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">
                Navigation
              </p>
              <ul className="space-y-1">
                {NAV_LINKS.map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <Link
                      href={path}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg text-sm font-medium
                        transition-colors duration-150
                        ${
                          isActive(path)
                            ? "bg-gray-100 text-black"
                            : "text-gray-700 hover:bg-gray-50 hover:text-black"
                        }
                      `}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  </li>
                ))}

                {/* Wishlist */}
                <li>
                  <Link
                    href="/wish-list"
                    onClick={closeMobileMenu}
                    className={`
                      flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${
                        pathname === "/wish-list"
                          ? "bg-gray-100 text-black"
                          : "text-gray-700 hover:bg-gray-50 hover:text-black"
                      }
                    `}
                  >
                    <FiHeart size={18} />
                    Wishlist
                    {isClient && wishlistCount > 0 && (
                      <span className="ml-auto w-5 h-5 bg-black text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20" />
      {/* <QuickAddModal /> */}
    </>
  );
};

export default Navbar;
