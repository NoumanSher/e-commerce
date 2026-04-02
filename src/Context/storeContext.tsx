"use client";
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { Product } from "@/components/productDetail/productDetailDto";
import { ProductDetailData, CartItem } from "@/types";
import { clearAuthToken } from "@/lib/apiClient";

interface StoreContextProps {
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  orderNumber: string;
  activeTab: string;
  setActiveTab: (value: string) => void;
  userId: string;
  userName: string;
  selectedCategory: string | null;
  updateSelectedCategory: (categoryId: string) => void;
  updateProductDetailData: (data: ProductDetailData) => void;
  productDetail: ProductDetailData | null;
  authToken: string;
  isHydrated: boolean;
  wishlist: Product[];
  cartItems: CartItem[];
  setIsCartOpen: (value: boolean) => void;
  setIsAuthModalOpen: (value: boolean) => void;
  setOrderNumber: (value: string) => void;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setAuthToken: (value: string) => void;
  setWishlist: Dispatch<SetStateAction<Product[]>>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(undefined);

const getStoredState = () => ({
  productDetail: storageApi.getJSON<ProductDetailData | null>(STORAGE_KEYS.productDetails, null),
  authToken: storageApi.get(STORAGE_KEYS.token) ?? "",
  userId: storageApi.get(STORAGE_KEYS.userId) ?? "",
  userName: storageApi.get(STORAGE_KEYS.userName) ?? "",
  selectedCategory: storageApi.get(STORAGE_KEYS.selectedCategory) ?? null,
  wishlist: storageApi.getJSON<Product[]>(STORAGE_KEYS.wishlist, []),
  cartItems: storageApi.getJSON<CartItem[]>(STORAGE_KEYS.cart, []),
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [authToken, setAuthTokenState] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailData | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const legacy = localStorage.getItem("productDeatails");
      if (legacy) {
        localStorage.setItem("productDetails", legacy);
        localStorage.removeItem("productDeatails");
      }
    }
    const stored = getStoredState();
    setUserName(stored.userName);
    setAuthTokenState(stored.authToken);
    setUserId(stored.userId);
    setSelectedCategory(stored.selectedCategory);
    setProductDetail(stored.productDetail);
    setWishlist(stored.wishlist);
    setCartItems(stored.cartItems);
    setIsHydrated(true);
  }, []);

  const setAuthToken = useCallback((token: string) => {
    setAuthTokenState(token);
    if (token) {
      storageApi.set(STORAGE_KEYS.token, token);
    } else {
      storageApi.remove(STORAGE_KEYS.token);
      storageApi.remove(STORAGE_KEYS.refreshToken);
      setUserId("");
      setUserName("");
      clearAuthToken();
    }
  }, []);

  const updateProductDetailData = useCallback((data: ProductDetailData) => {
    setProductDetail(data);
  }, []);

  const updateSelectedCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    storageApi.set(STORAGE_KEYS.selectedCategory, categoryId);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.productDetails, productDetail);
    userId ? storageApi.set(STORAGE_KEYS.userId, userId) : storageApi.remove(STORAGE_KEYS.userId);
    userName ? storageApi.set(STORAGE_KEYS.userName, userName) : storageApi.remove(STORAGE_KEYS.userName);
  }, [productDetail, userId, userName, isHydrated]);

  const contextValue = useMemo(
    () => ({
      setActiveTab, activeTab, isAuthModalOpen, setIsAuthModalOpen, isCartOpen, selectedCategory,
      updateSelectedCategory, setIsCartOpen, wishlist, setWishlist, cartItems, setCartItems,
      setAuthToken, authToken, isHydrated, updateProductDetailData, productDetail, orderNumber,
      setOrderNumber, userId, setUserId, userName, setUserName,
    }),
    [
      activeTab, isAuthModalOpen, isCartOpen, selectedCategory, updateSelectedCategory, wishlist,
      cartItems, setAuthToken, authToken, isHydrated, updateProductDetailData, productDetail,
      orderNumber, userId, userName,
    ]
  );

  return <StoreTypeContext.Provider value={contextValue}>{children}</StoreTypeContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreTypeContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
