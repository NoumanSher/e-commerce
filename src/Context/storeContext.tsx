"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
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
  updateProductDetailtData: (object: ProductDetailData) => void;
  productDetail: ProductDetailData | null;
  authToken: string; // Renamed from isLogIn for clarity
  isHydrated: boolean;
  wishlist: Product[];
  cartItems: CartItem[];
  setIsCartOpen: (value: boolean) => void;
  setIsAuthModalOpen: (value: boolean) => void;
  setOrderNumber: (value: string) => void;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setAuthToken: (value: string) => void; // Renamed from setIsLogIn
  setWishlist: Dispatch<SetStateAction<Product[]>>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(
  undefined
);

/**
 * Initialize state from storage with SSR-safe fallbacks.
 */
const getInitialState = () => ({
  productDetail: storageApi.getJSON<ProductDetailData | null>(
    STORAGE_KEYS.productDetails,
    null
  ),
  authToken: storageApi.get(STORAGE_KEYS.token) || "",
  userId: storageApi.get(STORAGE_KEYS.userId) || "",
  userName: storageApi.get(STORAGE_KEYS.userName) || "",
  selectedCategory: storageApi.get(STORAGE_KEYS.selectedCategory) || null,
  wishlist: storageApi.getJSON<Product[]>(STORAGE_KEYS.wishlist, []),
  cartItems: storageApi.getJSON<CartItem[]>(STORAGE_KEYS.cart, []),
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Use safe defaults to avoid server/client markup mismatch during hydration.
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [authToken, setAuthToken_State] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailData | null>(
    null
  );
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const updateProductDetailtData = useCallback((newData: ProductDetailData) => {
    setProductDetail(newData);
  }, []);

  const updateSelectedCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    storageApi.set(STORAGE_KEYS.selectedCategory, categoryId);
  }, []);

  // Load persisted state only on the client AFTER initial render to avoid
  // hydration mismatch between server-rendered HTML and client initial DOM.
  useEffect(() => {
    const initialState = getInitialState();
    setUserName(initialState.userName);
    setAuthToken_State(initialState.authToken);
    setUserId(initialState.userId);
    setSelectedCategory(initialState.selectedCategory);
    setProductDetail(initialState.productDetail);
    setWishlist(initialState.wishlist);
    setCartItems(initialState.cartItems);
    setIsHydrated(true);
  }, []);

  // Wrapper to sync authToken with apiClient
  const setAuthToken = useCallback((token: string) => {
    setAuthToken_State(token);
    if (token) {
      storageApi.set(STORAGE_KEYS.token, token);

    } else {
      storageApi.remove(STORAGE_KEYS.token);
      setUserId("");
      setUserName("");
      clearAuthToken();
    }
  }, []);

  // Consolidated effect: sync all state changes to storage
  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.productDetails, productDetail);
  }, [productDetail, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (userId) {
      storageApi.set(STORAGE_KEYS.userId, userId);
    } else {
      storageApi.remove(STORAGE_KEYS.userId);
    }
  }, [userId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (userName) {
      storageApi.set(STORAGE_KEYS.userName, userName);
    } else {
      storageApi.remove(STORAGE_KEYS.userName);
    }
  }, [userName, isHydrated]);

  const contextValue = useMemo(
    () => ({
      setActiveTab,
      activeTab,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isCartOpen,
      selectedCategory,
      updateSelectedCategory,
      setIsCartOpen,
      wishlist,
      setWishlist,
      cartItems,
      setCartItems,
      setAuthToken,
      authToken,
      isHydrated,
      updateProductDetailtData,
      productDetail,
      orderNumber,
      setOrderNumber,
      userId,
      setUserId,
      userName,
      setUserName,
    }),
    [
      activeTab,
      isAuthModalOpen,
      isCartOpen,
      selectedCategory,
      updateSelectedCategory,
      wishlist,
      cartItems,
      setAuthToken,
      authToken,
      isHydrated,
      updateProductDetailtData,
      productDetail,
      orderNumber,
      userId,
      userName,
    ]
  );

  return (
    <StoreTypeContext.Provider value={contextValue}>
      {children}
    </StoreTypeContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreTypeContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
