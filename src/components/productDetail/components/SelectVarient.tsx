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
    setSelectedColor,
    setSelectedSize,
    validation,
    setValidation,
  }) => {
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
      <div className="flex mb-6 gap-3">
        <div className="flex-1">
          <Select onValueChange={handleChangeColor}>
            <SelectTrigger className="h-14 rounded-none hover:shadow-md">
              <SelectValue
                placeholder={
                  <p className="text-base font-normal">Select Color</p>
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectGroup>
                <SelectLabel>Color</SelectLabel>
                {availableColors.map((color, index) => (
                  <SelectItem key={index} value={color}>
                    <p className="text-base font-normal">{color}</p>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {validation.colorRequired && (
            <span className="text-[14px] leading-5 font-semibold text-[#EF0505]">
              *Color required
            </span>
          )}
        </div>
        <div className="flex-1">
          <Select onValueChange={handleChangeSize}>
            <SelectTrigger className="h-14 rounded-none hover:shadow-md">
              <SelectValue
                placeholder={
                  <p className="text-base font-normal">Select Size</p>
                }
              />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectGroup>
                <SelectLabel>Size</SelectLabel>
                {availableSizes.map((size, index) => (
                  <SelectItem key={index} value={size}>
                    <p className="text-base font-normal">{size}</p>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {validation.sizeRequired && (
            <span className="text-[14px] leading-5 font-semibold text-[#EF0505]">
              *Size required
            </span>
          )}
        </div>
      </div>
    );
  }
);
SelectColorAndSize.displayName = "SelectColorAndSize";

export default SelectColorAndSize;
