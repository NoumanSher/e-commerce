import React, { useCallback } from "react";
import { OrderStatus } from "../../types/orderStatusDto";

interface OrderStepperProps {
  orderStatusHistory: OrderStatus[];
}

const OrderStepper: React.FC<OrderStepperProps> = ({ orderStatusHistory }) => {
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "INVALID DATE";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).toUpperCase();
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "INVALID TIME";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const getStatusStyles = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { dotColor: "bg-green-500", textColor: "text-green-600" };
      case "shipped":
        return { dotColor: "bg-blue-500", textColor: "text-blue-600" };
      case "pending":
        return { dotColor: "bg-yellow-500", textColor: "text-yellow-600" };
      case "cancelled":
        return { dotColor: "bg-red-500", textColor: "text-red-600" };
      case "processing":
        return { dotColor: "bg-purple-500", textColor: "text-purple-600" };
      default:
        return { dotColor: "bg-gray-500", textColor: "text-gray-600" };
    }
  }, []);

  if (!orderStatusHistory?.length) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No order status history available
      </div>
    );
  }

  return (
    <div className="w-full max-w-md lg:pr-0">
      <ul className="space-y-8 relative">
        {/* Main vertical line */}
        <div className="absolute hidden lg:block left-[7px] top-[40px] bottom-[20px] w-[2px] bg-slate-200 z-0" />

        {orderStatusHistory.map((step, index) => {
          const { dotColor, textColor } = getStatusStyles(step.status);
          const prevDate = index > 0 
            ? new Date(orderStatusHistory[index - 1].updatedAt).toDateString()
            : null;
          const currentDate = new Date(step.updatedAt).toDateString();
          const showDate = index === 0 || currentDate !== prevDate;

          return (
            <li key={step._id} className="relative z-10">
              {showDate && (
                <div className="font-semibold text-sm leading-[20px] text-gray-500 mb-4 pl-6">
                  {formatDate(step.updatedAt)}
                </div>
              )}

              <div className="flex items-start relative">
                {/* Status dot */}
                <div
                  className={`w-4 h-4 rounded-full flex-shrink-0 ${dotColor} 
                    mr-4 mt-[3px] relative z-10 border-2 border-white shadow-sm`}
                  aria-hidden="true"
                />
                
                {/* Status content */}
                <div className="pb-8">
                  <span
                    className={`font-semibold text-sm ${textColor} block mb-1`}
                    title={step.statusDesc}
                    aria-label={`Status: ${step.statusDesc}`}
                    role="status"
                  >
                    {step.statusDesc}
                  </span>
                  <p className="font-normal text-sm text-gray-500">
                    {formatTime(step.updatedAt)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderStepper;