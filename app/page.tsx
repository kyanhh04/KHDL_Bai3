'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, Plus } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function Home() {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newUserId, setNewUserId] = useState<string>('');
  const [useNewUser, setUseNewUser] = useState(false);
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
    let userId = useNewUser ? newUserId : selectedUserId;
    
    if (!userId || (typeof userId === 'string' && userId.trim() === '')) {
      alert('Vui lòng chọn hoặc nhập một ID người dùng');
      return;
    }

    setIsStarting(true);
    
    // Ensure userId is a string and trim it
    userId = String(userId).trim();
    
    // Save selected user ID to localStorage
    localStorage.setItem('currentUserId', userId);
    
    // Redirect to discover page
    router.push('/discover');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Hệ thống Gợi ý Sách
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Khám phá những cuốn sách phù hợp với bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Existing Users Card */}
          <Card className="shadow-xl border-2" style={!useNewUser ? { borderColor: '#2563eb' } : {}}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Người Dùng Cũ
              </CardTitle>
              <CardDescription className="text-sm">
                Có lịch sử rating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="user-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chọn từ danh sách
                </label>
                <Select 
                  value={selectedUserId} 
                  onValueChange={(val) => {
                    setSelectedUserId(val);
                    setUseNewUser(false);
                  }}
                  disabled={isLoading || useNewUser}
                >
                  <SelectTrigger id="user-select" className="w-full h-11">
                    <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn ID người dùng"} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((userId) => (
                      <SelectItem key={userId} value={userId}>
                        {userId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 {users.length > 0 ? users.length : "Nhiều"} người dùng có dữ liệu rating. Sẽ hiển thị sách được gợi ý dựa trên history.
              </p>
              <Button 
                onClick={handleStartExploring}
                disabled={!selectedUserId || isStarting || useNewUser}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isStarting && !useNewUser ? (
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

          {/* New User Card */}
          <Card className="shadow-xl border-2" style={useNewUser ? { borderColor: '#2563eb' } : {}}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <Plus className="w-5 h-5" />
                Người Dùng Mới
              </CardTitle>
              <CardDescription className="text-sm">
                Chưa có lịch sử rating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-user-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chọn user mới
                </label>
                <Select 
                  value={newUserId} 
                  onValueChange={(val) => {
                    setNewUserId(val);
                    setUseNewUser(true);
                  }}
                  disabled={isStarting}
                >
                  <SelectTrigger id="new-user-select" className="w-full h-11">
                    <SelectValue placeholder="Chọn ID người dùng mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="999001">999001</SelectItem>
                    <SelectItem value="999002">999002</SelectItem>
                    <SelectItem value="999003">999003</SelectItem>
                    <SelectItem value="999004">999004</SelectItem>
                    <SelectItem value="999005">999005</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Những user này mới được tạo. Sẽ hiển thị Top 10 sách phổ biến nhất.
              </p>
              <Button 
                onClick={handleStartExploring}
                disabled={!newUserId || isStarting || !useNewUser}
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                {isStarting && useNewUser ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Bắt đầu khám phá
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>📖 Cách hoạt động:</strong>
          </p>
          <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            <li>✓ <strong>Người dùng cũ:</strong> Có dữ liệu rating → Hiển thị sách được gợi ý dựa trên sở thích cá nhân</li>
            <li>✓ <strong>Người dùng mới:</strong> Không có rating → Hiển thị Top 10 sách phổ biến nhất</li>
          </ul>
        </div>
      </div>
    </div>
  );
}