import React, { lazy, memo, Suspense } from 'react'
const Services = lazy(() => import("./Services"));
const FooterCopyRight = lazy(() => import("./FooterCopyRight"));
const FooterTabs = lazy(() => import("./FooterTabs"));
const FooterInfo = lazy(() => import("./FooterInfo"));
// const FooterSubscribe = lazy(() => import("./FooterSubscribe"));

const  FooterMain=()=> {
  return (
    <div  className="bg-[#e4e4e4]">
       <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Services />
        </Suspense>
      </div>
      <div className="px-[15px] md:px-8 lg:px-12 pt-[50px] md:pt-[65px] md:pb-[45px] lg:pt-[50px] lg:pb-[76px] pb-[30px] lg:flex xl:max-w-[1440px] xl:px-0 xl:mx-auto">
        <div className=" mb-[24px] lg:mb-0 lg:w-[40%] lg:px-3">
          <Suspense fallback={<div>Loading...</div>}>
            <FooterInfo />
          </Suspense>
        </div>
        <div className="mt-10 lg:mt-0 lg:w-full">
        <Suspense fallback={<div>Loading...</div>}>
            <FooterTabs />
          </Suspense>
        </div>
        {/* <div className="mb-6 px-2 lg:w-[25%]">
          <Suspense fallback={<div>Loading...</div>}>
            <FooterSubscribe />
          </Suspense>
        </div> */}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterCopyRight />
      </Suspense>
    </div>
  )
}

export default memo(FooterMain)
