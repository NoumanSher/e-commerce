import { PiShareNetworkThin } from "react-icons/pi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const SocialMediaShare: React.FC = () => {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger className="group cursor-pointer">
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

export default SocialMediaShare;
