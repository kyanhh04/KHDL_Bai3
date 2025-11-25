import axios from 'axios';

// Use a public env var for client-side configuration. If not provided,
// client code will call relative `/api/...` paths so Next can proxy or
// serve API routes locally. Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
// to point to your backend (e.g. http://127.0.0.1:5000).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

const buildUrl = (path: string) => {
  // If API_BASE_URL is empty, return the relative path so the browser
  // requests the same origin (e.g. Next.js API routes). Otherwise
  // prefix with the configured base URL.
  if (!API_BASE_URL || API_BASE_URL === '') return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export interface Book {
  ISBN: string;
  'Book-Title': string;
  'Book-Author': string;
  'Year-Of-Publication': number;
  Publisher: string;
  'Image-URL-M': string;
}

export const apiService = {
  async getActiveUsers(): Promise<string[]> {
    try {
      const response = await axios.get(buildUrl('/api/users/active'));
      return response.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  },

  async getHybridRecommendations(userId: string): Promise<Book[]> {
    try {
      const response = await axios.get(buildUrl(`/api/recommend/hybrid/${userId}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching hybrid recommendations:', error);
      throw error;
    }
  },

  async getPopularBooks(): Promise<Book[]> {
    try {
      const response = await axios.get(buildUrl('/api/recommend/popular'));
      return response.data;
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  },

  async getContentRecommendations(isbn: string): Promise<Book[]> {
    try {
      const response = await axios.get(buildUrl(`/api/recommend/content/${isbn}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching content recommendations:', error);
      throw error;
    }
  },

  async getBookByISBN(isbn: string): Promise<Book> {
    try {
      const response = await axios.get(buildUrl(`/api/book/${isbn}`));
      return response.data;
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      throw error;
    }
  }
};