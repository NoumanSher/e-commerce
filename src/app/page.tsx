import React, { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/Footer/footer"));
const Trending = lazy(() => import("@/components/Trending/trending"));
const Collection = lazy(() => import("@/components/Collection"));
const LimitedEdition = lazy(() => import("@/components/Limited"));
const Slider = lazy(() => import("@/components/Slider/Slider"));
export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading Slider .........</div>}>
      <Slider />
      </Suspense>
      <Suspense fallback={<div>Loading Trending .........</div>}>
        <Trending />
      </Suspense>
      <Suspense fallback={<div>Loading Inside Collection .........</div>}>
        <Collection />
      </Suspense>
      <Suspense fallback={<div>Loading Limited Edition .........</div>}>
        <LimitedEdition />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}
