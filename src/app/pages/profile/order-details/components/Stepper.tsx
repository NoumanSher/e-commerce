import React from "react";
import { OrderStatus } from "../../types/orderStatusDto";

interface OrderStepperProps {
  orderStatusHistory: OrderStatus[];
}

const OrderStepper: React.FC<OrderStepperProps> = ({ orderStatusHistory }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long" as const, 
      day: "2-digit" as const, 
      month: "long" as const 
    };
    return date.toLocaleDateString(undefined, options).toUpperCase();
  };
  

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const options = { hour: "2-digit" as const, minute: "2-digit" as const, hour12: true };
    return date.toLocaleTimeString(undefined, options);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return { dotColor: "bg-green-500", textColor: "text-green-600" };
      case "Cancelled":
        return { dotColor: "bg-red", textColor: "text-red" };
      default:
        return { dotColor: "bg-[#203F6B]", textColor: "text-[#6B7280]" };
    }
  };
  return (
    <div className={`w-full max-w-md  lg:pr-0  `}>
      <ul className="space-y-6 relative">
        {orderStatusHistory.map((step, index) => {
          const { dotColor, textColor } = getStatusStyles(step.status);

          return (
            <li  key={step._id} className="relative">
              {/* Vertical Line for large screens */}
              {index !== orderStatusHistory.length - 1 && (
                <div
                  className={`hidden lg:block absolute left-[3px]  ${
                    index === 0 ? "top-[52px] !h-[3.25rem]" : "top-[20px]"
                  } h-full w-[2px] bg-slate-500 z-0`}
                ></div>
              )}

              {/* Date */}
              {(index === 0 ||
                formatDate(step.updatedAt) !==
                  formatDate(orderStatusHistory[index - 1]?.updatedAt)) && (
                <div className={`font-semibold text-[14px]   leading-[20px] text-[#6B7280]`}>
                  {formatDate(step.updatedAt)}
                </div>
              )}

              <div className="flex items-start mt-3 relative z-10">
                {/* Dot */}
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} mr-4  mt-[8px] relative z-10`}
                ></div>

                {/* Status and Time */}
                <div>
                  <span
                    className={`font-semibold text-[14px] leading-[16.94px] ${textColor}`}
                    title={step.statusDesc} // Tooltip implementation
                  >
                    {step.statusDesc}
                  </span>
                  <p className="font-normal mt-2 text-[14px] leading-[16.94px] text-[#6B7280]">
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
