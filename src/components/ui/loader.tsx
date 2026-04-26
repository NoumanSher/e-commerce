import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "white" | "black" | "current";
}

const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = "md", 
  variant = "current" 
}) => {
  const sizeClasses = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[2.5px]",
    lg: "w-10 h-10 border-[3.5px]",
  };

  const variantClasses = {
    white: "border-white/10 border-t-white",
    black: "border-black/10 border-t-black",
    current: "border-current/10 border-t-current",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer spinning ring with a subtle glow */}
      <div
        className={cn(
          "rounded-full animate-spin transition-all duration-500 ease-in-out",
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{
          filter: "drop-shadow(0 0 2px rgba(255,255,255,0.1))"
        }}
      />
      {/* Inner pulsing ring for depth */}
      <div 
        className={cn(
          "absolute rounded-full animate-pulse transition-all duration-700",
          size === "xs" ? "w-1.5 h-1.5 border-[1px]" : 
          size === "sm" ? "w-2.5 h-2.5 border-[1.5px]" : 
          size === "md" ? "w-3.5 h-3.5 border-[2px]" : "w-6 h-6 border-[2.5px]",
          variant === "white" ? "border-white/40" : 
          variant === "black" ? "border-black/30" : "border-current/30"
        )}
      />
    </div>
  );
};

export default Loader;
