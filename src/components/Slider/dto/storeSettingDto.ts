export interface StoreInfo {
  _id: string;
  title: string;
  description: string;
  address: string;
  mobile: string;
  logo: string;
  bannerImg: string;
  twitterUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bannerImages: BannerImage[];
  pinterestUrl: string;
  youtubeUrl: string;
  promoCards: PromoCard[];
}

interface BannerImage {
  img: string;
  altText: string;
  orderNumber: number;
  _id: string;
  link: string;
}

export interface PromoCard {
  img: string;
  title: string;
  subtitle?: string;
  link?: string;
  orderNumber: number;
  _id?: string;
}
