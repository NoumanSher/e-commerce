import Tabel from "@/components/ui/tabel";
import CartTotal from "@/components/CartTotal";
import P1 from "@/assets/img/P4.jpg";
import P2 from "@/assets/img/P5.jpg";
// import P3 from "@/assets/img/P6.jpg";

interface ShoppingBagProps {
  checkValidation: any
}
// const products = [
//   {
//     id: 1,
//     imageUrl: P1.src,
//     name: 'Summer Dress Women Short Sleeve',
//     price: 75.00,
//     quantity: 1,
//   },
//   {
//     id: 2,
//     imageUrl: P2.src,
//     name: 'Women’s Sleeve Fully Beaded Gown',
//     price: 60.00,
//     quantity: 1,
//   },
// ];
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
