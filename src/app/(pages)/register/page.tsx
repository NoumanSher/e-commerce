import { Suspense } from "react";
import type { Metadata } from "next";
import Register from "@/components/Register";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Create Account");
  return { ...base, robots: { index: false, follow: true } };
}


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register />
    </Suspense>
  );
}
