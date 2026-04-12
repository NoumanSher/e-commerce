// ProfileInfo.tsx
import React from 'react';
import { ProfileInfoProps } from '../types/profileTypes';
import profileAvatar from '@/assets/img/profileAvatar.jpg';
import Image from 'next/image';
const ProfileInfo: React.FC<ProfileInfoProps> = ({ name }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 w-full rounded-lg shadow-sm text-center h-full min-h-[250px]">
    <div className="w-24 h-24 bg-gray-100 rounded-full mb-5 overflow-hidden border border-gray-200 flex-shrink-0">
      <Image src={profileAvatar} alt='avatar' className="w-full h-full object-cover" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">{name}</h2>
    <p className="text-sm font-medium text-gray-500 mt-1">Customer</p>
  </div>
);

export default ProfileInfo;
