import { useState } from 'react';
import {
  Home,
  User,
  Activity,
  MessageCircle,
  FileText,
  Bell,
  LogOut,
  Droplets,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'scan', label: 'Scan', icon: Activity },
    { id: 'sweat-analysis', label: 'Sweat', icon: Droplets },        // ✅ Added
    { id: 'education', label: 'Education', icon: BookOpen },         // ✅ Added
    { id: 'coach', label: 'Coach', icon: MessageCircle },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-rose rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src="/images/favicon.png" 
                  alt="GYNORA Logo" 
                  className="w-10 h-10 rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">GYNORA</h1>
                <p className="text-xs text-gray-500 -mt-1">Your Wellness Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {profile?.full_name || profile?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
              <button className="p-2 rounded-xl bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 transition-all duration-200 shadow-sm">
                <Bell className="w-5 h-5 text-purple-600" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 transition-all duration-200 shadow-sm"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-purple-100 shadow-lg">
        <div className="flex justify-around items-center h-20 max-w-3xl mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600 shadow-md scale-105" 
                    : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
