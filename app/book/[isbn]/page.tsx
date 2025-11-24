'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { BookOpen, ArrowLeft, Calendar, User as UserIcon, Building, BookMarked } from 'lucide-react';
import { apiService, Book } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookDetailPage() {
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const params = useParams();
    const isbn = params.isbn as string;

    useEffect(() => {
        const fetchBookData = async () => {
            if (!isbn) {
                setError('Không tìm thấy mã ISBN');
                setIsLoading(false);
                return;
            }

            try {
                const books = await apiService.getContentRecommendations(isbn);

                if (books.length === 0) {
                    setError('Không tìm thấy thông tin sách');
                    return;
                }

                setCurrentBook(books[0]);
                setSimilarBooks(books.slice(1));
            } catch (error) {
                console.error('Error fetching book data:', error);
                setError('Không thể tải thông tin sách. Vui lòng thử lại sau.');

                const fallbackBook: Book = {
                    ISBN: isbn,
                    "Book-Title": "The Hobbit : or There and Back Again",
                    "Book-Author": "J.R.R. Tolkien",
                    "Year-Of-Publication": 2002,
                    "Publisher": "Houghton Mifflin",
                    "Image-URL-M": "http://images.amazon.com/images/P/034545104X.01.MZZZZZZZ.jpg"
                };
                setCurrentBook(fallbackBook);
                setSimilarBooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookData();
    }, [isbn]);

    const handleBackToDiscover = () => {
        router.push('/discover');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4 mb-8">
                        <Skeleton className="w-10 h-10" />
                        <Skeleton className="h-8 w-48" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <Skeleton className="w-48 h-72 flex-shrink-0" />
                                        <div className="flex-1 space-y-4">
                                            <Skeleton className="h-8 w-3/4" />
                                            <Skeleton className="h-6 w-1/2" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[...Array(6)].map((_, index) => (
                                            <Skeleton key={index} className="w-32 h-48" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentBook) {
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
                                <div className="space-y-2">
                                    <Button onClick={handleBackToDiscover} className="w-full">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Quay lại khám phá
                                    </Button>
                                    <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                                        Về trang chủ
                                    </Button>
                                </div>
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
                            <Button variant="ghost" size="sm" onClick={handleBackToDiscover}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại
                            </Button>
                            <div className="flex items-center space-x-2">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Chi tiết sách
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-48 h-72 relative mx-auto md:mx-0">
                                            <Image
                                                src={currentBook['Image-URL-M']}
                                                alt={currentBook['Book-Title']}
                                                fill
                                                className="object-cover rounded-lg shadow-lg"
                                                sizes="(max-width: 768px) 100vw, 192px"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://via.placeholder.com/192x288/cccccc/666666?text=No+Cover`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {currentBook['Book-Title']}
                                            </h2>
                                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                                <UserIcon className="w-4 h-4" />
                                                <span className="font-medium">{currentBook['Book-Author']}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Năm xuất bản: <span className="font-medium">{currentBook['Year-Of-Publication']}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-3 text-sm">
                                                <Building className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Nhà xuất bản: <span className="font-medium">{currentBook.Publisher}</span>
                                                </span>
                                            </div>

                                            <div className="flex items-center space-x-3 text-sm">
                                                <BookMarked className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    ISBN: <span className="font-medium">{currentBook.ISBN}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <Button
                                                onClick={handleBackToDiscover}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Tiếp tục khám phá
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="w-5 h-5 text-green-500" />
                                    <span>Những cuốn sách tương tự</span>
                                </CardTitle>
                                <CardDescription>
                                    Các sách có nội dung tương tự bạn có thể thích
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {similarBooks.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                        {similarBooks.map((book) => (
                                            <BookCard key={book.ISBN} book={book} size="small" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Không có sách tương tự nào
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBackToDiscover}
                                            className="mt-4"
                                        >
                                            Khám phá thêm sách
                                        </Button>
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