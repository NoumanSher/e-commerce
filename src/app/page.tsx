import React, { Suspense, lazy } from "react";
const Footer = lazy(() => import("@/components/Footer/footer"));
export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}
