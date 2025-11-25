import { NextResponse } from 'next/server';

export async function GET() {
  // Default to local backend during development if env var not set
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';
  // Fallback mock popular books for local development
  const mock = [
    {
      ISBN: '0440234743',
      'Book-Title': 'Example Book One',
      'Book-Author': 'Author A',
      'Year-Of-Publication': 2001,
      Publisher: 'Publisher A',
      'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Book+1'
    },
    {
      ISBN: '0671027034',
      'Book-Title': 'Example Book Two',
      'Book-Author': 'Author B',
      'Year-Of-Publication': 1999,
      Publisher: 'Publisher B',
      'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Book+2'
    }
  ];

  try {
    if (BASE) {
      const res = await fetch(`${BASE}/api/recommend/popular`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }
      console.warn(`/api/recommend/popular proxy returned ${res.status}, returning mock`);
    }

    return NextResponse.json(mock);
  } catch (err) {
    console.error('API /recommend/popular error:', err);
    return NextResponse.json(mock);
  }
}
