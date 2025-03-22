import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();

    try {
        // Instead of using Python libraries directly, make an API call to your Python backend
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Backend returned status: ${response.status}`);
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error communicating with backend:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch prediction',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}