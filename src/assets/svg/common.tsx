import React from 'react';
import Image from 'next/image';
import img from '../img/money-back.png';
import img1 from '../img/24-hours-support.png';
import img2 from '../img/delivery.png';
import { FaFacebookF, FaPinterest, FaTwitter } from 'react-icons/fa';
import { IoLogoInstagram } from 'react-icons/io';
import { BsYoutube } from 'react-icons/bs';

// DeliveryIcon Component
export const DeliveryIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img2}
        alt="Delivery"
        style={{ width: '50px', height: '50px' }}
      />
    </div>
  );
});

// ServiceIcon Component
export const ServiceIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img1}
        alt="24 Hours Support"
        style={{ width: '50px', height: '50px' }}
      />
    </div>
  );
});

// MoneyBackGuaranteeIcon Component
export const MoneyBackGuaranteeIcon = React.memo(() => {
  return (
    <div>
      <Image
        src={img}
        alt="Money Back Guarantee"
        style={{ width: '50px', height: '50px' }}
      />
    </div>
  );
});

// FaFacebookFIcon Component
export const FaFacebookFIcon = React.memo(() => {
  return (
    <div>
      <FaFacebookF />
    </div>
  );
});

// FaTwitterIcon Component
export const FaTwitterIcon = React.memo(() => {
  return (
    <div>
      <FaTwitter />
    </div>
  );
});

// IoLogoInstagramIcon Component
export const IoLogoInstagramIcon = React.memo(() => {
  return (
    <div>
      <IoLogoInstagram />
    </div>
  );
});

// BsYoutubeIcon Component
export const BsYoutubeIcon = React.memo(() => {
  return (
    <div>
      <BsYoutube />
    </div>
  );
});

// FaPinterestIcon Component
export const FaPinterestIcon = React.memo(() => {
  return (
    <div>
      <FaPinterest />
    </div>
  );
});
