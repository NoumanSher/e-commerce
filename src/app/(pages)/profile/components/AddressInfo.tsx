// AddressInfo.tsx
import React from "react";
interface AddressProps {
  name: string;
  address: string;
  email: string;
  phone: string;
}
const AddressInfo: React.FC<AddressProps> = ({
  name,
  address,
  email,
  phone,
}) => (
  <div className="bg-card lg:w-[50%] w-full text-card-foreground p-4 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold text-primary mb-3">
      Delivery Address
    </h2>
    <h2 className="text-lg text-muted-foreground mb-3">{name}</h2>
    <p className="text-sm text-muted-foreground mb-3">{address}</p>
    <p className="text-sm text-muted-foreground mb-3">{email}</p>
    <p className="text-sm text-muted-foreground mb-4">{phone}</p>
    {/* <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80">
      Edit
    </button> */}
  </div>
);
AddressInfo.displayName = "AddressInfo";
export default AddressInfo;
