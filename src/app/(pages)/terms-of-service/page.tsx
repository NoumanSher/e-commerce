"use client";

import React from "react";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

export default function TermsOfServicePage() {
  const { data: settings, isLoading } = useGetStoreSettings();

  const termsOfServiceContent = settings?.termsOfService;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 md:px-8">
      <div className="max-w-4xl w-full bg-white shadow-sm p-8 md:p-12 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">Terms of Service</h1>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : termsOfServiceContent ? (
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: termsOfServiceContent }}
          />
        ) : (
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p className="text-gray-500 mb-8">Last updated: April 7, 2026</p>
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing and using PakShipper, you agree to be bound by these Terms of Service. If you disagree
                with any part of the terms, you must not access or use our services. These terms apply to all visitors,
                users, and others who access or use the platform.
              </p>
            </section>
            <p className="text-sm text-gray-400 italic mt-8">Default terms content shown. Please update in Admin Panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
