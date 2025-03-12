"use client"
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

interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  variantID?: string;
}

interface StoreContextProps {
  isCartOpen: boolean;
  selectedCategory: string | null;
  updateSelectedCategory: (categoryId: string) => void;
  isLogIn: string;
  wishlist: Product[];
  cartItems: CartItem[];
  setIsCartOpen: (value: boolean) => void;
  setIsLogIn: (value: string) => void;
  setWishlist: Dispatch<SetStateAction<Product[]>>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(
  undefined
);
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

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLogIn, setIsLogIn] = useState(getIsLogIn());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
  const [wishlist, setWishlist] =
    useState<Product[]>(getInitialWishlist);
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
    }),
    [isCartOpen, wishlist, cartItems, isLogIn, selectedCategory, updateSelectedCategory]
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
