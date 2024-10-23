import { Button } from "@/components/ui/button";

interface CheckOutBtnProps {
  className?: string;
  onClick?: () => void; // Optional onClick handler
}

export default function CheckOutBtn({ className, onClick }: CheckOutBtnProps) {
  return (
    <Button
      onClick={onClick}
      className={`${className} rounded-none shadow-none bg-opacity-95 bg-black border-0 h-14 w-[50%] uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black`}
    >
      <p className="text-[14px] font-semibold leading-[1.72] group-hover:text-black">
        Proceed to CheckOut
      </p>
    </Button>
  );
}
