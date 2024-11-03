// layout.tsx
import React from 'react';
import Sidebar from './components/Sidebar';

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex px-40 py-5 shadow">
    <Sidebar />
    <main className="flex-1 p-6 bg-gray-50 rounded-e-lg">
      {children}
    </main>
  </div>
);

export default ProfileLayout;
