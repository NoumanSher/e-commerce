// OrderSummary.tsx
import React from 'react';

const OrderSummary: React.FC<{ orderId: string; paymentMethod: string; subtotal: string; delivery: string; total: string }> = ({ orderId, paymentMethod, subtotal, delivery, total }) => (
  <div className=" lg:w-[50%] w-full p-4 bg-card rounded-lg shadow-md">
    <h2 className="text-lg font-semibold text-primary mb-4">Order Summary</h2>
        <div className="mb-2 flex justify-between">
          <span className="text-muted-foreground font-medium">ORDER ID:</span>
          <span className="font-semibold text-foreground">#4152</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="text-muted-foreground font-medium">PAYMENT METHOD:</span>
          <span className="font-semibold text-foreground">K Net</span>
        </div>
        <div className="border-t border-border my-4"></div>
        <div className="mb-2 flex justify-between">
          <span className="text-muted-foreground font-medium">Subtotal:</span>
          <span className="font-semibold text-foreground">365.00KWD</span>
        </div>
   
        <div className="mb-2 flex justify-between">
          <span className="text-muted-foreground font-medium">Delivery:</span>
          <span className="font-semibold text-foreground">Free</span>
        </div>
        <div className="border-t border-border my-4"></div>
        <div className="mb-2 flex justify-between">
          <span className="text-muted-foreground font-medium">Total:</span>
          <span className="font-semibold text-primary">84.00KWD</span>
        </div>
      </div>
);

export default OrderSummary;

