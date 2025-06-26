import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

const UserProfilePage = () => {
  const { profile, loading } = useProfile();
  const navigate = useNavigate();

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-purple-700">Your Profile</h2>

      <Card className="p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">🧍 Personal Info</h3>
        <div><strong>Name:</strong> {profile.full_name}</div>
        <div><strong>Age:</strong> {profile.age}</div>
        <div><strong>Weight:</strong> {profile.weight} kg</div>
        <div><strong>Height:</strong> {profile.height} cm</div>
        <div><strong>Cycle Length:</strong> {profile.cycle_length}</div>
        <div><strong>Menstruation Age:</strong> {profile.menstruation_age}</div>
      </Card>

      <Card className="p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">📋 Health & Symptoms</h3>
        <div><strong>Symptoms:</strong> {profile.symptoms}</div>
        <div><strong>Goals:</strong> {profile.goals}</div>
        <div><strong>PCOS Risk Score:</strong> {profile.pcos_risk_score}/6</div>
      </Card>

      <Card className="p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-2">📸 Face Scan Analysis</h3>
        <div><strong>Acne:</strong> {profile.acne_status || 'Not scanned'}</div>
        <div><strong>Facial Hair:</strong> {profile.facial_hair_status || 'Not scanned'}</div>
        <div><strong>Pigmentation:</strong> {profile.pigmentation_status || 'Not scanned'}</div>
        <div><strong>Obesity:</strong> {profile.obesity_status || 'Not scanned'}</div>
      </Card>

      <Button
        onClick={() => navigate('/edit-profile')}
        className="w-full h-12 bg-purple-600 text-white hover:bg-purple-700"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};

export default UserProfilePage;
