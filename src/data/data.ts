import {
  BsYoutubeIcon,
  DeliveryIcon,
  FaFacebookFIcon,
  FaPinterestIcon,
  FaTwitterIcon,
  IoLogoInstagramIcon,
  MoneyBackGuaranteeIcon,
  ServiceIcon,
} from "@/assets/svg/common";
// import P1 from "@/assets/img/P4.jpg";
// import P2 from "@/assets/img/P5.jpg";
// import P3 from "@/assets/img/P6.jpg";
import Banner1 from "../assets/img/grid-banner-1.jpg";
import Banner2 from "../assets/img/grid-banner-2.jpg";
import Banner3 from "../assets/img/grid-banner-3.jpg";
import Banner4 from "../assets/img/grid-banner-4.jpg";
// import Product1 from "../assets/img/product-1-2.jpg";
// import Product2 from "../assets/img/product-1-1.jpg";
// import Product3 from "../assets/img/product-2-1.jpg";
// import Product4 from "../assets/img/product-2-2.jpg";
// import Product5 from "../assets/img/product-3-1.jpg";
// import Product6 from "../assets/img/product-3-2.jpg";
// import Product7 from "../assets/img/product-4-1.jpg";
// import Product8 from "../assets/img/product-4-2.jpg";
// import Product9 from "../assets/img/product-5-1.jpg";
// import Product10 from "../assets/img/product-5-2.jpg";
// import Product11 from "../assets/img/product-6-1.jpg";
// import Product12 from "../assets/img/product-6-2.jpg";
// import Product13 from "../assets/img/product-7-1.jpg";
// import Product14 from "../assets/img/product-7-2.jpg";
// import Product15 from "../assets/img/product-8-1.jpg";
// import Product16 from "../assets/img/product-8-2.jpg";
import {
  BannerProductProps,
  FooterCopyRightProps,
  FooterItem,
  FooterLinksProps,
  ProductCardDataProps,
  ServicesDataProps,
} from "./dataProps";

export const servicesData: ServicesDataProps[] = [
  {
    _id: "abc",
    Title: "free and fast delivery",
    description: "Free delivery for all orders over PKR5000",
    icon: DeliveryIcon,
  },
  {
    _id: "abcd",
    Title: "24/7 customer support",
    description: "Friendly 24/7 customer support",
    icon: ServiceIcon,
  },
  {
    _id: "abcde",
    Title: "moneY BACK GUARANTEE",
    description: "We retun money within 15 days.",
    icon: MoneyBackGuaranteeIcon,
  },
];
export const FooterCopyRightData: FooterCopyRightProps[] = [
  {
    _id: "abc",
    Title: "Language",
    Value: "United Kingdom | English",
  },
  {
    _id: "abcd",
    Title: "Currency",
    Value: "₹ PKR",
  },
];
export const FooterLinksData: FooterLinksProps[] = [
  {
    _id: "abcde",
    icon: FaFacebookFIcon,
    path: "https://www.facebook.com/people/PakShipper/61577806854227/",
  },
  // {
  //   _id: "hello",
  //   icon: FaTwitterIcon,
  //   path: "https://twitter.com/",
  // },
  {
    _id: "instagram",
    icon: IoLogoInstagramIcon,
    path: "https://www.instagram.com/pakshipper/",
  },
  // {
  //   _id: "computer",
  //   icon: BsYoutubeIcon,
  //   path: "https://www.youtube.com/",
  // },
  // {
  //   _id: "hi",
  //   icon: FaPinterestIcon,
  //   path: "https://www.pinterest.com/",
  // },
];

export const footerData: FooterItem[] = [
{
    title: "Company",
    items: [
      { name: "About Us", url: "/pages/about-us" }
    ]
  },
  {
    title: "Shop",
    items: [
      {
        name: "Shop All",
        url: "/pages/all-products?parent-category-id=67f250a92f78a67e01f2b28e"
      },
      {
        name: "Beauty & Health",
        url: "/pages/all-products?childCategoryID=683db0fa82b8595f32e61408"
      }
    ]
  },
  {
    title: "Help",
    items: [
      { name: "My Account", url: "" },
      { name: "Contact Us", url: "/pages/contact-us" }
    ]
  }
];

