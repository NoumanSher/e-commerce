// AddressInfo.tsx
import React from 'react';
interface AddressProps {
  name: string;
  address: string;
  email: string;
  phone: string;
}
const AddressInfo: React.FC<AddressProps> = ({name,address,email,phone}) => (
  <div className="w-2/4 p-6 bg-white rounded-lg shadow-md text-start flex flex-col gap-y-2">
    <h2 className="text-lg font-semibold">Delivery Address</h2>
    <p className="text-gray-700">{name}</p>
    <p className="text-gray-700">{address}</p>
    <p className="text-gray-700">{email}</p>
    <p className="text-gray-700">{phone}</p>
    <p className="text-blue-500 underline cursor-pointer mt-2">Edit Address</p>
  </div>
);
AddressInfo.displayName = 'AddressInfo'
export default AddressInfo;
