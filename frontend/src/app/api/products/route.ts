import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { FALLBACK_PRODUCTS } from '@/lib/api';

// In-memory Global Server Store for Next.js Serverless runtime
let globalProducts: Product[] = [...FALLBACK_PRODUCTS];

// GET: All Products
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let results = globalProducts;
  if (category && category !== 'جميع القطع') {
    results = results.filter((p) => p.category === category);
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}

// POST: Add or update product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existingIndex = globalProducts.findIndex((p) => p.id === body.id);

    if (existingIndex !== -1) {
      globalProducts[existingIndex] = { ...globalProducts[existingIndex], ...body };
      return NextResponse.json({
        success: true,
        data: globalProducts[existingIndex],
      });
    }

    const newProduct: Product = {
      ...body,
      id: body.id || Date.now(),
    };

    globalProducts = [newProduct, ...globalProducts];

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error creating product' },
      { status: 400 }
    );
  }
}
