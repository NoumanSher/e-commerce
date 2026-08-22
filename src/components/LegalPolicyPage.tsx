import React from "react";
import { resolveActiveTheme } from "@/utils/theme";
import RichTextRenderer from "@/components/RichTextRenderer";

/**
 * Returns true only when the Quill HTML contains real visible text.
 * Quill stores empty editors as "<p><br></p>" which is truthy but visually blank.
 */
function hasVisibleContent(html?: string): boolean {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return stripped.length > 0;
}

interface LegalPolicyPageProps {
  title: string;
  content?: string;
  /** Default content shown when no merchant content has been configured. */
  fallback: React.ReactNode;
}

/**
 * Shared layout for Privacy Policy, Terms of Service, and Shipping & Returns.
 *
 * Theme-branching follows the same `isAqua` pattern used in about-us/page.tsx.
 * Color inheritance for Quill-generated HTML is handled globally in globals.css
 * via `.rich-text * { color: inherit !important; }` — no inline <style> blocks needed.
 */
export default async function LegalPolicyPage({
  title,
  content,
  fallback,
}: LegalPolicyPageProps) {
  const activeTheme = await resolveActiveTheme();
  const isAqua = activeTheme === "aquamist";
  const showRichContent = hasVisibleContent(content);

  return (
    <div
      className={`min-h-screen pt-[110px] pb-16 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center ${
        isAqua ? "text-white" : "text-gray-900"
      }`}
    >
      <div
        className={`w-full rounded-2xl p-6 sm:p-12 shadow-2xl mt-4 ${
          isAqua
            ? "bg-white/5 border border-white/10 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        }`}
      >
        <h1
          className={`font-eb-garamond text-3xl md:text-4xl font-bold tracking-tight mb-6 pb-4 border-b ${
            isAqua ? "text-white border-white/10" : "text-gray-900 border-gray-200"
          }`}
        >
          {title}
        </h1>

        {showRichContent ? (
          <RichTextRenderer
            content={content!}
            className={`leading-relaxed text-sm md:text-base ${
              isAqua ? "text-white/80" : "text-gray-700"
            }`}
          />
        ) : (
          <div
            className={`space-y-8 leading-relaxed text-sm md:text-base ${
              isAqua ? "text-white/80" : "text-gray-700"
            }`}
          >
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}
