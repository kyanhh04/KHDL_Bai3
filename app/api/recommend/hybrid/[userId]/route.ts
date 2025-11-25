import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  // Default to local backend during development if env var not set
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';

  // Fallback mock recommendations for local development
  const mock = [
    {
      ISBN: '0440234743',
      'Book-Title': `Recommended for ${userId} - A`,
      'Book-Author': 'Author A',
      'Year-Of-Publication': 2001,
      Publisher: 'Publisher A',
      'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Rec+1'
    },
    {
      ISBN: '0671027034',
      'Book-Title': `Recommended for ${userId} - B`,
      'Book-Author': 'Author B',
      'Year-Of-Publication': 1999,
      Publisher: 'Publisher B',
      'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Rec+2'
    }
  ];

  try {
    if (BASE) {
      const res = await fetch(`${BASE}/api/recommend/hybrid/${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }

      // If hybrid failed, try popular as a fallback
      console.warn(`/api/recommend/hybrid proxy returned ${res.status}, trying /api/recommend/popular`);
      const popRes = await fetch(`${BASE}/api/recommend/popular`);
      if (popRes.ok) {
        const popData = await popRes.json();
        return NextResponse.json(popData, { status: popRes.status });
      }
    }

    // Fallback mock recommendations for local development
    const mock = [
      {
        ISBN: '0440234743',
        'Book-Title': `Recommended for ${userId} - A`,
        'Book-Author': 'Author A',
        'Year-Of-Publication': 2001,
        Publisher: 'Publisher A',
        'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Rec+1'
      },
      {
        ISBN: '0671027034',
        'Book-Title': `Recommended for ${userId} - B`,
        'Book-Author': 'Author B',
        'Year-Of-Publication': 1999,
        Publisher: 'Publisher B',
        'Image-URL-M': 'https://via.placeholder.com/128x193.png?text=Rec+2'
      }
    ];

    return NextResponse.json(mock);
  } catch (err) {
    console.error('API /recommend/hybrid/[userId] error:', err);
    // As a last resort return the mock instead of returning 502 to client
    return NextResponse.json(mock);
  }
}
