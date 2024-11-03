// ProfileInfo.tsx
import React from 'react';
import { ProfileInfoProps } from '../types/profileTypes';

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name }) => (
  <div className="flex flex-col items-center p-6 bg-white w-[50%] rounded-lg shadow-md text-center gap-x-2">
    <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div> {/* Placeholder for profile picture */}
    <h2 className="text-lg font-semibold">{name}</h2>
    <p className="text-gray-500">Customer</p>
    <p className="text-blue-500 underline cursor-pointer mt-2">Edit Profile</p>
  </div>
);

export default ProfileInfo;
