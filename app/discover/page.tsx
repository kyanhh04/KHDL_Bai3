'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { BookOpen, Star, TrendingUp, User, ArrowLeft } from 'lucide-react';
import { apiService, Book } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function DiscoverPage() {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [hybridBooks, setHybridBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          router.push('/');
          return;
        }

        setCurrentUserId(userId);

        const [hybrid, popular] = await Promise.all([
          apiService.getHybridRecommendations(userId),
          apiService.getPopularBooks()
        ]);

        setHybridBooks(hybrid);
        setPopularBooks(popular);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        
        setHybridBooks([{
          ISBN: "034545104X",
          "Book-Title": "The Hobbit : or There and Back Again",
          "Book-Author": "J.R.R. Tolkien",
          "Year-Of-Publication": 2002,
          "Publisher": "Houghton Mifflin",
          "Image-URL-M": "http://images.amazon.com/images/P/034545104X.01.MZZZZZZZ.jpg"
        }]);
        
        setPopularBooks([{
          ISBN: "0446310786",
          "Book-Title": "To Kill a Mockingbird",
          "Book-Author": "Harper Lee",
          "Year-Of-Publication": 1988,
          "Publisher": "Warner Books",
          "Image-URL-M": "http://images.amazon.com/images/P/0446310786.01.MZZZZZZZ.jpg"
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <div className="text-red-500 mb-4">
                  <BookOpen className="w-12 h-12 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <Button onClick={handleBackToHome} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay về trang chủ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleBackToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Khám phá sách
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>Xin chào, User-ID: {currentUserId}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Gợi ý cho bạn</span>
                </CardTitle>
                <CardDescription>
                  Những cuốn sách được cá nhân hóa dựa trên sở thích đọc của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="space-y-3">
                        <Skeleton className="w-40 h-60 mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                        <Skeleton className="h-3 w-24 mx-auto" />
                      </div>
                    ))}
                  </div>
                ) : hybridBooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hybridBooks.map((book) => (
                      <BookCard key={book.ISBN} book={book} size="medium" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Chưa có gợi ý nào cho bạn. Hãy khám phá sách phổ biến bên cạnh!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Top 10 sách phổ biến</span>
                </CardTitle>
                <CardDescription>
                  Những cuốn sách được yêu thích nhất hiện nay
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex space-x-3">
                        <Skeleton className="w-16 h-24 flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : popularBooks.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {popularBooks.slice(0, 10).map((book, index) => (
                      <div key={book.ISBN} className="flex space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/book/${book.ISBN}`}>
                            <div className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {book['Book-Title']}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {book['Book-Author']}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {book['Year-Of-Publication']}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Không có sách phổ biến nào
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}