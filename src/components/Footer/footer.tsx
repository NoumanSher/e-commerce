import React, { Suspense, lazy } from "react";
const FooterMain = lazy(() => import("./components/FooterMain"));

export default function Footer() {
  return (
    <footer>
      <Suspense fallback={<div>Loading...</div>}>
        <FooterMain />
      </Suspense>
    </footer>
  );
}
