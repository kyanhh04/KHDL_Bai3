import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:5000';

  // Fallback mock book data
  const mockBook = {
    ISBN: isbn,
    'Book-Title': 'Unknown Book',
    'Book-Author': 'Unknown Author',
    'Year-Of-Publication': 2023,
    Publisher: 'Unknown Publisher',
    'Image-URL-M': ''
  };

  try {
    if (BASE) {
      // Try multiple sources to find the book
      
      // 1. Try popular books endpoint
      try {
        const popRes = await fetch(`${BASE}/api/recommend/popular`);
        if (popRes.ok) {
          const books = await popRes.json();
          if (Array.isArray(books)) {
            const book = books.find((b: any) => b.ISBN === isbn);
            if (book) {
              return NextResponse.json(book);
            }
          }
        }
      } catch (e) {
        console.warn('Popular books endpoint failed:', e);
      }

      // 2. Try content-based recommendations as fallback
      try {
        const contentRes = await fetch(`${BASE}/api/recommend/content/${encodeURIComponent(isbn)}`);
        if (contentRes.ok) {
          const books = await contentRes.json();
          if (Array.isArray(books) && books.length > 0) {
            return NextResponse.json(books[0]);
          }
        }
      } catch (e) {
        console.warn('Content endpoint failed:', e);
      }
    }

    return NextResponse.json(mockBook);
  } catch (err) {
    console.error('API /book/[isbn] error:', err);
    return NextResponse.json(mockBook);
  }
}
