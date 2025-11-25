import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;
  // Default to local backend during development if env var not set
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';
  // Fallback mock content-based recommendations
  const mock = [
    {
      ISBN: isbn,
      'Book-Title': `Content-similar to ${isbn} - A`,
      'Book-Author': 'Author A',
      'Year-Of-Publication': 2005,
      Publisher: 'Publisher A',
      'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Content+1'
    }
  ];

  try {
    if (BASE) {
      const res = await fetch(`${BASE}/api/recommend/content/${encodeURIComponent(isbn)}`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }
      console.warn(`/api/recommend/content proxy returned ${res.status}, returning mock`);
    }

    return NextResponse.json(mock);
  } catch (err) {
    console.error('API /recommend/content/[isbn] error:', err);
    return NextResponse.json(mock);
  }
}
