import Table from "@/components/ui/table";
import CartTotal from "@/components/CartTotal";

interface ShoppingBagProps {
  checkValidation: (discountAmount?: number) => void;
}

export default function ShoppingBag({ checkValidation }: ShoppingBagProps) {
  return (
    <div className="flex lg:flex-row flex-col  gap-8 lg:pt-6  p-0 ">
      <div className="lg:w-[70%] w-full">
        <Table />
      </div>
      <div className="lg:w-[30%] w-full">
        <CartTotal checkValidation={checkValidation} />
      </div>
    </div>
  );
}
