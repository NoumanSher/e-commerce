"use client";
import Image from "next/image";
import React, { memo, useState } from "react";
import masterCard from "../../../assets/img/mc_sym_debit_pos.svg";
import { subscribeNewsletter } from "@/services/newsletterService";

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1 className="mt-[14px] uppercase text-[16px] leading-[1.2em] font-semibold mb-[14px] lg:mb-[30px] lg:mt-0">
          Subscribe
        </h1>
        <p className="text-[14px] leading-[1.7em] font-normal mb-[16px] mt-[3px] py-2">
          Be the first to get the latest news about trends, promotions, and much more!
        </p>
        {subscribed ? (
          <p className="text-sm text-green-600 font-semibold py-2">
            ✓ Thank you for subscribing!
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="relative md:mb-8">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              id="email"
              required
              disabled={loading}
              className="block w-full px-4 py-5 pr-16 text-sm font-normal leading-tight text-gray-800 bg-white border border-gray-300 rounded-none shadow-none transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute top-[18px] cursor-pointer uppercase pr-[15px] text-[14px] font-semibold right-0 text-gray-900 hover:text-blue-600 transition-colors"
            >
              {loading ? "..." : "Join"}
            </button>
            {errorMsg && (
              <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
            )}
          </form>
        )}
        <div className="mt-4 pt-3">
          <h1 className=" uppercase text-[12px] lg:text-[10px] leading-[1.2em] font-semibold mb-[14px]">
            Secure Payments
          </h1>
          <div className="flex gap-4 my-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <React.Fragment key={item}>
                <Image
                  src={masterCard}
                  alt="masterCard"
                  priority={true}
                  loading="eager"
                  className="w-[35px] h-[35px]"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(FooterSubscribe);
