import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import LegalPolicyPage from "@/components/LegalPolicyPage";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Shipping & Returns");
  return { ...base, robots: { index: false, follow: true } };
}


export default async function ShippingAndReturnsPage() {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  const settings = await getStoreSettingServer(host);

  return (
    <LegalPolicyPage
      title="Shipping & Returns"
      content={settings?.shippingAndReturns}
      fallback={
        <>
          <p className="text-xs uppercase tracking-wider mb-6 opacity-60">
            Last updated: August 2026
          </p>
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Shipping Options &amp; Delivery</h2>
            <p>
              We offer standard and expedited shipping across Pakistan. Orders are processed within
              1-2 business days and typical delivery times range from 2-5 working days depending on
              location.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Returns &amp; Exchanges Policy</h2>
            <p>
              If you receive a damaged or incorrect item, you can request a return or exchange within
              7 days of delivery. Items must be unused and in original packaging. Contact our customer
              support team to initiate a return.
            </p>
          </section>
        </>
      }
    />
  );
}
