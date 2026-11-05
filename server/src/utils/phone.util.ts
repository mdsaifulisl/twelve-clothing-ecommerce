export interface NormalizedBangladeshPhone {
  /** Canonical national display form, e.g. 01711223344. */
  phone: string;
  /** Canonical digits-only country-code form, e.g. 8801711223344. */
  normalizedPhone: string;
}

const toAsciiDigits = (value: string): string =>
  value.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));

/**
 * Accepts Bangladesh mobile numbers in national or country-code form.
 * Formatting spaces, hyphens and parentheses are ignored; other characters
 * are rejected. This validates number shape, not subscriber assignment.
 */
export const normalizeBangladeshPhone = (
  input: string,
): NormalizedBangladeshPhone | null => {
  const trimmed = toAsciiDigits(input).trim();
  if (!trimmed) return null;

  // A plus sign is only valid as the first character.
  if (trimmed.includes('+') && !trimmed.startsWith('+')) return null;

  const compact = trimmed.replace(/[\s()-]/g, '');
  if (!/^\+?\d+$/.test(compact)) return null;

  let nationalNumber: string;
  if (/^01[3-9]\d{8}$/.test(compact)) {
    nationalNumber = compact;
  } else if (/^\+?8801[3-9]\d{8}$/.test(compact)) {
    const digits = compact.startsWith('+') ? compact.slice(1) : compact;
    nationalNumber = `0${digits.slice(3)}`;
  } else {
    return null;
  }

  return {
    phone: nationalNumber,
    normalizedPhone: `880${nationalNumber.slice(1)}`,
  };
};
