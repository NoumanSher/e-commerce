export interface StoreInfo {
  _id: string;
  title: string;
  description: string;
  address: string;
  mobile: string;
  logo: string;
  bannerImg: string;
  bannerImgLink: string;
  twitterUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bannerImages: BannerImage[];
  aboutUs?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    storyTitle?: string;
    storyContent?: string;
    storyImage?: string;
    stats?: Array<{ number: string; label: string }>;
    values?: Array<{ title: string; description: string; icon?: string }>;
  };
  contactUs?: {
    title?: string;
    subtitle?: string;
    phone?: string;
    email?: string;
    address?: string;
    workingHours?: string;
    mapEmbedUrl?: string;
    enableForm?: boolean;
  };
  pinterestUrl: string;
  youtubeUrl: string;
  promoCards: PromoCard[];
}

interface BannerImage {
  img: string;          // Desktop / landscape image
  mobileImg?: string;   // Mobile / portrait image (falls back to img if empty)
  altText: string;
  orderNumber: number;
  sortOrder?: number;
  isActive?: boolean;
  _id: string;
  link?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  displayText?: boolean;
}

export interface PromoCard {
  img: string;
  title: string;
  subtitle?: string;
  link?: string;
  orderNumber: number;
  _id?: string;
}
