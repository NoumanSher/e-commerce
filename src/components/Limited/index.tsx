import React, { lazy, Suspense } from "react";
const LimitedEditionMain = lazy(
  () => import("@/components/Limited/Components/LimitedEditionMain")
);

export default function LimitedEdition() {
  return (
    <Suspense fallback={<div>Loading.......</div>}>
      <LimitedEditionMain />
    </Suspense>
  );
}
