// layout.tsx
import React from 'react';
import Sidebar from './components/Sidebar';

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col lg:flex-row container  mx-auto py-5 ">
    <Sidebar />
    <main className="lg:w-[80%] px-4 lg:bg-gray-50 rounded-e-lg">
      {children}
    </main>
  </div>
);

export default ProfileLayout;
