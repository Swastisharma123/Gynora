// src/app/(main)/profile-summary/page.tsx
'use client';
import { Card } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';

const ProfileSummary = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center text-red-600">No profile data found.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Your Profile Summary</h2>

      <Card className="p-4 space-y-2">
        <p><strong>Full Name:</strong> {profile.full_name}</p>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Weight:</strong> {profile.weight} kg</p>
        <p><strong>Height:</strong> {profile.height} cm</p>
        <p><strong>Menstruation Started At:</strong> Age {profile.menstruation_age}</p>
        <p><strong>Cycle Length:</strong> {profile.cycle_length}</p>
        <p><strong>Symptoms:</strong> {profile.symptoms}</p>
        <p><strong>Goals:</strong> {profile.goals}</p>
        <p><strong>Estimated PCOS Risk Score:</strong> {
  (() => {
    let score = 0;
    const weight = profile.weight || 0;
    const height = profile.height || 1; // prevent division by 0
    const bmi = weight / ((height / 100) ** 2);

    if (profile.cycle_length === 'irregular' || profile.cycle_length === '36+') score += 2;
    if (bmi > 25) score += 2;
    if ((profile.symptoms || '').toLowerCase().includes('acne')) score += 1;
    if ((profile.symptoms || '').toLowerCase().includes('hair')) score += 1;
    if ((profile.symptoms || '').toLowerCase().includes('pigmentation')) score += 1;

    return `${Math.min((score / 6) * 100, 100).toFixed(0)}%`;
  })()
}</p>
      </Card>
    </div>
  );
};

export default ProfileSummary;
