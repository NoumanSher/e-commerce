'use client'
import { footerData } from '@/data/data'
import React, { memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/storeContext'

const FooterTabs = () => {
  const router = useRouter();
  const { authToken, setIsAuthModalOpen, setActiveTab } = useStore();

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authToken) {
      router.push("/profile");
    } else {
      setActiveTab("login");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-y-8">
      {footerData.map((section, index) => (
        <div key={index} className="w-[50%] lg:w-1/3 px-2">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 lg:mb-6 text-gray-900">
            {section.title}
          </h2>
          <ul className="text-sm font-medium text-gray-500 space-y-3">
            {section.items.map((item, itemIndex) => (
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
