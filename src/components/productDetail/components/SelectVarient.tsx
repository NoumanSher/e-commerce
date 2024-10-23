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
}

export default function SelectColorAndSize({
  availableColors,
  availableSizes,
  setSelectedColor,
  setSelectedSize,
}: SelectVarientProps) {
  return (
    <div className="flex justify-between mb-6 gap-3">
      <Select onValueChange={setSelectedColor}>
        <SelectTrigger className="flex-1 h-14 rounded-none hover:shadow-md">
          <SelectValue
            placeholder={<p className="text-base font-normal">Select Color</p>}
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

      <Select onValueChange={setSelectedSize}>
        <SelectTrigger className="flex-1 h-14 rounded-none hover:shadow-md">
          <SelectValue
            placeholder={<p className="text-base font-normal">Select Size</p>}
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
    </div>
  );
}
