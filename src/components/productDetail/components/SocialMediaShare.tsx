import React, { useEffect, useState } from "react";
import { Share, MessageCircle } from "lucide-react";
import { PiShareNetworkThin } from "react-icons/pi";
import { toast } from "react-toastify";
interface SocialMediaShareProps {
  url?: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({ url = "" }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const encodedUrl = encodeURIComponent(url);

  const handleFacebookClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    setOpen(false);
  };

  const handleInstagramClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard for Instagram sharing!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-40 space-y-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded hover:text-rose-800 hover:bg-gray-50 transition-colors"
        onClick={handleFacebookClick}
      >
        <Share size={16} /> Facebook
      </a>

      <button
        onClick={handleInstagramClick}
        className="flex items-center gap-2 p-2 rounded hover:text-rose-800 hover:bg-gray-50 transition-colors w-full text-left"
      >
        <MessageCircle size={16} /> Instagram (Copy Link)
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="relative">
        <div
          className="flex gap-x-2 items-center pb-2 cursor-pointer group"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <PiShareNetworkThin
            className="group-hover:text-rose-800 transition-colors"
            size={20}
          />
          <p className="uppercase group-hover:text-rose-800 text-sm font-medium transition-colors">
            share
          </p>
        </div>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-full left-0 z-20 mt-1">
              {shareOptions}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex gap-x-2 items-center pb-2 cursor-pointer group">
        <PiShareNetworkThin
          className="group-hover:text-rose-800 transition-colors"
          size={20}
        />
        <p className="uppercase group-hover:text-rose-800 text-sm font-medium transition-colors">
          share
        </p>
      </div>

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1">{shareOptions}</div>
      )}
    </div>
  );
};

export default SocialMediaShare;
