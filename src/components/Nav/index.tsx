"use client";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
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
import { getStoreSetting } from "@/components/Slider/api/storeSettingApi";
import Image from "next/image";
const Navbar = () => {
  const { wishlistCount } = useWishlist();
  const { isLogIn } = useStore();

  const [isMobile, setIsMobile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searching, setSearching] = useState(false); // To track if search results are being fetched
  const [isClient, setIsClient] = useState(false); // To ensure client-only rendering
  const { cartCount } = useCart();
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: getStoreSetting,
  });
  useEffect(() => {
    setIsClient(true); // Set to true only after component mounts on client
  }, []);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchValue(e.target.value);
    setSearching(!!e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearching(false);
  };

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMobile);

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMobile]);

  const handleClickProfile = () => {
    // const isLogIn = localStorage.getItem("token");
    window.innerWidth < 768 ? setIsMobile(!isMobile): ''
    isLogIn ? router.push("/pages/profile") : router.push("/pages/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white container mx-auto lg:px-16">
      <div className="flex items-center gap-x-20 lg:order-1 order-2">
        <Link href={"/"} className="flex items-center text-2xl font-bold">
          <Image src={data?.logo ?? ""} className="-my-6 object-contain" width={100} height={100} alt="logo" />
        </Link>

        <ul
          className={`flex gap-x-10 lg:order-2 ${
            isMobile
              ? "flex-col absolute top-16 left-0 border-2 w-full bg-white border-t border-gray-200 h-screen z-50 px-4 pt-4"
              : "hidden lg:flex"
          }`}
        >
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search Products"
              value={searchValue}
              onChange={handleChange}
              className="lg:hidden border-gray-400 w-full border outline-none h-9 rounded-md px-2 pr-8"
            />
            <span className="absolute top-[10px] right-2">
              {searching ? (
                <FaTimes onClick={handleClear} className="cursor-pointer" />
              ) : (
                <SearchIcon className="lg:hidden" />
              )}
            </span>
          </div>
          <li
            onClick={handleClickProfile}
            className="text-base  tracking-wide lg:hidden md:block text-black font-medium hover:text-gray-600 mt-4"
          >
            Profile
          </li>
          <li
            onClick={() => {
              setIsMobile(!isMobile);
              router.push("/pages/wish-list");
            }}
            className="text-base  tracking-wide lg:hidden md:block text-black font-medium hover:text-gray-600"
          >
            Wishlist
          </li>
          <li onClick={() => { window.innerWidth < 768 ? setIsMobile(!isMobile): ''}}>
            <Link
              href="/"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/pages/about-us"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              href="/pages/contact-us"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </div>

      <div className="lg:flex items-center space-x-6 hidden lg:order-3">
        <SearchIcon className="text-lg cursor-pointer hover:text-gray-600 hidden lg:flex" />
        <ProfileAvatarIcon
          onClick={handleClickProfile}
          className="text-lg cursor-pointer hover:text-gray-600"
        />

        <div className="relative">
          <HeartIcon
            onClick={() => router.push("/pages/wish-list")}
            className="cursor-pointer"
          />
          {isClient && wishlistCount > 0 && (
            <span className="absolute w-4 h-4 p-[4px] top-[15px] 2xl:-right-[5px] lg:-right-[5px] bg-yellow-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </div>

        <div
          className="relative cursor-pointer"
          onClick={() => router.push("/pages/cart")}
        >
          <CartIcon className="text-lg hover:text-gray-600" />

          {isClient && cartCount > 0 && (
            <span className="absolute top-[14px] -right-[6px] p-[4px] h-4 w-4 bg-yellow-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>

      <div
        className="relative cursor-pointer order-3 lg:hidden"
        onClick={() => router.push("/pages/cart")}
      >
        <CartIcon className="text-lg hover:text-gray-600 hover:scale-150" />
        {isClient && cartCount > 0 && (
          <span className="absolute top-[14px] -right-[6px] w-4 h-4 p-[4px] bg-yellow-600 text-black text-xs font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </div>

      <button
        className="lg:hidden text-xl focus:outline-none order-1"
        onClick={() => setIsMobile(!isMobile)}
      >
        <FaBars />
      </button>
    </nav>
  );
};

export default Navbar;
