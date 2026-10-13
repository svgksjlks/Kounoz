import { NextResponse } from 'next/server';
import { registerServerUser } from '@/lib/serverAccounts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل' },
        { status: 400 }
      );
    }

    // 1. Try forwarding to backend on port 5000 if available
    try {
      const backendRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password, phone }),
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (data.success) {
          // Keep server accounts in sync
          registerServerUser({ name: cleanName, email: cleanEmail, password, phone });
          return NextResponse.json(data);
        }
      }
    } catch {}

    // 2. Register in server accounts
    const newUser = registerServerUser({
      name: cleanName,
      email: cleanEmail,
      password: password,
      phone: phone || '',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: {
          token: (newUser.is_admin ? 'admin_' : 'user_') + 'jwt_token_' + Date.now(),
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            is_admin: newUser.is_admin,
          },
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
