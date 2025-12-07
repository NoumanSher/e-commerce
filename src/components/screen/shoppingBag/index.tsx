import Tabel from "@/components/ui/tabel";
import CartTotal from "@/components/CartTotal";
 

interface ShoppingBagProps {
  checkValidation: any
}

export default function ShoppingBag({checkValidation}:ShoppingBagProps) {
  return (
    <div className="flex lg:flex-row flex-col  gap-8 lg:pt-6  p-0 ">
      <div className="lg:w-[70%] w-full">
        <Tabel  />
      </div>
      <div className="lg:w-[30%] w-full">
        <CartTotal checkValidation={checkValidation}/>
      </div>
    </div>
  );
}
