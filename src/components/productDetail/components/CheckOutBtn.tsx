import { Button } from "@/components/ui/button";

interface CheckOutBtnProps {
  className?: string;
  availableStock?: number;
  selectedQuantity?: number;
  onClick?: () => void; // Optional onClick handler
}

export default function CheckOutBtn({
  className,
  onClick,
  availableStock,
  selectedQuantity,
}: CheckOutBtnProps) {
  return (
    <Button
      disabled={availableStock === 0 || selectedQuantity === 0}
      onClick={onClick}
      className={`${className}  rounded-none shadow-none bg-opacity-95 bg-black border-0 h-14  uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black`}
    >
      <p className="text-[14px] font-semibold leading-[1.72] group-hover:text-black">
        Buy Now
      </p>
    </Button>
  );
}
