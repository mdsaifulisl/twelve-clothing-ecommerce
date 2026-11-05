const STORAGE_KEY = 'twelve-clothing-device-id';

const createBrowserId = () => {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

/** First-party browser ID for order-abuse controls; this is not a hardware/browser fingerprint. */
export const getOrderDeviceId = () => {
  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(current)) return current;
    const created = createBrowserId();
    window.localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    return createBrowserId();
  }
};
