"use client";
import ImageGallerySkeleton from "./ImageGallerySkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="flex  flex-col lg:flex-row lg:p-8 p-4  container mx-auto">
      <ImageGallerySkeleton />

      <div className="lg:px-8 pt-2 lg:w-[40%]  w-full">
        <Skeleton className="w-[30%] h-[30px] " />
        <div className="mt-8">
          <Skeleton className="w-[100%] h-[20px] " />
          <Skeleton className="w-[100%] h-[20px] mt-3" />
          <Skeleton className="w-[100%] h-[20px] mt-3" />
        </div>
        <Skeleton className="w-[20%] h-[30px] mt-5" />
        <div className="mt-8">
          <Skeleton className="w-[100%] h-[20px] " />
          <Skeleton className="w-[100%] h-[20px] mt-4" />
          <Skeleton className="w-[100%] h-[20px] mt-4" />
          <Skeleton className="w-[100%] h-[20px] mt-4" />
          <Skeleton className="w-[100%] h-[20px] mt-4" />
          <Skeleton className="w-[100%] h-[20px] mt-4" />
        </div>
        <div className="mt-4 flex gap-4">
          <Skeleton className="w-[30%] h-[60px] " />
          <Skeleton className="w-[50%] h-[60px]" />
        
        </div>

      </div>
    </div>
  );
};
export default ProductDetailSkeleton;
