'use client'
import React, { useState } from 'react';
import { FaSearch, FaUserAlt, FaHeart, FaShoppingBag, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center text-2xl font-bold">
        <span>UQMO</span>
        <span className="ml-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
      </div>

      <ul className={`flex space-x-6 ${isMobile ? "flex-col absolute top-16 left-0 w-full bg-white border-t border-gray-200" : "hidden md:flex"}`}>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">HOME</a></li>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">SHOP</a></li>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">BLOG</a></li>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">PAGES</a></li>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">ABOUT</a></li>
        <li><a href="#" className="text-lg text-black hover:text-gray-600">CONTACT</a></li>
      </ul>

      <div className="flex items-center space-x-6">
        <FaSearch className="text-lg cursor-pointer hover:text-gray-600" />
        <FaUserAlt className="text-lg cursor-pointer hover:text-gray-600" />
        <FaHeart className="text-lg cursor-pointer hover:text-gray-600" />
        <div className="relative cursor-pointer">
          <FaShoppingBag className="text-lg hover:text-gray-600" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-yellow-600 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
        </div>
      </div>

      <button className="md:hidden text-xl focus:outline-none" onClick={() => setIsMobile(!isMobile)}>
        <FaBars />
      </button>
    </nav>
  );
};

export default Navbar;
