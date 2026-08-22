import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import LegalPolicyPage from "@/components/LegalPolicyPage";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Terms of Service");
  return { ...base, robots: { index: false, follow: true } };
}


export default async function TermsOfServicePage() {
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
      title="Terms of Service"
      content={settings?.termsOfService}
      fallback={
        <>
          <p className="text-xs uppercase tracking-wider mb-6 opacity-60">
            Last updated: August 2026
          </p>
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing and using our store, you agree to be bound by these Terms of Service.
              If you disagree with any part of the terms, you must not access or use our services.
            </p>
          </section>
        </>
      }
    />
  );
}
