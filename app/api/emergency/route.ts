import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

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
  // Define the properties of the Database interface here
}

interface ExtendedDatabase extends Database {
  emergencies?: Emergency[];
}

export async function GET() {
  try {
    const db: ExtendedDatabase = await readData();
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

    const db: ExtendedDatabase = await readData();
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
    await writeData(db);

    return NextResponse.json(newEmergency, { status: 201 });
  } catch (error) {
    console.error('Error posting emergency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}