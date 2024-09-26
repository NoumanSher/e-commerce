'use client'
import { StoreProvider } from '@/Context/storeContext';

const StoreProviderWrapper = ({ children }:any) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default StoreProviderWrapper;