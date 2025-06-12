import React from "react";
// import { ProductCardData as productsArray } from "@/data/data";

import AllCAtegoriesCardSection from "../Trending/components/AlllCAtegoriesCard/index";

export default function AllProductsMain() {
  return (
    <div>
      <h1 className="text-primary text-2xl text-center mt-5">
        All produts here
      </h1>
      <AllCAtegoriesCardSection  />
    </div>
  );
}
