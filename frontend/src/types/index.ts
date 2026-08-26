export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  original_price: number | null;
  description: string;
  material: string;
  care_instructions?: string;
  image_url: string;
  secondary_image_url?: string | null;
  images?: string[]; // Array of 4 photo shapes / angles (Front, Back, Side/Fit, Fabric)
  is_new: boolean;
  has_3d?: boolean;
  tag: string | null;
  in_stock: boolean;
  stock_quantity?: number;
  colors: Color[];
  sizes?: string[];
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image_url: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type Category = 'جميع القطع' | 'جلابيب كلاسيكية' | 'أثواب ملكية' | 'بشوت ومناسبات' | 'إكسسوارات وشيل';

export const CATEGORIES: Category[] = [
  'جميع القطع',
  'جلابيب كلاسيكية',
  'أثواب ملكية',
  'بشوت ومناسبات',
  'إكسسوارات وشيل',
];
