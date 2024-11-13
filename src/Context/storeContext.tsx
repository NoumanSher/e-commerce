import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { ProductCardDataProps } from "@/data/dataProps";

interface StoreContextProps {
  isCartOpen: boolean;
  wishlist: ProductCardDataProps[];
  setIsCartOpen: (value: boolean) => void;
  setWishlist: Dispatch<SetStateAction<ProductCardDataProps[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(undefined);

const getInitialWishlist = (): ProductCardDataProps[] => {
  if (typeof window !== "undefined") {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  }
  return [];
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<ProductCardDataProps[]>(getInitialWishlist);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const contextValue = useMemo(
    () => ({
      isCartOpen,
      setIsCartOpen,
      wishlist,
      setWishlist,
    }),
    [isCartOpen, wishlist]
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
