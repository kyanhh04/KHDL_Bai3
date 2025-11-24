import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

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
      const response = await axios.get(`${API_BASE_URL}/api/users/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  },

  async getHybridRecommendations(userId: string): Promise<Book[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recommend/hybrid/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hybrid recommendations:', error);
      throw error;
    }
  },

  async getPopularBooks(): Promise<Book[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recommend/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular books:', error);
      throw error;
    }
  },

  async getContentRecommendations(isbn: string): Promise<Book[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recommend/content/${isbn}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content recommendations:', error);
      throw error;
    }
  }
};