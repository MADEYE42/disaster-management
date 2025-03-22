import { NextResponse } from 'next/server';
import { readData } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Database, Role, User, Admin, Volunteer, Agency } from '@/lib/types';
import jwt from 'jsonwebtoken';

// Define the type for the request body
interface LoginRequest {
  email: string;
  password: string;
  role: Role;
}

type UserType = User | Admin | Volunteer | Agency;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// JWT secret (should be stored in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// JWT expiration time (24 hours)
const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login request body:', body);

    const { email, password, role } = body as LoginRequest;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'admin', 'agency', 'volunteer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Allowed roles are: user, admin, agency, volunteer' },
        { status: 400 }
      );
    }

    // Trim and normalize email
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Validate email format
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db: Database = await readData();
    console.log('Database contents:', db);

    // Determine the role key for the database
    const roleKey = role === 'agency' ? 'agencies' : `${role}s` as keyof Database;
    const users = db[roleKey];
    console.log(`Users for role ${role}:`, users);

    // Find the user by email (or phone number)
    const user = users.find((u: UserType) =>
      ('email' in u && u.email.toLowerCase() === trimmedEmail) ||
      ('phoneNumber' in u && u.phoneNumber === trimmedEmail)
    ) as UserType | undefined;
    console.log('Found user:', user);

    // Generic error to prevent user enumeration
    if (!user || !('password' in user)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(trimmedPassword, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set the JWT in an HTTP-only, secure cookie
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      maxAge: JWT_EXPIRES_IN, // 24 hours
      path: '/',
    });

    // Prepare the user data to return (excluding the password)
    const { password: _, ...userData } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userData,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}