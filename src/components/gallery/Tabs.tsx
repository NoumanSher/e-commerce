// components/Tabs.tsx
import { useState } from 'react';

const tabs = ['Delivery and Return', 'Shipping Information', 'Composition and Care'];

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  return (
    <div className="mt-8">
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'Delivery and Return' && <p>Delivery and return details here.</p>}
        {activeTab === 'Shipping Information' && <p>Shipping information here.</p>}
        {activeTab === 'Composition and Care' && <p>Composition and care info here.</p>}
      </div>
    </div>
  );
};

export default Tabs;
