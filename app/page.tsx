'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const activeUsers = await apiService.getActiveUsers();
        setUsers(activeUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Fallback users for demo
        setUsers(['276726', '276736', '276744', '276747', '276774']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStartExploring = () => {
    if (!selectedUserId) {
      alert('Vui lòng chọn một người dùng');
      return;
    }

    setIsStarting(true);
    
    // Save selected user ID to localStorage
    localStorage.setItem('currentUserId', selectedUserId);
    
    // Redirect to discover page
    router.push('/discover');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-white-600 dark:text-white-400 mb-4">
            Hệ thống Gợi ý Sách
          </h2>

        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Chọn Người Dùng
            </CardTitle>
            <CardDescription>
              Chọn một ID người dùng để bắt đầu trải nghiệm khám phá sách
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="user-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ID Người Dùng
              </label>
              <Select 
                value={selectedUserId} 
                onValueChange={setSelectedUserId}
                disabled={isLoading}
              >
                <SelectTrigger id="user-select" className="w-full h-12">
                  <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn ID người dùng"} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((userId) => (
                    <SelectItem key={userId} value={userId}>
                      User {userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStartExploring}
              disabled={!selectedUserId || isStarting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Bắt đầu khám phá
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        </div>
      </div>
    </div>
  );
}