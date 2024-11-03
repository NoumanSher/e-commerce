// OrderStatusTimeline.tsx
import React from 'react';

const OrderStatusTimeline: React.FC<{ statuses: { date: string; time: string; status: string }[] }> = ({ statuses }) => (
  <div className="mt-4">
    {statuses.map((status, index) => (
      <div key={index} className="flex items-center mb-2">
        <span className="mr-2">•</span>
        <div>
          <p>{status.status}</p>
          <span className="text-sm text-gray-500">{status.date} • {status.time}</span>
        </div>
      </div>
    ))}
  </div>
);

export default OrderStatusTimeline;
