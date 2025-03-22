import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();

    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error communicating with backend:', error);
        return NextResponse.json({ error: 'Failed to fetch prediction' }, { status: 500 });
    }
}
