import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { Database, Role, User, Agency, Volunteer } from '@/lib/types';

// Define the type for the request body
type RegisterData = {
  role: Role;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  country: string;
  city: string;
  pinCode: string;
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone number validation regex (e.g., 123-456-7890)
const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
// Password validation regex (at least 8 characters, 1 number, 1 special character)
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
// Pin code validation regex (e.g., 5-digit US ZIP code or 6-digit Indian PIN code)
const pinCodeRegex = /^\d{5,6}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, name, phoneNumber, address, email, password, country, city, pinCode } = body as RegisterData;

    // Validate required fields
    if (!role || !name || !phoneNumber || !address || !email || !password || !country || !city || !pinCode) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: role, name, phoneNumber, address, email, password, country, city, and pinCode are required',
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!['user', 'agency', 'volunteer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Allowed roles are: user, agency, volunteer' },
        { status: 400 }
      );
    }

    // Trim whitespace and normalize email
    const trimmedName = name.trim();
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedAddress = address.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();
    const trimmedPinCode = pinCode.trim();

    // Validate email format
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!phoneRegex.test(trimmedPhoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use format: 123-456-7890' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!passwordRegex.test(trimmedPassword)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters long and include at least 1 number and 1 special character',
        },
        { status: 400 }
      );
    }

    // Validate pin code format
    if (!pinCodeRegex.test(trimmedPinCode)) {
      return NextResponse.json(
        { error: 'Invalid pin code format. Must be a 5 or 6 digit number' },
        { status: 400 }
      );
    }

    const db: Database = await readData();

    // Check for duplicate email in the respective role array
    let emailExists = false;
    switch (role) {
      case 'user':
        emailExists = db.users.some((user) => user.email.toLowerCase() === trimmedEmail);
        break;
      case 'agency':
        emailExists = db.agencies.some((agency) => agency.email.toLowerCase() === trimmedEmail);
        break;
      case 'volunteer':
        emailExists = db.volunteers.some((volunteer) => volunteer.email.toLowerCase() === trimmedEmail);
        break;
    }

    if (emailExists) {
      return NextResponse.json(
        { error: `Email ${trimmedEmail} is already registered for the role ${role}` },
        { status: 400 }
      );
    }

    // Prepare the new entry
    const newEntry: User | Agency | Volunteer = {
      id: Date.now().toString(),
      name: trimmedName,
      phoneNumber: trimmedPhoneNumber,
      address: trimmedAddress,
      email: trimmedEmail,
      password: await hashPassword(trimmedPassword),
      country: trimmedCountry,
      city: trimmedCity,
      pinCode: trimmedPinCode,
    };

    // Add the new entry to the appropriate role array
    switch (role) {
      case 'user':
        db.users.push(newEntry as User);
        break;
      case 'agency':
        db.agencies.push(newEntry as Agency);
        break;
      case 'volunteer':
        db.volunteers.push(newEntry as Volunteer);
        break;
      default:
        throw new Error('Invalid role'); // This should never happen due to earlier validation
    }

    // Write the updated database
    await writeData(db);

    // Return the new entry (excluding the password) in the response
    const { password: _, ...responseEntry } = newEntry;
    return NextResponse.json(
      { message: 'Registration successful', data: responseEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}