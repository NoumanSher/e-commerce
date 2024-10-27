import { PiShareNetworkThin } from "react-icons/pi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import React from "react";

const SocialMediaShare: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768); // Initial state based on window width

  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile((prev) => (prev !== isMobileScreen ? isMobileScreen : prev));
    };

    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleOpen = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev); // Toggle open only on mobile
    }
  };

  return (
    <HoverCard openDelay={100} open={isMobile ? isOpen : undefined}>
      <HoverCardTrigger className="group cursor-pointer" onClick={toggleOpen}>
        <div className="flex gap-x-2 items-center pb-2">
          <PiShareNetworkThin
            className="group-hover:text-rose-800"
            size={20}
            title="share with your love"
          />
          <p className="uppercase group-hover:text-rose-800 text-sm font-medium">
            share
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col w-32">
        <a href="http://" className="hover:text-rose-800">
          Facebook
        </a>
        <a href="http://" className="hover:text-rose-800">
          Twitter
        </a>
        <a href="http://" className="hover:text-rose-800">
          Linkedin
        </a>
        <a href="http://" className="hover:text-rose-800">
          Pinterest
        </a>
      </HoverCardContent>
    </HoverCard>
  );
};
SocialMediaShare.displayName = "SocialMediaShare";

export default React.memo(SocialMediaShare);
