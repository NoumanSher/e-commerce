import React, { memo } from 'react'
import { FiEye, FiHeart } from 'react-icons/fi';
import { MdOutlineShoppingBag } from 'react-icons/md';

const  CardHover=({isHovered}:any)=> {
  return (
    <div>
       <div
              className={`absolute bottom-[10px] mb-2 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${
                isHovered
                  ? "opacity-100 visible translate-y-[-10px]"
                  : "opacity-0 invisible translate-y-5"
              }`}
            >
              <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                <MdOutlineShoppingBag />
              </div>
              <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                <FiEye />
              </div>
              <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
                <FiHeart />
              </div>
            </div>
    </div>
  )
}
export default memo(CardHover);