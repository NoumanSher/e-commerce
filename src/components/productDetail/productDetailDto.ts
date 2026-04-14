interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  slug: string;
}



interface Image {
  src: string;
  alt: string;
  blurDataURL: string;
  isThumbnail: boolean;
  _id: string;
}

interface Option {
  title: string;
  values: string[];
  _id: string;
}

interface Variant {
  name: string;
  additionalCostPrice: number;
  additionalSalePrice: number;
  stock: number;
  _id: string;
}

export interface Product {
  seo: SEO;
  _id: string;
  productName: string;
  parentCategoryID: {
    name: string;
    _id: string;
  };
  parentCategorySlug: string;
  childCategorySlug: string;
  childCategoryID: string;
  description: string;
  isVariant: boolean;
  salePrice: number;
  sku: string;
  costPrice: number;
  stock: number;
  discount: number;
  isNew: boolean;
  isLimited: boolean;
  images: Image[];
  options: Option[];
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  parentCategoryName: string;
  childCategoryName: string;
}

export interface ProductDetailApiResponse {
  message: string;
  data: Product;
}
