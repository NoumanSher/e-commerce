import React from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileDrawerProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  categoriesData: any[];
  expanded: string | null;
  handleParentCategoryClick: (categorySlug: string, hasChildren: boolean) => void;
  selectedChildCategory: string | null;
  childCategoryID: string | null;
  allCategories: any;
  handleChildCategoryClick: (childSlug: string, parentSlug?: string) => void;
}

export default function MobileDrawer({
  mobileOpen,
  setMobileOpen,
  categoriesData,
  expanded,
  handleParentCategoryClick,
  selectedChildCategory,
  childCategoryID,
  allCategories,
  handleChildCategoryClick,
}: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-50 bg-white w-72 shadow-2xl p-5 md:hidden flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">Browse Categories</h2>
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto -mx-1 px-1">
              {categoriesData.map((cat) => (
                <div key={cat._id} className="mb-1">
                  <button
                    className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                      ${
                        expanded === cat.slug
                          ? "bg-gray-100 text-black"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    onClick={() => {
                      const hasChildren = (cat.children?.length ?? 0) > 0;
                      handleParentCategoryClick(cat.slug, hasChildren);
                      if (!hasChildren) {
                        setMobileOpen(false); // UX: Close drawer if there are no children to show
                      }
                    }}
                  >
                    <span>{cat.name}</span>
                    {(cat.children?.length ?? 0) > 0 && (
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          expanded === cat.slug ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {expanded === cat.slug && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden ml-3 mt-0.5 border-l-2 border-gray-300 pl-3"
                      >
                        {cat.children?.map((child: any) => (
                          <div
                            key={child._id}
                            className={`py-2 px-2 cursor-pointer text-sm rounded-md transition-all duration-150
                              ${
                                (selectedChildCategory || childCategoryID) === child.slug
                                  ? "text-black font-semibold bg-gray-100"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                            onClick={() => {
                              setMobileOpen(false);
                              // Find this child's parent slug to keep accordion open
                              const parentSlug = allCategories?.categories?.find((c: any) =>
                                c.children?.some((ch: any) => ch.slug === child.slug)
                              )?.slug;
                              handleChildCategoryClick(child.slug, parentSlug);
                            }}
                          >
                            {child.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
