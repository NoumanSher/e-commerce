import React, { Suspense, lazy } from "react";
const Services = lazy(() => import("./components/Services"));
import Logo from "../../assets/img/Logo.png";
import Image from "next/image";
import { FaFacebookF, FaPinterest, FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { BsYoutube } from "react-icons/bs";
import masterCard  from '../../assets/img/mc_sym_debit_pos.svg'

export default function Footer() {
  return (
    <footer className="bg-[#e4e4e4]">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Services />
        </Suspense>
      </div>
      <div className="px-[15px] md:px-8 lg:px-12 pt-[50px] md:pt-[65px] md:pb-[45px] pb-[30px]">
        <div className=" mb-[24px]">
          <Image src={Logo} alt="Logo" className="pb-[48px]" />
          <p className="text-[#222222] text-[14px] font-normal leading-[1.7173em] mb-5">
            174 Pize Drive, Cola Street, Don Jones Lukhesciw{" "}
          </p>
          <a
            className="text-[#222222] text-[14px] font-semibold leading-[1.7173px] mt-4"
            href="mailto:iamusmanmunawar@gmail.com"
          >
            iamusmanmunawar@gmail.com
          </a>
          <br />
          <a
            className="text-[#222222] text-[14px] font-medium leading-[1.7173px] mt-4"
            href="tel:+923174303225"
          >
            +92 317 4303225
          </a>
          <div className="flex gap-8 mt-8">
            <FaFacebookF />
            <FaTwitter />
            <IoLogoInstagram />
            <BsYoutube />
            <FaPinterest />
          </div>
        </div>
        <div className="mt-10">
          <div className="flex flex-wrap">
            {[1, 2, 3].map((item) => (
              <div className="w-[50%] px-2 mb-6">
                <h1 className="mt-[14px] text-[16px] leading-[1.2em] font-semibold mb-[14px]">
                  Company
                </h1>
                <ul className="text-[14px] leading-[1.5em] font-normal mb-[2px]">
                  <li className="mb-[4px] mt-[3px]  py-2 cursor-pointer">About Us</li>
                  <li className="mb-[4px] mt-[3px] cursor-pointer  py-2">Careers</li>
                  <li className="mb-[4px] mt-[3px] cursor-pointer  py-2">Affiliates</li>
                  <li className="mb-[4px] mt-[3px] cursor-pointer  py-2">Blog</li>
                  <li className="mb-[4px] mt-[3px]  cursor-pointer py-2">Contact Us</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6 px-2">
          <div>
            <h1 className="mt-[14px] uppercase text-[16px] leading-[1.2em] font-semibold mb-[14px]">
              Subscribe
            </h1>
            <p className="text-[14px] leading-[1.7em] font-normal mb-[16px] mt-[3px]  py-2">
              Be the first to get the latest news about trends, promotions, and
              much more!
            </p>
            <div className="relative md:mb-8">
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                id="email"
                className="block w-full px-4 py-5 text-sm font-normal leading-tight text-gray-800 bg-white border border-gray-300 rounded-none shadow-none transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="absolute top-[20px] cursor-pointer uppercase pr-[15px] text-[16px] font-semibold right-0">
                Join
              </p>
            </div>
            <div className="mt-4 pt-3">
              <h1 className=" uppercase text-[12px] leading-[1.2em] font-semibold mb-[14px]">
                Secure Payments
              </h1>
              <div className="flex gap-4 my-2">
                <Image src={masterCard} alt="masterCard" className="w-[35px] h-[35px]"/>
                <Image src={masterCard} alt="masterCard" className="w-[35px] h-[35px]"/>
                <Image src={masterCard} alt="masterCard" className="w-[35px] h-[35px]"/>
                <Image src={masterCard} alt="masterCard" className="w-[35px] h-[35px]"/>
                <Image src={masterCard} alt="masterCard" className="w-[35px] h-[35px]"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#cfcdcd] md:mx-8" />

    </footer>
  );
}
