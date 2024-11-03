// OrderSummary.tsx
import React from 'react';

const OrderSummary: React.FC<{ orderId: string; paymentMethod: string; subtotal: string; delivery: string; total: string }> = ({ orderId, paymentMethod, subtotal, delivery, total }) => (
  <div className="p-4 border rounded-lg w-2/4">
    <p>OrderId: <span className="font-semibold">{orderId}</span></p>
    <p>Payment Method: <span className="font-semibold">{paymentMethod}</span></p>
    <p>Subtotal: <span className="font-semibold">{subtotal}</span></p>
    <p>Delivery: <span className="font-semibold">{delivery}</span></p>
    <p>Total: <span className="font-semibold">{total}</span></p>
  </div>
);

export default OrderSummary;
