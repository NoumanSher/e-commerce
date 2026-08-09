import React from "react";
import type { Metadata } from "next";
import AquaMistHero from "./components/Hero";
import AquaMistHomeContent from "./components/HomeContent";

export const metadata: Metadata = {
  title: "HumidAura - Breathe the Difference",
  description:
    "Luxury ultrasonic humidifiers crafted for your calm. Elevate your atmosphere with state-of-the-art technology and timeless design.",
};

/**
 * AquaMist theme — Home Page
 *
 * Renders the Hero section and the home page content sections
 * (Features, Best Sellers, Press Strip) which are defined as
 * separate components in the ./components/ folder.
 *
 * This page is intended to be mounted via the root layout once
 * the theme-switching logic routes to `aquamist`. Until then it
 * can be previewed by pointing the root page.tsx at this component.
 */
export default function AquaMistHomePage() {
  return (
    <>
      <AquaMistHero />
      <AquaMistHomeContent />
    </>
  );
}
