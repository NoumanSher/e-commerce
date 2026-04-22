import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectVarientProps {
  availableColors: string[];
  availableSizes: string[];
  selectedColor: string;
  selectedSize: string;
  variants: any[];
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  validation: { colorRequired: boolean; sizeRequired: boolean };
  setValidation: React.Dispatch<
    React.SetStateAction<{ colorRequired: boolean; sizeRequired: boolean }>
  >;
}

const SelectColorAndSize: React.FC<SelectVarientProps> = React.memo(
  ({
    availableColors,
    availableSizes,
    selectedColor,
    selectedSize,
    variants,
    setSelectedColor,
    setSelectedSize,
    validation,
    setValidation,
  }) => {
    // Helper to check if a color is Sold Out across all sizes
    const isColorSoldOut = (color: string) => {
      const colorVariants = variants?.filter(v => v.name.toLowerCase().includes(color.toLowerCase().trim()));
      return colorVariants?.length > 0 && colorVariants.every(v => v.stock <= 0);
    };

    // Helper to check if a size is Sold Out for the currently selected color
    const isSizeSoldOut = (size: string) => {
      if (availableColors.length > 0 && selectedColor) {
        // Find specific combination
        const comboName = `${selectedColor.trim()} - ${size.trim()}`;
        const variant = variants?.find(v => v.name === comboName);
        return variant ? variant.stock <= 0 : true;
      }
      // If no color selected yet, check if this size is Sold Out across ALL colors
      const sizeVariants = variants?.filter(v => v.name.toLowerCase().includes(size.toLowerCase().trim()));
      return sizeVariants?.length > 0 && sizeVariants.every(v => v.stock <= 0);
    };
    const handleChangeColor = useCallback(
      (e: string) => {

        setSelectedColor(e ?? "");
        setValidation((prev) => ({ ...prev, colorRequired: false }));
      },
      [setSelectedColor, setValidation]
    );

    const handleChangeSize = useCallback(
      (e: string) => {
        setSelectedSize(e ?? "");
        setValidation((prev) => ({ ...prev, sizeRequired: false }));
      },
      [setSelectedSize, setValidation]
    );

    return (
      <div id='select-varient' className="flex mb-4 gap-3 px-3 lg:px-0">
        {availableColors.length > 0 && (
          <div className="flex-1">
            <Select onValueChange={handleChangeColor}>
              <SelectTrigger className="h-12 lg:h-14 rounded-lg lg:rounded-none hover:shadow-md">
                <SelectValue
                  placeholder={
                    <p className="text-sm lg:text-base font-normal">Select Color</p>
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-lg lg:rounded-none">
                <SelectGroup>
                  <SelectLabel>Color</SelectLabel>
                   {availableColors.map((color, index) => {
                    const soldOut = isColorSoldOut(color);
                    return (
                     <SelectItem key={index} value={color} disabled={soldOut}>
                       <p className={`text-sm lg:text-base font-normal ${soldOut ? 'text-gray-400 line-through' : ''}`}>
                         {color} {soldOut ? '(Sold Out)' : ''}
                       </p>
                     </SelectItem>
                    );
                   })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {validation.colorRequired && (
              <span className="text-xs lg:text-[14px] leading-5 font-semibold text-[#EF0505]">
                *Color required
              </span>
            )}
          </div>
        )}
        {availableSizes.length > 0 && (
          <div className="flex-1">
            <Select onValueChange={handleChangeSize} value={selectedSize}>
              <SelectTrigger className="h-12 lg:h-14 rounded-lg lg:rounded-none hover:shadow-md">
                <SelectValue
                  placeholder={
                    <p className="text-sm lg:text-base font-normal">Select Size</p>
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-lg lg:rounded-none">
                <SelectGroup>
                  <SelectLabel>Size</SelectLabel>
                   {availableSizes.map((size, index) => {
                    const soldOut = isSizeSoldOut(size);
                    return (
                      <SelectItem key={index} value={size} disabled={soldOut}>
                        <p className={`text-sm lg:text-base font-normal ${soldOut ? 'text-gray-400 line-through' : ''}`}>
                          {size} {soldOut ? '(Sold Out)' : ''}
                        </p>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            {validation.sizeRequired && (
              <span className="text-xs lg:text-[14px] leading-5 font-semibold text-[#EF0505]">
                *Size required
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
SelectColorAndSize.displayName = "SelectColorAndSize";

export default SelectColorAndSize;
