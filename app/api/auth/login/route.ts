import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAILS || 'mahikasera350@gmail.com')
      .split(',')
      .map(e => e.trim().toLowerCase());

    const isTargetAdmin = normalizedEmail === 'mahikasera350@gmail.com';
    const isAdmin = isTargetAdmin || adminEmail.includes(normalizedEmail);

    // Validate admin credentials specifically if targeting admin email
    if (isTargetAdmin) {
      if (password !== 'Kaseramahi@123') {
        return NextResponse.json(
          { success: false, error: 'Incorrect password for admin user.' },
          { status: 401 }
        );
      }
    } else {
      // Basic check for other users
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters.' },
          { status: 400 }
        );
      }
    }

    const user = {
      email: normalizedEmail,
      name: isTargetAdmin ? 'Mahi Kasera' : normalizedEmail.split('@')[0],
      role: isAdmin ? 'admin' : 'customer',
    };

    const response = NextResponse.json({
      success: true,
      user,
      isAdmin,
    });

    // Set admin cookie if user has admin privileges
    if (isAdmin) {
      response.cookies.set('hori-admin-email', normalizedEmail, {
        path: '/',
        httpOnly: false, // Accessible to client and middleware
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Set general session cookie
    response.cookies.set('hori-user-email', normalizedEmail, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during login.' },
      { status: 500 }
    );
  }
}
