import React, { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/Footer/footer"));
const Trending = lazy(() => import("@/components/Trending/trending"));
const Collection = lazy(() => import("@/components/Collection"));
export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading Trending .........</div>}>
        <Trending />
      </Suspense>
      <Suspense fallback={<div>Loading Trending .........</div>}>
        <Collection />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}
