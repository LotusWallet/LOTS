import React from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <Dashboard />;
}
