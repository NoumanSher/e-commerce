import img from '../img/money-back.png'
import img1 from "../img/24-hours-support.png"
import img2 from '../img/delivery.png'
import Image from "next/image";

// DeliveryIcon Component
export const DeliveryIcon = () => {
  return (
    <div>
       <Image src={img2} alt="Money Back Guarantee" style={{ width: '50px', height: '50px' }} />
    </div>
  );
};

// ServiceIcon Component
export const ServiceIcon = () => {
  return (
    <div>
     <Image src={img1} alt="Money Back Guarantee" style={{ width: '50px', height: '50px' }} />
    </div>
  );
};
// MoneyBackGuaranteeIcon Component
export const MoneyBackGuaranteeIcon = () => {
  return (
    <div>
      <Image src={img} alt="Money Back Guarantee" style={{ width: '50px', height: '50px' }} />
    </div>
  );
};



