// layout.tsx
import React from 'react';
import Sidebar from './components/Sidebar';

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col lg:flex-row 2xl:px-40 xl:px-32 py-5 shadow">
    <Sidebar />
    <main className="lg:w-[80%] px-6 bg-gray-50 rounded-e-lg border-2 border-blue-500">
      {children}
    </main>
  </div>
);

export default ProfileLayout;
