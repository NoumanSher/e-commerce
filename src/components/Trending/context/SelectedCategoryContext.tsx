// context/SelectedCategoryContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SelectedCategoryContextType {
  selectedCategory: string | null;
  updateSelectedCategory: (categoryId: string) => void;
}

interface SelectedCategoryProviderProps {
  children: ReactNode; // This is important to define the children prop type
}

const SelectedCategoryContext = createContext<SelectedCategoryContextType | undefined>(undefined);

export const SelectedCategoryProvider: React.FC<SelectedCategoryProviderProps> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load the selected category from localStorage on initial render
  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  // Function to update the selected category and store it in localStorage
  const updateSelectedCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    localStorage.setItem('selectedCategory', categoryId); // Save to localStorage
  };

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategory, updateSelectedCategory }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};

// Custom hook to access the context
export const useSelectedCategory = () => {
  const context = useContext(SelectedCategoryContext);
  if (!context) {
    throw new Error('useSelectedCategory must be used within a SelectedCategoryProvider');
  }
  return context;
};
