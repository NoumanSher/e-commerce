import React from "react";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import RichTextRenderer from "@/components/RichTextRenderer";

export const revalidate = 60; // Cache for 60 seconds

/**
 * Checks whether Quill HTML has any real visible text.
 * Quill stores empty editors as "<p><br></p>" which is truthy but visually blank.
 */
function hasVisibleContent(html?: string): boolean {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return stripped.length > 0;
}

export default async function PrivacyPolicyPage() {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  const settings = await getStoreSettingServer(host);
  const privacyPolicyContent = settings?.privacyPolicy;
  const showRichContent = hasVisibleContent(privacyPolicyContent);

  return (
    <div className="min-h-screen pt-[110px] pb-16 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-12 backdrop-blur-xl text-white shadow-2xl mt-4">
        <h1 className="font-eb-garamond text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 pb-4 border-b border-white/10">
          Privacy Policy
        </h1>

        {showRichContent ? (
          <div className="policy-content">
            <RichTextRenderer
              content={privacyPolicyContent!}
              className="text-white/80 leading-relaxed text-sm md:text-base"
            />
            {/* Override Quill inline styles (color, background-color) that clash with dark theme */}
            <style>{`
              .policy-content .rich-text *,
              .policy-content .rich-text span,
              .policy-content .rich-text p,
              .policy-content .rich-text div,
              .policy-content .rich-text li {
                color: rgba(255, 255, 255, 0.85) !important;
                background-color: transparent !important;
                background: transparent !important;
              }
              .policy-content .rich-text strong,
              .policy-content .rich-text b {
                color: #ffffff !important;
                font-weight: 600 !important;
              }
              .policy-content .rich-text h1,
              .policy-content .rich-text h2,
              .policy-content .rich-text h3,
              .policy-content .rich-text h4,
              .policy-content .rich-text h5,
              .policy-content .rich-text h6 {
                color: #ffffff !important;
                background-color: transparent !important;
                font-weight: 700 !important;
              }
              .policy-content .rich-text a {
                color: #38bdf8 !important;
                text-decoration: underline !important;
              }
              .policy-content .rich-text ul,
              .policy-content .rich-text ol {
                padding-left: 1.5rem;
                margin-top: 0.5rem;
                margin-bottom: 0.75rem;
              }
              .policy-content .rich-text li {
                margin-bottom: 0.35rem;
              }
              .policy-content .rich-text p {
                margin-bottom: 0.75rem;
              }
            `}</style>
          </div>
        ) : (
          <div className="space-y-8 text-white/80 leading-relaxed">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-6">Last updated: August 2026</p>
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                We respect your privacy and are committed to protecting your personal data.
                This Privacy Policy explains how we collect, use, and safeguard your information when you visit our
                e-commerce platform, use our services, or interact with us.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
