"use client";
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserAlt,
  FaHeart,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searching, setSearching] = useState(false); // To track if search results are being fetched

  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      setSearching(true); // User is typing, show cross icon
    } else {
      setSearching(false); // Input is empty, show search icon
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setSearching(false); // Clear search and reset to show search icon
  };
  useEffect(() => {
    if (isMobile) {
      // Add the class to disable scrolling
      document.body.classList.add("no-scroll");
    } else {
      // Remove the class to enable scrolling
      document.body.classList.remove("no-scroll");
    }

    // Cleanup when component unmounts or isMobile changes
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMobile]);
  return (
    <nav className="flex border-2  items-center justify-between p-4 border-b border-gray-200 bg-white container mx-auto lg:px-16">
      <div className="flex items-center gap-x-20 lg:order-1 order-2">
        <div className="flex items-center text-2xl font-bold ">
          <span>UQMO</span>
          <span className="ml-1 w-4 h-4 bg-red-600 rounded-full"></span>
        </div>

        <ul
          className={`flex gap-x-10 lg:order-2 ${
            isMobile
              ? "flex-col absolute top-16 left-0 border-2  w-full bg-white border-t border-gray-200 h-screen z-50 px-4 pt-4"
              : "hidden lg:flex"
          }`}
        >
          <div className="relative">
            <input
              type="text"
              name="search"
              placeholder="Search Products"
              id="search"
              value={searchValue}
              onChange={handleChange}
              className="lg:hidden border-gray-400 w-full border outline-none h-9 rounded-md px-2 pr-8"
            />
            <span className="absolute top-[10px] right-2">
              {searching ? (
                <FaTimes onClick={handleClear} className="cursor-pointer" />
              ) : (
                <FaSearch className="lg:hidden" />
              )}
            </span>
          </div>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              HOME
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              SHOP
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              BLOG
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              PAGES
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              ABOUT
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm tracking-wide text-black font-medium hover:text-gray-600"
            >
              CONTACT
            </a>
          </li>
        </ul>
      </div>

      <div className="lg:flex  items-center space-x-6 hidden lg:order-3 ">
        <FaSearch className="text-lg cursor-pointer hover:text-gray-600 hidden lg:flex" />
        <FaUserAlt className="text-lg cursor-pointer hover:text-gray-600" />
        <FaHeart className="text-lg cursor-pointer hover:text-gray-600" />
        <div className="relative cursor-pointer">
          <FaShoppingBag className="text-lg hover:text-gray-600" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </div>
      </div>

      <div className="relative  cursor-pointer order-3  lg:hidden">
        <FaShoppingBag className="text-lg hover:text-gray-600" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          3
        </span>
      </div>

      <button
        className="lg:hidden text-xl focus:outline-none  order-1"
        onClick={() => setIsMobile(!isMobile)}
      >
        <FaBars />
      </button>
    </nav>
  );
};

export default Navbar;
