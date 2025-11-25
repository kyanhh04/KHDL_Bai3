'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '@/lib/api';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
  size?: 'small' | 'medium' | 'large';
}

export function BookCard({ book, size = 'medium' }: BookCardProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-40 h-60',
    large: 'w-48 h-72'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <Link href={`/book/${book.ISBN}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col items-center space-y-3">
            {/* Book Cover */}
            <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
              {imgError || !book['Image-URL-M'] ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white font-bold text-2xl">
                      {book['Book-Title']
                        .split(' ')
                        .slice(0, 2)
                        .map((word) => word.charAt(0))
                        .join('')
                        .toUpperCase()}
                    </p>
                    <p className="text-white text-xs mt-2 px-2 line-clamp-2">{book['Book-Title']}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={book['Image-URL-M']}
                  alt={book['Book-Title']}
                  className="w-full h-full object-cover rounded-md"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            
            {/* Book Info */}
            <div className="text-center space-y-1 w-full">
              <h3 className={`font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 ${textSizes[size]}`}>
                {book['Book-Title']}
              </h3>
              <p className={`text-gray-600 dark:text-gray-400 line-clamp-1 ${textSizes[size]}`}>
                {book['Book-Author']}
              </p>
              <p className={`text-gray-500 dark:text-gray-500 ${textSizes[size]}`}>
                {book['Year-Of-Publication']}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}