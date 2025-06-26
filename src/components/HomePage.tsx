import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, Heart, Scan, Calendar, Droplets, Sparkles } from 'lucide-react';
import { useScans } from '@/hooks/useScans';
import { useProfile } from '@/hooks/useProfile';

const HomePage = () => {
  const { scans, loading: scansLoading } = useScans();
  const { profile, loading: profileLoading } = useProfile();

  const latestScan = scans[0];

  // Extract scores
  const facialScore = latestScan?.facial_hair_score ?? 0;
  const sweatScore = latestScan?.acne_score ?? 0;
  const profileScore = profile?.pcos_risk_score ?? 0;

  // Combined PCOS score (average of 3)
  const pcosScore = Math.round((facialScore + sweatScore + profileScore) / 3);

  const lastScan = latestScan 
    ? new Date(latestScan.created_at).toLocaleDateString()
    : "Yesterday";
  
  const nextPeriod = "in 5 days"; // Placeholder

  const getPcosRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low", color: "text-green-600", bg: "bg-green-100" };
    if (score < 70) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "High", color: "text-red-600", bg: "bg-red-100" };
  };

  const riskInfo = getPcosRiskLevel(pcosScore);

  const recentScans = scans.length > 0 ? scans.slice(0, 3).map(scan => ({
    date: new Date(scan.created_at).toLocaleDateString(),
    acne: scan.acne_score < 30 ? "Mild improvement" : scan.acne_score < 60 ? "Moderate" : "Severe",
    hormones: scan.facial_hair_score < 30 ? "Stable" : scan.facial_hair_score < 60 ? "Elevated" : "High"
  })) : [
    { date: "Dec 24", acne: "Mild improvement", hormones: "Stable" },
    { date: "Dec 22", acne: "Moderate", hormones: "Elevated" },
    { date: "Dec 20", acne: "Moderate", hormones: "Stable" }
  ];

  if (scansLoading || profileLoading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-3xl mb-6"></div>
          <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <div className="gradient-gentle rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        <Sparkles className="w-8 h-8 text-white mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Good morning, {profile?.full_name || 'Beautiful'}! ✨
        </h2>
        <p className="text-white/90">Ready to track your wellness journey today?</p>
      </div>

      {/* PCOS Score Card */}
      <Card className="p-6 card-glow border-0 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">PCOS Risk Score</h3>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${riskInfo.bg} ${riskInfo.color} shadow-sm`}>
            {riskInfo.level} Risk
          </span>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-gradient mb-3">{pcosScore}%</div>
            <Progress value={pcosScore} className="h-4 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center bg-purple-50 p-3 rounded-xl">
            Based on your latest GYNORA mirror scan results and symptom tracking.
          </p>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 gradient-rose text-white border-0 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Last Scan</p>
              <p className="font-semibold">{lastScan}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 gradient-teal text-white border-0 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Next Period</p>
              <p className="font-semibold">{nextPeriod}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Scans</h3>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentScans.map((scan, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-200">
              <div>
                <p className="font-medium text-sm text-gray-800">{scan.date}</p>
                <p className="text-xs text-gray-600">Acne: {scan.acne}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Hormones: {scan.hormones}</p>
                <TrendingUp className="w-4 h-4 text-purple-600 ml-auto mt-1" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-16 gradient-wellness text-white hover:opacity-90 shadow-lg border-0 transition-all duration-200">
          <div className="text-center">
            <Scan className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Mirror Connected</span>
          </div>
        </Button>
        <Button className="h-16 gradient-gentle text-white hover:opacity-90 shadow-lg border-0 transition-all duration-200">
          <div className="text-center">
            <Droplets className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Test Strip</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
