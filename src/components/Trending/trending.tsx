import React, { lazy, Suspense } from "react";
const TrendingMain = lazy(() => import("./components/TrendingMain"));

export default function Trending() {
  return (
    <div>
    
        <Suspense fallback={<div>Loading...</div>}>
          <TrendingMain />
        </Suspense>
    </div>
  );
}
