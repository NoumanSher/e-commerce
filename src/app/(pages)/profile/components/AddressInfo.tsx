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
  <div className="bg-white border border-gray-200 w-full p-8 rounded-lg shadow-sm flex flex-col justify-center h-full min-h-[250px]">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 bg-gray-100 rounded-md">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900">
        Delivery Address
      </h2>
    </div>
    
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
        <p className="text-sm font-medium text-gray-900">{name}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Address</p>
        <p className="text-sm text-gray-700">{address}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm text-gray-700 truncate" title={email}>{email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
          <p className="text-sm text-gray-700">{phone}</p>
        </div>
      </div>
    </div>
  </div>
);
AddressInfo.displayName = "AddressInfo";
export default AddressInfo;