export const BannerProductsData: BannerProductProps[] = [
  {
    _id: "6543613165665",
    bannerimage: Banner1,
    title: "basic Collection",
    desc: "New Arrivals",
    bannerimage1: Banner2,
    title1: "shop casual",
    desc1: "Free Shipping",
  },
  {
    _id: "6543613165kdjakj65",
    bannerimage: Banner3,
    title: "want and need",
    desc: "the eyegirl wears",
    bannerimage1: Banner4,
    title1: "sales of the week",
    desc1: "running shoes",
  },
];
// export const ProductCardData: ProductCardDataProps[] = [
//   {
//     _id: "12345a",
//     productName: "Calvin1",
//     productCategory: "Dresses",
//     description: "Stylish Calvin shorts perfect for summer outings.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product1,
//     thumbNailImage2: Product2,
//     images: [
//       { src: P1, alt: "Calvin shorts front view", _id:"1" },
//       { src: P2, alt: "Calvin shorts side view", _id:"2" },
//       { src: P3, alt: "Calvin shorts back view" , _id:"3"},
//     ],
//     availableSizes: ["S", "M", "L", "XL"],
//   },
//   {
//     _id: "1234b",
//     productName: "Calvin2",
//     productCategory: "Dresses",
//     description: "Trendy Calvin shorts made from high-quality fabric.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: true,
//     isSale: false,
//     thumbNailImage1: Product3,
//     thumbNailImage2: Product4,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts back view" },
//     ],
//     colors: ["cyan", "black", "gray"],
//     availableSizes: ["S", "M", "L", "XL"],
//   },
//   {
//     _id: "12332af1w651f65aw45",
//     productName: "Calvin3",
//     productCategory: "Dresses",
//     description: "Casual Calvin shorts for everyday comfort.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product5,
//     thumbNailImage2: Product6,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts side view" },
//     ],
//   },
//   {
//     _id: "123432af12waF5",
//     productName: "Calvin4",
//     productCategory: "Dresses",
//     description: "Elegant Calvin shorts with a discount offer.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     discount: "67",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product7,
//     thumbNailImage2: Product8,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts back view" },
//     ],
//     availableSizes: ["S", "M", "L", "XL"],
//   },
//   {
//     _id: "1234gawfawva33435",
//     productName: "Calvin5",
//     productCategory: "Dresses",
//     description: "High-quality Calvin shorts with sale discount.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: true,
//     thumbNailImage1: Product9,
//     thumbNailImage2: Product10,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts back view" },
//     ],
//   },
//   {
//     _id: "12awsegawgawg345",
//     productName: "Calvin Shorts",
//     productCategory: "Dresses",
//     description: "Comfortable Calvin shorts available in various sizes.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product11,
//     thumbNailImage2: Product12,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts back view" },
//     ],
//   },
//   {
//     _id: "1234wwwwwwwwwwwwwf5",
//     productName: "Calvin Shorts",
//     productCategory: "Dresses",
//     description: "Modern and stylish Calvin shorts for daily wear.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product13,
//     thumbNailImage2: Product14,
//     images: [
//       { src: Product1, alt: "Calvin shorts front view" },
//       { src: Product2, alt: "Calvin shorts side view" },
//     ],
//   },
//   {
//     _id: "12dawdawfawfa345",
//     productName: "Calvin Shorts",
//     productCategory: "Dresses",
//     description: "Durable Calvin shorts in different color options.",
//     isVarirnt: true,
//     stock: 40,
//     price: "45",
//     isNew: false,
//     isSale: false,
//     thumbNailImage1: Product15,
//     thumbNailImage2: Product16,
//     images: [
//       { src: Product15, alt: "Calvin shorts thumbnail 1" },
//       { src: Product16, alt: "Calvin shorts thumbnail 2" },
//     ],
//   },
// ];

