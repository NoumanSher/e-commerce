/**
 * Variant Resolution Utilities
 *
 * Handles both legacy and new variant structures:
 *
 * OLD (v1) — single-option products, name-only matching:
 *   variant.name = "Black"  or  "Red - XL"  (color + " - " + size)
 *   variant.attributes = undefined
 *
 * NEW (v2) — multi-option Shopify-style, attribute matching:
 *   variant.name = "S / Black"  (size + " / " + color)
 *   variant.attributes = { size: "S", color: "Black" }
 */

export interface VariantLike {
  name: string;
  attributes?: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
  stock: number;
  additionalSalePrice: number;
  additionalCostPrice?: number;
  _id: string;
}

/**
 * Match a variant based on color and/or size across both schemas.
 */
export function resolveVariant(
  variants: VariantLike[],
  selectedColor: string,
  selectedSize: string,
  hasColors: boolean,
  hasSizes: boolean
): VariantLike | undefined {
  if (!variants || variants.length === 0) return undefined;

  const c = selectedColor?.trim().toLowerCase() || "";
  const s = selectedSize?.trim().toLowerCase() || "";

  // 1. If both color and size are selected:
  if (hasColors && hasSizes && c && s) {
    // Strategy A: Attributes match
    const byAttr = variants.find(
      (v) =>
        v.attributes?.color?.trim().toLowerCase() === c &&
        v.attributes?.size?.trim().toLowerCase() === s
    );
    if (byAttr) return byAttr;

    // Strategy B: Name contains both color and size in any order (e.g. "S / Black" or "Black - S")
    const byNameBoth = variants.find((v) => {
      const n = (v.name || "").toLowerCase();
      return n.includes(c) && n.includes(s);
    });
    if (byNameBoth) return byNameBoth;
  }

  // 2. If only color is available / selected:
  if (hasColors && c && (!hasSizes || !s)) {
    const byAttrColor = variants.find(
      (v) => v.attributes?.color?.trim().toLowerCase() === c
    );
    if (byAttrColor) return byAttrColor;

    const byNameColor = variants.find((v) => {
      const n = (v.name || "").toLowerCase().trim();
      return n === c || n.includes(c);
    });
    if (byNameColor) return byNameColor;
  }

  // 3. If only size is available / selected:
  if (hasSizes && s && (!hasColors || !c)) {
    const byAttrSize = variants.find(
      (v) => v.attributes?.size?.trim().toLowerCase() === s
    );
    if (byAttrSize) return byAttrSize;

    const byNameSize = variants.find((v) => {
      const n = (v.name || "").toLowerCase().trim();
      return n === s || n.includes(s);
    });
    if (byNameSize) return byNameSize;
  }

  return undefined;
}

/**
 * Check if a specific COLOR option is entirely sold out across all its combinations.
 */
export function isColorSoldOut(
  color: string,
  variants: VariantLike[]
): boolean {
  if (!variants || variants.length === 0) return false;
  const c = color.trim().toLowerCase();

  const colorVariants = variants.filter((v) => {
    if (v.attributes?.color) {
      return v.attributes.color.trim().toLowerCase() === c;
    }
    const n = (v.name || "").toLowerCase();
    return n === c || n.includes(c);
  });

  // If no matching variants found, do not disable
  if (colorVariants.length === 0) return false;

  // Only sold out if every variant for this color has stock <= 0
  return colorVariants.every((v) => (Number(v.stock) || 0) <= 0);
}

/**
 * Check if a specific SIZE option is sold out.
 * - If color is selected: checks the specific (color + size) variant combination.
 * - If color is not yet selected: checks if ALL variants containing this size have stock <= 0.
 */
export function isSizeSoldOut(
  size: string,
  selectedColor: string,
  variants: VariantLike[],
  hasColors: boolean
): boolean {
  if (!variants || variants.length === 0) return false;
  const s = size.trim().toLowerCase();
  const c = selectedColor?.trim().toLowerCase() || "";

  // When a color is actively selected, check the specific combination
  if (hasColors && c) {
    const combo = variants.find((v) => {
      // Attribute match
      if (v.attributes?.color && v.attributes?.size) {
        return (
          v.attributes.color.trim().toLowerCase() === c &&
          v.attributes.size.trim().toLowerCase() === s
        );
      }
      // Name match
      const n = (v.name || "").toLowerCase();
      return n.includes(c) && n.includes(s);
    });

    if (combo) {
      return (Number(combo.stock) || 0) <= 0;
    }
    // If no specific variant exists for this combination, return false rather than falsely disabling
    return false;
  }

  // When no color is selected yet, check if all variants with this size are out of stock
  const sizeVariants = variants.filter((v) => {
    if (v.attributes?.size) {
      return v.attributes.size.trim().toLowerCase() === s;
    }
    const n = (v.name || "").toLowerCase();
    return n === s || n.includes(s);
  });

  if (sizeVariants.length === 0) return false;
  return sizeVariants.every((v) => (Number(v.stock) || 0) <= 0);
}
