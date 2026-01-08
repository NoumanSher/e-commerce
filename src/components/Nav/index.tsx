"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  SearchIcon,
  HeartIcon,
  CartIcon,
  ProfileAvatarIcon,
} from "@/assets/svg/common";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useStore } from "@/Context/storeContext";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import Image from "next/image";
import logo from "@/assets/img/logo.webp";
import { FiHeart } from "react-icons/fi";
import { set } from "react-hook-form";

const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { wishlistCount } = useWishlist();
  const { authToken, isAuthModalOpen, setIsAuthModalOpen } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const { cartCount } = useCart();
  const router = useRouter();
  const lastScrollY = useRef(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const { data: storeSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getStoreSetting(),
  });

  // Scroll handler for hide/show navbar
  const handleScroll = useCallback(() => {
    if (isHomePage) return;

    const currentScrollY = window.scrollY;
    const navbarHeight = navbarRef.current?.offsetHeight || 0;

    if (currentScrollY > lastScrollY.current && currentScrollY > navbarHeight) {
      // Scrolling down
      if (isNavbarVisible) {
        setIsNavbarVisible(false);
      }
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      if (!isNavbarVisible) {
        setIsNavbarVisible(true);
      }
    }

    lastScrollY.current = currentScrollY;
  }, [isHomePage, isNavbarVisible]);

  useEffect(() => {
    setIsClient(true);

    if (!isHomePage) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isHomePage, handleScroll]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMobileMenuOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [isMobileMenuOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleProfileClick = useCallback(() => {
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    }
    if (authToken) {
      router.push("/profile");
    } else {
      setIsAuthModalOpen(true);
    }
  }, [authToken, router, setIsAuthModalOpen, toggleMobileMenu]);

  const handleNavigation = useCallback(
    (path: string) => {
      if (window.innerWidth < 768) {
        if (path === "/cart") {
          router.push(path);
          return;
        }
        toggleMobileMenu();
      }
      router.push(path);
    },
    [router, toggleMobileMenu]
  );

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/about-us", label: "ABOUT" },
    { path: "/contact-us", label: "CONTACT" },
  ];

  return (
    <>
      {/* Fixed position navbar that handles the hide/show animation */}
      <div
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-50 
          transition-transform duration-300 ease-in-out
          ${isHomePage ? "translate-y-0" : isNavbarVisible ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Actual navbar content */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-2 lg:px-16 flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-xl focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center mx-auto lg:mx-0 lg:mr-10 h-full"
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              <div className="relative h-full">
                <Image
                  src={storeSettings?.logo ?? logo.src}
                  className="object-contain object-center -my-6"
                  width={100}
                  height={100}
                  alt="Store logo"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm tracking-wide text-black font-medium hover:text-gray-600 h-full flex items-center"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center space-x-5 ml-auto h-full">
              {/* <SearchIcon className="text-lg cursor-pointer hover:text-gray-600" /> */}

              <ProfileAvatarIcon
                onClick={handleProfileClick}
                className="text-lg cursor-pointer hover:text-gray-600"
              />

              <div
                className="relative h-full flex items-center cursor-pointer"
                onClick={() => handleNavigation("/wish-list")}
              >
                {isClient && wishlistCount > 0 ? (
                  <FiHeart size={20} fill="red" stroke="red" />
                ) : (
                  <FiHeart size={20} />
                )}
                {isClient && wishlistCount > 0 && (
                  <span className="absolute lg:top-[24px] -right-[7px] w-4 h-4 bg-yellow-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <div
                className="relative cursor-pointer h-full flex items-center"
                onClick={() => handleNavigation("/cart")}
              >
                <CartIcon className="text-lg hover:text-gray-600" />
                {isClient && cartCount > 0 && (
                  <span className="absolute lg:top-[24px]  -right-2 w-4 h-4 bg-yellow-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Cart Icon */}
            <div
              className="lg:hidden relative cursor-pointer"
              onClick={() => handleNavigation("/cart")}
            >
              <CartIcon className="text-lg hover:text-gray-600" />
              {isClient && cartCount > 0 && (
                <span className="absolute top-[11px]  -right-2 w-4 h-4 bg-yellow-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu (outside the fixed navbar) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 mt-16 overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            {/* <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Products"
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full border border-gray-400 outline-none h-9 rounded-md px-3 pr-10"
              />
              <span className="absolute right-3 top-2.5">
                {searchValue ? (
                  <FaTimes onClick={clearSearch} className="cursor-pointer" />
                ) : (
                  <SearchIcon />
                )}
              </span>
            </div> */}

            {/* Mobile Nav Links */}
            <ul className="space-y-3">
              <li>
                <button
                  onClick={handleProfileClick}
                  className="text-base w-full text-left tracking-wide text-black font-medium hover:text-gray-600 py-1"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/wish-list")}
                  className="text-base w-full text-left tracking-wide text-black font-medium hover:text-gray-600 py-1"
                >
                  Wishlist
                </button>
              </li>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="text-base w-full text-left tracking-wide text-black font-medium hover:text-gray-600 py-1"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
