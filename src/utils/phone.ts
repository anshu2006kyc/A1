/**
 * Phone Number Masking Utility
 * Masks phone numbers for privacy (e.g., +91 98••••3210)
 */

export function maskPhone(phone?: string, reveal: boolean = false): string {
  if (!phone) return '••••••••••';
  if (reveal) return phone;

  const clean = phone.replace('+91', '').replace(/\s+/g, '').replace(/\D/g, '');
  
  if (clean.length >= 10) {
    const last10 = clean.slice(-10);
    return `+91 ${last10.slice(0, 2)}••••${last10.slice(-4)}`;
  }

  if (phone.length <= 4) {
    return '••••';
  }

  return `${phone.slice(0, 2)}••••${phone.slice(-3)}`;
}

export function maskPhoneCompact(phone?: string): string {
  if (!phone) return '••••••';
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 8) {
    return `${clean.slice(0, 2)}****${clean.slice(-2)}`;
  }
  return '••••••';
}
