/**
 * Admin email authorization helpers (server-side safe)
 */

export function getAdminEmails(): string[] {
  const defaults = [
    'admin@kounoz.sa',
    'kounozthobe@gmail.com',
    'omargamil37@gmail.com',
    'mohsengamil00@gmail.com',
    'kounoztest@gmail.com',
  ];
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];
  return Array.from(new Set([...defaults, ...envEmails]));
}

export function isEmailAdmin(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  const list = getAdminEmails();
  return (
    list.includes(clean) ||
    clean.startsWith('admin@') ||
    clean.endsWith('@kounoz.sa') ||
    clean.endsWith('@kounoz.sbs')
  );
}
