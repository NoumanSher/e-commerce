import { createContext, useState, useContext, ReactNode } from "react";

interface StoreContextProps {
  isCartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
}

const StoreTypeContext = createContext<StoreContextProps | undefined>(
  undefined
);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <StoreTypeContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </StoreTypeContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreTypeContext);
  if (!context) {
    throw new Error("useStoreType must be used within a StoreContextProvider");
  }
  return context;
};
