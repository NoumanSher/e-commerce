import type { Metadata } from "next";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";
import WishListClient from "./WishListClient";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Wishlist");
  return { ...base, robots: { index: false, follow: true } };
}

export default function WishListPage() {
  return <WishListClient />;
}
