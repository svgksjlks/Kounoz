import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // Proxy to /api/products
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/products`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      const product = data.data.find((p: Product) => String(p.id) === String(id));
      if (product) {
        return NextResponse.json({ success: true, data: product });
      }
    }
  } catch (err) {}

  return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
}
