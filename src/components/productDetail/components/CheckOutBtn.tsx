import { Button } from "@/components/ui/button";

interface CheckOutBtnProps {
  className?: string;
  availableStock?: number;
  selectedQuantity?: number;
  onClick?: () => void; // Optional onClick handler
  loading?: boolean;
}

export default function CheckOutBtn({
  className,
  onClick,
  availableStock,
  selectedQuantity,
  loading,
}: CheckOutBtnProps) {
  return (
    <Button
      disabled={availableStock === 0 || selectedQuantity === 0}
      onClick={onClick}
      loading={loading}
      className={`${className}  rounded-none shadow-none bg-opacity-95 bg-black border-0 h-14  uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black`}
    >
      <p className="text-[14px] font-semibold group-hover:text-black">
        {availableStock === 0 ? "Sold Out" : "Buy Now"}
      </p>
    </Button>
  );
}
