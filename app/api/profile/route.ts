import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { cookies } from 'next/headers';
import { Database, Role, User, Admin, Volunteer, Agency } from '@/lib/types';
import jwt from 'jsonwebtoken';

// Type for the JWT payload
interface JWTPayload {
  id: string;
  role: Role;
  iat: number;
  exp: number;
}

// Union type for all possible user types
type ProfileData = User | Admin | Volunteer | Agency;

// Type for database keys
type DatabaseKey = keyof Database;

// Utility to exclude password from user data
type SafeUser<T extends ProfileData> = Omit<T, 'password'>;

export async function GET() {
  try {
    const userCookies = await cookies();
    const token = userCookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const { id, role } = decoded;

    // Read the database
    const db: Database = await readData();
    const roleKey: DatabaseKey = role === 'agency' ? 'agencies' : `${role}s`;
    const userArray = db[roleKey] as ProfileData[];
    const user = userArray.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...safeUser } = user as User & { password?: string };
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Profile GET error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userCookies = await cookies();
    const token = userCookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    const { id, role } = decoded;

    // Parse the request body
    const updates = (await request.json()) as Partial<ProfileData>;

    // Validate updates
    const allowedFields = ['name', 'email', 'phoneNumber', 'address', 'country', 'city', 'pinCode'];
    const updateKeys = Object.keys(updates);
    const invalidFields = updateKeys.filter((key) => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(', ')}. Only ${allowedFields.join(', ')} are allowed.` },
        { status: 400 }
      );
    }

    // Read the database
    const db: Database = await readData();
    const roleKey: DatabaseKey = role === 'agency' ? 'agencies' : `${role}s`;
    const userArray = db[roleKey] as ProfileData[];
    const userIndex = userArray.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent password updates through this endpoint
    if ('password' in updates) {
      delete updates.password;
    }

    // Prevent role updates through this endpoint
    if ('role' in updates) {
      delete updates.role;
    }

    // Update the user
    userArray[userIndex] = { ...userArray[userIndex], ...updates };
    db[roleKey] = userArray as any;
    await writeData(db);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile PUT error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}