import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  
  response.cookies.set('hori-admin-email', '', {
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('hori-user-email', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
