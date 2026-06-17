import type { Metadata } from 'next';

import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";

export async function generateMetadata(): Promise<Metadata> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  try {
    const storeSettings = await getStoreSettingServer(host);
    const storeName = storeSettings?.title || "PakShipper";
    return {
      title: `Contact Us | ${storeName}`,
      description: storeSettings?.description || 'Get in touch with our team',
    };
  } catch (error) {
    return {
      title: 'Contact Us | PakShipper',
      description: 'Get in touch with our team',
    };
  }
}

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
