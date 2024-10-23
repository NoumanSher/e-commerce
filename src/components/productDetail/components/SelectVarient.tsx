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
  colorRequired: boolean;
  sizeRequired: boolean;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setColorRequired: React.Dispatch<React.SetStateAction<boolean>>;
  setSizeRequired: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectColorAndSize({
  availableColors,
  availableSizes,
  setSelectedColor,
  setSelectedSize,
  colorRequired,
  sizeRequired,
  setColorRequired,
  setSizeRequired
}: SelectVarientProps) {


  const handleChangeColor = (e:any) => {
    debugger
    setSelectedColor(e ?? '')
    setColorRequired(false)

  }
  const handleChangeSize = (e:any) => {
    debugger
    setSelectedSize(e ?? '')
    setSizeRequired(false)

  }
  return (
    <div className="flex  mb-6 gap-3">
      <div className="flex-1">
        <Select onValueChange={(e) => handleChangeColor(e)}>
          <SelectTrigger className=" h-14 rounded-none hover:shadow-md">
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
        {colorRequired && (
          <span className="text-[14px] leading-5 font-semibold text-[#EF0505]">
            *Color required
          </span>
        )}
      </div>
      <div className="flex-1">
        <Select onValueChange={(e) => handleChangeSize(e)}>
          <SelectTrigger className=" h-14 rounded-none hover:shadow-md">
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
        {sizeRequired && (
          <span className="text-[14px] leading-5 font-semibold text-[#EF0505]">
            *Size required
          </span>
        )}
      </div>
    </div>
  );
}
