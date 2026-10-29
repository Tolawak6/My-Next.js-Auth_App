import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Same message for "no user" and "wrong password" — don't leak which emails exist.
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({ message: 'Logged in' });

    response.cookies.set('token', token, {
      httpOnly: true,                                  // JS in the browser can't read it (blocks XSS theft)
      secure: process.env.NODE_ENV === 'production',   // HTTPS only in production
      sameSite: 'lax',                                 // basic CSRF protection
      path: '/',
      maxAge: 60 * 60 * 24 * 7,                        // 7 days
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}