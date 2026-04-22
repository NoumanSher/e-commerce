'use client'
import { footerData } from '@/data/data'
import React, { memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/storeContext'
import { useAuth } from '@/context/AuthContext'
import { useGetStoreSettings } from '@/components/Slider/query/storeSettingQuery'

const FooterTabs = () => {
  const router = useRouter();
  const { setIsAuthModalOpen, setActiveTab } = useStore();
  const { authToken } = useAuth();

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authToken) {
      router.push("/profile");
    } else {
      setActiveTab("login");
      setIsAuthModalOpen(true);
    }
  };

  const { data: settings } = useGetStoreSettings();
  
  const companyColumn = {
    title: "Company",
    items: [
      { name: "About Us", url: "/about-us" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms of Service", url: "/terms-of-service" }
    ]
  };

  const helpColumn = {
    title: "Help",
    items: [
      { name: "My Account", url: "" },
      { name: "Contact Us", url: "/contact-us" }
    ]
  };

  const shopColumns = (settings?.footerLinks && settings.footerLinks.length > 0) 
    ? settings.footerLinks 
    : [
        {
          title: "Shop",
          items: [
            { name: "Formal Wear", url: "/all-products?childCategorySlug=Formal-Wear&mode=client" },
            { name: "Lingerie Sets", url: "/all-products?childCategorySlug=Lingerie-sets&mode=client" },
            { name: "Pajamas & Robes", url: "/all-products?childCategorySlug=Pajamas-Robes&mode=client" }
          ]
        }
      ];

  const displayData = [companyColumn, ...shopColumns, helpColumn];

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-y-8">
      {displayData.map((section: any, index: number) => (
        <div key={index} className="w-[50%] lg:w-1/3 px-2">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 lg:mb-6 text-gray-900">
            {section.title}
          </h2>
          <ul className="text-sm font-medium text-gray-500 space-y-3">
            {section.items.map((item: any, itemIndex: number) => (
              <li key={itemIndex}>
                {item.name === "My Account" ? (
                  <button 
                    onClick={handleAccountClick} 
                    className="hover:text-black transition-colors block text-left"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link href={item.url} className="hover:text-black transition-colors block">
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default memo(FooterTabs)
