'use client'
import { StoreProvider } from '@/context/storeContext';

const StoreProviderWrapper = ({ children }:any) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default StoreProviderWrapper;