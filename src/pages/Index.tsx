
import { useState } from "react";
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import HomePage from '@/components/HomePage';
import ProfilePage from '@/components/ProfilePage';
import ScanPage from '@/components/ScanPage';
import CoachPage from '@/components/CoachPage';
import ReportsPage from '@/components/ReportsPage';
import AuthPage from '@/components/AuthPage';
import SweatAnalysis from '@/components/SweatAnalysis';
import EducationPage from '@/components/EducationPage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-rose rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white rounded-2xl opacity-90"></div>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">GYNORA</h2>
          <p className="text-gray-600">Loading your wellness companion...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 gradient-rose rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
            <img 
              src="images/favicon.png" 
              alt="GYNORA Logo" 
              className="w-24 h-24 rounded-2xl"
            />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4">Welcome to GYNORA</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Your personalized PCOS wellness companion. Track symptoms, analyze facial changes, and get AI-powered insights.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full h-14 gradient-wellness text-white shadow-lg border-0 text-lg font-medium rounded-2xl transition-all duration-200 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'profile':
        return <ProfilePage />;
      case 'scan':
        return <ScanPage />;
      case 'coach':
        return <CoachPage />;
      case 'reports':
        return <ReportsPage />;
      case 'sweat-analysis':
        return <SweatAnalysis />;
      case 'education':
        return <EducationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
