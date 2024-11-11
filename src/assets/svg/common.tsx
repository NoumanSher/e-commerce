import React from "react";
import Image from "next/image";
import img from "../img/money-back.png";
import img1 from "../img/24-hours-support.png";
import img2 from "../img/delivery.png";
import { FaFacebookF, FaPinterest, FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { BsYoutube } from "react-icons/bs";
import Search from "@/assets/svg/search.svg";
import Heart from "@/assets/svg/heart.svg";
import ProfileAvatar from "@/assets/svg/profileAvatar.svg";
import Cart from "@/assets/svg/cart.svg";
import Link from "next/link";
// DeliveryIcon Component
// eslint-disable-next-line react/display-name
export const DeliveryIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img2}
        priority={true}
        loading="eager"
        alt="Delivery"
        width={50}
        height={50}
        style={{ width: "50px", height: "50px" }}
      />
    </div>
  );
});

// ServiceIcon Component
// eslint-disable-next-line react/display-name
export const ServiceIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img1}
        priority={true}
        loading="eager"
        alt="24 Hours Support"
        style={{ width: "50px", height: "50px" }}
      />
    </div>
  );
});

// MoneyBackGuaranteeIcon Component
// eslint-disable-next-line react/display-name
export const MoneyBackGuaranteeIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img}
        priority={true}
        loading="eager"
        alt="Money Back Guarantee"
        style={{ width: "50px", height: "50px" }}
      />
    </div>
  );
});

// FaFacebookFIcon Component
// eslint-disable-next-line react/display-name
export const FaFacebookFIcon = React.memo(() => {
  return (
    <div>
      <FaFacebookF />
    </div>
  );
});

// FaTwitterIcon Component
// eslint-disable-next-line react/display-name
export const FaTwitterIcon = React.memo(() => {
  return (
    <div>
      <FaTwitter />
    </div>
  );
});

// IoLogoInstagramIcon Component
// eslint-disable-next-line react/display-name
export const IoLogoInstagramIcon = React.memo(() => {
  return (
    <div>
      <IoLogoInstagram />
    </div>
  );
});

// BsYoutubeIcon Component
// eslint-disable-next-line react/display-name
export const BsYoutubeIcon = React.memo(() => {
  return (
    <div>
      <BsYoutube />
    </div>
  );
});

// FaPinterestIcon Component
// eslint-disable-next-line react/display-name
export const FaPinterestIcon = React.memo(() => {
  return (
    <div>
      <FaPinterest />
    </div>
  );
});
interface IconProps {
  className?: string;
}
interface ProfileIconProps {
  className?: string;
  onClick?: () => void;
}
export const SearchIcon: React.FC<IconProps> = React.memo(({ className }) => (
  <Image src={Search} alt="Search Icon" className={className} />
));
SearchIcon.displayName = "SearchIcon";

export const HeartIcon: React.FC<IconProps> = React.memo(({ className }) => (
  <Link href={"/pages/wish-list"}>
    <Image src={Heart} alt="heart Icon" className={className} />
  </Link>
));
HeartIcon.displayName = "HeartIcon";

export const ProfileAvatarIcon: React.FC<ProfileIconProps> = React.memo(
  ({ className, onClick }) => (
    <Image
      src={ProfileAvatar}
      alt="profile Avatar Icon"
      className={className}
      onClick={onClick}
    />
  )
);
ProfileAvatarIcon.displayName = "ProfileAvatarIcon";

export const CartIcon: React.FC<IconProps> = React.memo(({ className }) => (
  <Image src={Cart} alt="Cart  Icon" className={className} />
));
CartIcon.displayName = "CartIcon";
