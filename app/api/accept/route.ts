import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';

interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteers: string[];
  timestamp: string;
}

interface Database {
  emergencies?: Emergency[];
}

interface ExtendedDatabase extends Database {}

export async function POST(request: Request) {
  try {
    const { emergencyId, volunteer } = await request.json();

    if (!emergencyId || !volunteer) {
      return NextResponse.json({ error: 'Emergency ID and volunteer are required' }, { status: 400 });
    }

    const emergencyIdStr = String(emergencyId); // Ensure emergencyId is a string
    const db: ExtendedDatabase = await readData();
    console.log('Received emergencyId:', emergencyIdStr);
    console.log('Current emergencies:', db.emergencies);

    const emergencyIndex = db.emergencies?.findIndex((e) => e.id === emergencyIdStr) ?? -1;

    if (emergencyIndex === -1) {
      return NextResponse.json({ error: 'Emergency not found' }, { status: 404 });
    }

    const emergency = db.emergencies![emergencyIndex];
    if (emergency.volunteers.includes(volunteer)) {
      return NextResponse.json({ error: 'You have already accepted this emergency' }, { status: 400 });
    }

    emergency.volunteers.push(volunteer);
    if (emergency.volunteers.length === 1) {
      emergency.status = 'accepted';
    }

    db.emergencies![emergencyIndex] = emergency;
    await writeData(db);

    return NextResponse.json(emergency);
  } catch (error) {
    console.error('Error accepting emergency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}