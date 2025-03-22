import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

// Ensure readData returns ExtendedDatabase type
async function readExtendedData(): Promise<ExtendedDatabase> {
  return await readData() as unknown as ExtendedDatabase;
}

// Define the Emergency interface
interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteers: string[];
  timestamp: string;
}

// Extend the Database interface if needed
interface Database {
  emergencies?: Emergency[];
}

interface ExtendedDatabase extends Database {
  users?: any[]; // Add the users property
  admins?: any[];
  volunteers?: any[];
  agencies?: any[];
}

export async function GET() {
  try {
    const db: ExtendedDatabase = await readExtendedData();
    // Always return an array, even if db.emergencies is undefined or null
    return NextResponse.json(db.emergencies || []);
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, user } = await request.json();

    if (!title || !description || !user) {
      return NextResponse.json({ error: 'Title, description, and user are required' }, { status: 400 });
    }

    const db: ExtendedDatabase = await readExtendedData();
    const newEmergency: Emergency = {
      id: Date.now().toString(),
      title,
      description,
      user,
      status: 'pending',
      volunteers: [],
      timestamp: new Date().toISOString(),
    };

    db.emergencies = [...(db.emergencies || []), newEmergency];
    await writeData({
      ...db,
      users: db.users ?? [],
      admins: db.admins ?? [],
      volunteers: db.volunteers ?? [],
      agencies: db.agencies ?? []
    });

    return NextResponse.json(newEmergency, { status: 201 });
  } catch (error) {
    console.error('Error posting emergency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}