// export const ProductCardData: ProductCardDataProps[] = [
//   {
//     _id: "1",
//     productName: "Basic T-Shirt",
//     productCategory: "Clothing",
//     categoryID: "c1",
//     description: "A high-quality basic T-shirt in multiple colors.",
//     isVariant: true,
//     salePrice: 15.99,
//     sku: "TSHIRT-001",
//     costPrice: 10.0,
//     stock:80,
//     discount: 10,
//     isNew: true,
//     images: [
//       { _id: "img1", src: P1, alt: "White T-Shirt", isThumbnail: true },
//       { _id: "img2", src: P2, alt: "Black T-Shirt" },
//     ],
//     options: [
//       { _id: "opt1", title: "Size", values: ["S", "M", "L", "XL"] },
//       { _id: "opt2", title: "Color", values: ["White", "Black"] },
//     ],
//     variants: [
//       {
//         _id: "var1",
//         name: "White-S",
//         attributes: { size: "S", color: "White" },
//         additionalCostPrice: 200,
//         additionalSalePrice: 300,
//         stock: 50,
//         image: "/images/variant1.jpg",
//       },
//       {
//         _id: "var2",
//         name: "Black-M",
//         attributes: { size: "M", color: "Black" },
//         additionalCostPrice: 100,
//         additionalSalePrice: 200,
//         stock: 10,
//         image: "/images/variant2.jpg",
//       },
//       {
//         _id: "var3",
//         name: "White-M",
//         attributes: { size: "M", color: "White" },
//         additionalCostPrice: 50,
//         additionalSalePrice: 100,
//         stock: 1,
//         image: "/images/variant2.jpg",
//       },
//       {
//         _id: "var4",
//         name: "White-L",
//         attributes: { size: "L", color: "White" },
//         additionalCostPrice: 20,
//         additionalSalePrice: 400,
//         stock: 3,
//         image: "/images/variant2.jpg",
//       },
//     ],
//   },
//   {
//     _id: "2",
//     productName: "Wireless Headphones",
//     productCategory: "Electronics",
//     categoryID: "c2",
//     description: "Noise-canceling over-ear headphones with Bluetooth.",
//     isVariant: false,
//     salePrice: 99.99,
//     sku: "HEADPHONES-001",
//     costPrice: 70.0,
//     stock: 200, // Stock at product level
//     images: [
//       { _id: "img3", src: Product1, alt: "Wireless Headphones", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "3",
//     productName: "Gaming Mouse",
//     productCategory: "Electronics",
//     categoryID: "c4",
//     description: "Ergonomic gaming mouse with customizable RGB lighting.",
//     isVariant: false,
//     salePrice: 49.99,
//     sku: "MOUSE-001",
//     costPrice: 35.0,
//     stock: 150, // Stock at product level
//     images: [
//       { _id: "img4", src: Product3, alt: "Gaming Mouse", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "4",
//     productName: "Yoga Mat",
//     productCategory: "Sports",
//     categoryID: "c5",
//     description: "Non-slip yoga mat for all levels of practice.",
//     isVariant: true,
//     salePrice: 29.99,
//     sku: "YOGAMAT-001",
//     stock:40,
//     costPrice: 20.0,
//     images: [
//       { _id: "img5", src: Product5, alt: "Yoga Mat", isThumbnail: true },
//     ],
//     options: [
//       { _id: "opt3", title: "Thickness", values: ["5mm", "10mm"] },
//       { _id: "opt4", title: "Color", values: ["Purple", "Green", "Black"] },
//     ],
//     variants: [
//       {
//         _id: "var3",
//         name: "Purple-10mm",
//         attributes: { color: "Purple", thickness: "10mm" },
//         additionalCostPrice: 2.0,
//         additionalSalePrice: 3.0,
//         stock: 40,
//         image: "/images/variant3.jpg",
//       },
//     ],
//   },
//   {
//     _id: "5",
//     productName: "Ceramic Coffee Mug",
//     productCategory: "Home & Kitchen",
//     categoryID: "c6",
//     description: "A durable ceramic coffee mug with a sleek design.",
//     isVariant: false,
//     salePrice: 12.99,
//     sku: "MUG-001",
//     costPrice: 8.0,
//     stock: 100, // Stock at product level
//     images: [
//       { _id: "img6", src: Product7, alt: "Ceramic Coffee Mug", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "6",
//     productName: "Stainless Steel Water Bottle",
//     productCategory: "Home & Kitchen",
//     categoryID: "c7",
//     description: "Keeps drinks hot or cold for hours.",
//     isVariant: true,
//     salePrice: 25.99,
//     sku: "BOTTLE-001",
//     stock:20,
//     costPrice: 18.0,
//     images: [
//       { _id: "img7", src: Product9, alt: "Water Bottle", isThumbnail: true },
//     ],
//     options: [
//       { _id: "opt5", title: "Color", values: ["Silver", "Blue", "Black"] },
//     ],
//     variants: [
//       {
//         _id: "var4",
//         name: "Silver",
//         attributes: { color: "Silver" },
//         additionalCostPrice: 0,
//         additionalSalePrice: 0,
//         stock: 20,
//         image: "/images/variant4.jpg",
//       },
//     ],
//   },
//   {
//     _id: "7",
//     productName: "Cotton Bedsheet",
//     productCategory: "Home & Living",
//     categoryID: "c8",
//     description: "Soft and breathable cotton bedsheet.",
//     isVariant: false,
//     salePrice: 34.99,
//     sku: "BEDSHEET-001",
//     costPrice: 25.0,
//     stock: 80, // Stock at product level
//     images: [
//       { _id: "img8", src: Product11, alt: "Cotton Bedsheet", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "8",
//     productName: "Leather Wallet",
//     productCategory: "Accessories",
//     categoryID: "c9",
//     description: "Compact and stylish leather wallet.",
//     isVariant: false,
//     salePrice: 19.99,
//     sku: "WALLET-001",
//     costPrice: 12.0,
//     stock: 120, // Stock at product level
//     images: [
//       { _id: "img9", src: Product13, alt: "Leather Wallet", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "9",
//     productName: "Digital Alarm Clock",
//     productCategory: "Electronics",
//     categoryID: "c10",
//     description: "Stylish alarm clock with LED display.",
//     isVariant: false,
//     salePrice: 29.99,
//     sku: "CLOCK-001",
//     costPrice: 20.0,
//     stock: 70, // Stock at product level
//     images: [
//       { _id: "img10", src: Product15, alt: "Digital Alarm Clock", isThumbnail: true },
//     ],
//     options: [],
//     variants: [],
//   },
//   {
//     _id: "10",
//     productName: "Running Shoes",
//     productCategory: "Footwear",
//     categoryID: "c11",
//     description: "Comfortable and durable running shoes.",
//     isVariant: true,
//     salePrice: 49.99,
//     sku: "SHOES-001",
//     stock:25,
//     costPrice: 35.0,
//     images: [
//       { _id: "img11", src: P2, alt: "Running Shoes", isThumbnail: true },
//     ],
//     options: [
//       { _id: "opt6", title: "Size", values: ["8", "9", "10", "11"] },
//       { _id: "opt7", title: "Color", values: ["Blue", "Black"] },
//     ],
//     variants: [
//       {
//         _id: "var5",
//         name: "Blue-9",
//         attributes: { size: "9", color: "Blue" },
//         additionalCostPrice: 0,
//         additionalSalePrice: 0,
//         stock: 25,
//         image: "/images/variant5.jpg",
//       },
//     ],
//   },
// ];
