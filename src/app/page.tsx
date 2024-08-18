import React, { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/Footer/footer"));
const Trending = lazy(() => import("@/components/Trending/trending"));
export default function Home() {
  return (
    <>
   
        <Suspense fallback={<div>Loading Trending .........</div>}>
        <Trending />
      </Suspense>
         <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}
