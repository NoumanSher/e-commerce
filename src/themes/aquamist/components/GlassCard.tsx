import React from "react";

/**
 * GlassCard — AquaMist Theme
 *
 * Reusable glassmorphism card. Used in:
 *  - HomeContent: Feature cards, Product/Best-Seller cards
 *  - Collections: Product listing cards
 *
 * Props
 * ─────
 * children   — card content
 * className  — extra Tailwind classes (padding, rounded, etc.)
 * onClick    — optional click handler
 * as         — polymorphic element type (default "div")
 */

type GlassCardProps<T extends React.ElementType = "div"> = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "children" | "className" | "onClick" | "as">;

export default function GlassCard<T extends React.ElementType = "div">({
  children,
  className = "",
  onClick,
  as,
  ...rest
}: GlassCardProps<T>) {
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag
      className={["aq-glass-card", className].join(" ")}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Tag>
  );
}
