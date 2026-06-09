import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;

  if (!gasUrl) {
    return NextResponse.json({ success: false, error: 'NEXT_PUBLIC_GAS_URL is not set' }, { status: 500 });
  }

  try {
    const res = await fetch(`${gasUrl}?${searchParams.toString()}`, {
      method: 'GET',
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;

  if (!gasUrl) {
    return NextResponse.json({ success: false, error: 'NEXT_PUBLIC_GAS_URL is not set' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const res = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
