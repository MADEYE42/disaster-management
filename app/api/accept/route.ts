import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import { User as BaseUser } from '@/lib/types';

interface Emergency {
  id: string;
  title: string;
  description: string;
  user: string;
  status: string;
  volunteers: string[];
  timestamp: string;
}

// Extend the BaseUser interface to include the role property
export interface User extends BaseUser {
  role: string;
}

interface Database {
  emergencies?: Emergency[];
  users?: BaseUser[];
  admins?: any[];
  volunteers?: any[];
  agencies?: any[];
}

// Define ExtendedDatabase with the local User interface that includes role
interface ExtendedDatabase {
  emergencies?: Emergency[];
  users?: User[];
  admins?: any[];
  volunteers?: any[];
  agencies?: any[];
}

export async function POST(request: Request) {
  try {
    const { emergencyId, volunteer } = await request.json();

    if (!emergencyId || !volunteer) {
      return NextResponse.json({ error: 'Emergency ID and volunteer are required' }, { status: 400 });
    }

    const emergencyIdStr = String(emergencyId); // Ensure emergencyId is a string
    const db: ExtendedDatabase = await readData() as ExtendedDatabase;
    db.users = db.users ?? [];
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
    db.users = db.users || [];
    await writeData({ 
      ...db, 
      users: db.users ?? [], 
      admins: db.admins ?? [], 
      volunteers: db.volunteers ?? [], 
      agencies: db.agencies ?? [] 
    });

    return NextResponse.json(emergency);
  } catch (error) {
    console.error('Error accepting emergency:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}