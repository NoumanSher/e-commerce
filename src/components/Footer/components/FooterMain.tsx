import React, { lazy, memo, Suspense } from 'react'
const Services = lazy(() => import("./Services"));
const FooterCopyRight = lazy(() => import("./FooterCopyRight"));
const FooterTabs = lazy(() => import("./FooterTabs"));
const FooterInfo = lazy(() => import("./FooterInfo"));
// const FooterSubscribe = lazy(() => import("./FooterSubscribe"));

const  FooterMain=()=> {
  return (
    <div className="bg-white border-t border-gray-200 mt-auto">
       <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Services />
        </Suspense>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 lg:flex xl:max-w-7xl xl:px-8 xl:mx-auto">
        <div className="mb-10 lg:mb-0 lg:w-[40%] pr-4">
          <Suspense fallback={<div>Loading...</div>}>
            <FooterInfo />
          </Suspense>
        </div>
        <div className="lg:w-[60%]">
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
