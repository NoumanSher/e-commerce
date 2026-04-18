import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DesktopSidebarProps {
  allCategoriesLoading: boolean;
  categoriesData: any[];
  expanded: string | null;
  handleParentCategoryClick: (categorySlug: string, hasChildren: boolean) => void;
  selectedChildCategory: string | null;
  handleChildCategoryClick: (childCategorySlug: string) => void;
}

export default function DesktopSidebar({
  allCategoriesLoading,
  categoriesData,
  expanded,
  handleParentCategoryClick,
  selectedChildCategory,
  handleChildCategoryClick,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-gray-50/60">
      <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 px-2">
          Browse
        </h2>

        {/* Sidebar Skeleton */}
        {allCategoriesLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          [...categoriesData].reverse().map((cat) => (
            <div key={cat._id} className="mb-1">
              <button
                className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${
                    expanded === cat.slug
                      ? "bg-gray-100 text-black"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() =>
                  handleParentCategoryClick(cat.slug, (cat.children?.length ?? 0) > 0)
                }
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
                        className={`py-1.5 px-2 cursor-pointer text-sm rounded-md transition-all duration-150
                          ${
                            selectedChildCategory === child.slug
                              ? "text-black font-semibold bg-gray-100"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        onClick={() => handleChildCategoryClick(child.slug)}
                      >
                        {child.name}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
