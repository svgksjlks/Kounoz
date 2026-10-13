import { isEmailAdmin } from './admin';

export interface ServerUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  is_admin: boolean;
}

// Initial registered users list for server-side auth
const INITIAL_ACCOUNTS: ServerUser[] = [
  {
    id: 1,
    name: 'مدير متجر كنوز',
    email: 'admin@kounoz.sa',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 2,
    name: 'عمر جميل',
    email: 'omargamil37@gmail.com',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 3,
    name: 'محسن جميل',
    email: 'mohsengamil00@gmail.com',
    password: 'admin123',
    phone: '01066583964',
    is_admin: true,
  },
  {
    id: 4,
    name: 'كنوز للثوب العربي',
    email: 'kounozthobe@gmail.com',
    password: 'admin123',
    phone: '01022822123',
    is_admin: true,
  },
  {
    id: 5,
    name: 'عميل كنوز المميز',
    email: 'customer@kounoz.sa',
    password: 'user123',
    phone: '01012345678',
    is_admin: false,
  },
];

// Persistent in-memory global registry across Next.js API calls
declare global {
  // eslint-disable-next-line no-var
  var __kounoz_server_accounts: ServerUser[] | undefined;
}

function getRegistry(): ServerUser[] {
  if (!global.__kounoz_server_accounts) {
    global.__kounoz_server_accounts = [...INITIAL_ACCOUNTS];
  }
  return global.__kounoz_server_accounts;
}

export function findServerUser(email: string): ServerUser | undefined {
  const clean = email.trim().toLowerCase();
  return getRegistry().find((u) => u.email.toLowerCase() === clean);
}

export function registerServerUser(user: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): ServerUser {
  const clean = user.email.trim().toLowerCase();
  const existing = findServerUser(clean);
  if (existing) {
    existing.password = user.password;
    existing.name = user.name;
    if (user.phone) existing.phone = user.phone;
    return existing;
  }

  const newUser: ServerUser = {
    id: Date.now(),
    name: user.name.trim(),
    email: clean,
    password: user.password,
    phone: user.phone?.trim() || '',
    is_admin: isEmailAdmin(clean),
  };

  getRegistry().push(newUser);
  return newUser;
}
