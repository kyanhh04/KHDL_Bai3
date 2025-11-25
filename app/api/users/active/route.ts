import { NextResponse } from 'next/server';

export async function GET() {
  // Default to local backend during development if env var not set
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';
  // Fallback mock user IDs for local development when backend isn't configured
  const mock = ['276726', '276736', '276744', '276747', '276774'];

  try {
    if (BASE) {
      const res = await fetch(`${BASE}/api/users/active`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }
      console.warn(`/api/users/active proxy returned ${res.status}, returning mock`);
    }

    return NextResponse.json(mock);
  } catch (err) {
    console.error('API /users/active error:', err);
    return NextResponse.json(mock);
  }
}
