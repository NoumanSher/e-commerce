import { Suspense } from "react";
import type { Metadata } from "next";
import Login from "@/components/Login";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Sign In");
  return { ...base, robots: { index: false, follow: true } };
}


export default function LogInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
