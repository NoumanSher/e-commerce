'use client'
import { footerData } from '@/data/data'
import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
const FooterTabs=()=> {
  const router = useRouter()
  return (
    <div>
        <div className="flex flex-wrap lg:flex-nowrap">
        {footerData.map((section, index) => (
          <div key={index} className="w-[50%] px-2 mb-6">
            <h1 className="mt-[14px] text-[16px] leading-[1.2em] font-semibold mb-[14px] lg:mb-[30px] lg:mt-0">
              {section.title}
            </h1>
            <ul className="text-[14px] leading-[1.5em] font-normal mb-[2px]">
              {section.items.map((item, itemIndex) => (
                <li onClick={() => router.push(item.url)} key={itemIndex} className="mb-[4px] mt-[3px] py-2 cursor-pointer">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(FooterTabs)
