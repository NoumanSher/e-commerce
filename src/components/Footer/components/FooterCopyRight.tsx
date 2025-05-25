import { FooterCopyRightData } from "@/data/data";
import React from "react";

export default function FooterCopyRight() {
  return (
    <div>
      <div className="border-t border-t-[#cfcdcd] text-center py-4">
        <p className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Blazlogic. All rights reserved.
        </p>
      </div>
    </div>
  );
}
