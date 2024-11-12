import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { ProductCardDataProps } from "@/data/dataProps";

interface StoreContextProps {
  isCartOpen: boolean;
  wishlist: ProductCardDataProps[];
  setIsCartOpen: (value: boolean) => void;
  setWishlist: Dispatch<SetStateAction<ProductCardDataProps[]>>;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(undefined);

const getInitialWishlist = (): ProductCardDataProps[] => {
  const savedWishlist = localStorage.getItem("wishlist");
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<ProductCardDataProps[]>(getInitialWishlist);

  // Sync wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
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
