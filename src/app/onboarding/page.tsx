'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Onboarding from '@/components/Onboarding';
import CourseDashboard from '@/components/CourseDashboard';

export default function OnboardingPage() {
  const router = useRouter();
  const { createUser, selectUser } = useStore();
  const [userProfile, setUserProfile] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const handleOnboardingComplete = (profile: any) => {
    // Create user with the profile data
    const userId = createUser(profile.name || 'Usuario', profile.weight, profile.height, profile.gender, profile.goals, profile.targetWeight);
    selectUser(userId);
    
    setUserProfile(profile);
    setIsOnboardingComplete(true);
  };

  if (isOnboardingComplete && userProfile) {
    return <CourseDashboard userProfile={userProfile} />;
  }

  return <Onboarding onComplete={handleOnboardingComplete} />;
}
