"use client";

import React, { memo } from "react";
import CategorySlider from "@/components/CategorySlider/CategorySlider";

const ProductsCategories = () => {
  return <CategorySlider theme="default" title="Explore Categories" />;
};

export default memo(ProductsCategories);
