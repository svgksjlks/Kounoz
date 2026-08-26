/**
 * Admin email authorization helpers (server-side safe)
 */

export function getAdminEmails(): string[] {
  const defaults = ['admin@kounoz.sa', 'kounoztest@gmail.com'];
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];
  return Array.from(new Set([...defaults, ...envEmails]));
}

export function isEmailAdmin(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
