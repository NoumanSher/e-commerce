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
import { Product } from "@/components/productDetail/productDetailDto";
import { ProductDetailData, CartItem } from "@/types"; // Import interface

interface StoreContextProps {
  isCartOpen: boolean;
  orderNumber: string;
  userId: string;
  userName: string;
  selectedCategory: string | null;
  updateSelectedCategory: (categoryId: string) => void;
  updateProductDetailtData: (object: ProductDetailData) => void;
  productDetail: ProductDetailData | null;
  isLogIn: string;
  wishlist: Product[];
  cartItems: CartItem[];
  setIsCartOpen: (value: boolean) => void;
  setOrderNumber: (value: string) => void;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setIsLogIn: (value: string) => void;
  setWishlist: Dispatch<SetStateAction<Product[]>>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(
  undefined
);
const Product_Detail_KEY = "productDeatails";

const getCheckoutDataFromStorage = (): ProductDetailData | null => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(Product_Detail_KEY);
    return storedData ? JSON.parse(storedData) : null;
  }
  return null;
};

const saveCheckoutDataToStorage = (data: ProductDetailData) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(Product_Detail_KEY, JSON.stringify(data));
    } catch {
      console.warn("Failed to save checkout data to localStorage.");
    }
  }
};
const CART_STORAGE_KEY = "shoppingCart";

const getCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      console.warn("Failed to save cart data to localStorage.");
    }
  }
};

const saveTokenToStorage = (token: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("token", token);
    } catch {
      console.warn("Failed to save token to localStorage.");
    }
  }
};
const saveUserIdInStorage = (userId: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("userId", userId);
    } catch {
      console.warn("Failed to save userId in localStorage.");
    }
  }
};
const saveUserNameInStorage = (userName: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("userName", userName);
    } catch {
      console.warn("Failed to save userName in localStorage.");
    }
  }
};
const getInitialWishlist = (): Product[] => {
  if (typeof window !== "undefined") {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  }
  return [];
};
const getIsLogIn = (): string => {
  if (typeof window !== "undefined") {
    const isLogIn = localStorage.getItem("token");
    return isLogIn ? isLogIn : "";
  }
  return "";
};
const getUserId = (): string => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("userId");
    return userId ? userId : "";
  }
  return "";
};
const getUserName = (): string => {
  if (typeof window !== "undefined") {
    const userName = localStorage.getItem("userName");
    return userName ? userName : "";
  }
  return "";
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [userName, setUserName] = useState(getUserName());
  const [isLogIn, setIsLogIn] = useState(getIsLogIn());
  const [userId, setUserId] = useState(getUserId());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailData | null>(
    getCheckoutDataFromStorage()
  );

  useEffect(() => {
    if (productDetail) {
      saveCheckoutDataToStorage(productDetail);
    }
  }, [productDetail]);

  const updateProductDetailtData = (newData: ProductDetailData) => {
    setProductDetail(newData);
  };
  // Load the selected category from localStorage on initial render
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  // Function to update the selected category and store it in localStorage
  const updateSelectedCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    localStorage.setItem("selectedCategory", categoryId); // Save to localStorage
  }, []);
  const [wishlist, setWishlist] = useState<Product[]>(getInitialWishlist);
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartFromStorage);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);
  useEffect(() => {
    if (isLogIn) {
      saveTokenToStorage(isLogIn); // Save token if logged in
    } else {
      localStorage.removeItem("token"); // Clear token if logged out
    }
  }, [isLogIn]);
  useEffect(() => {
    if (userId) {
      saveUserIdInStorage(userId); // Save userId if logged in
    } else {
      localStorage.removeItem("userId"); // Clear userId if logged out
    }
  }, [userId]);
  useEffect(() => {
    if (userName) {
      saveUserNameInStorage(userName); // Save userName if logged in
    } else {
      localStorage.removeItem("userName"); // Clear userName if logged out
    }
  }, [userName]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const contextValue = useMemo(
    () => ({
      isCartOpen,
      selectedCategory,
      updateSelectedCategory,
      setIsCartOpen,
      wishlist,
      setWishlist,
      cartItems,
      setCartItems,
      setIsLogIn,
      isLogIn,
      updateProductDetailtData,
      productDetail,
      orderNumber,
      setOrderNumber,
      userId,
      setUserId,
      userName,
      setUserName
    }),
    [isCartOpen, selectedCategory, updateSelectedCategory, wishlist, cartItems, isLogIn, productDetail, orderNumber, userId, userName]
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
