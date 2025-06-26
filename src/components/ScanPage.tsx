
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Camera } from 'lucide-react';
import { useScans } from '@/hooks/useScans';
import FaceScanner from './FaceScanner';

const ScanPage = () => {
  const { scans, loading } = useScans();
  const [showScanner, setShowScanner] = useState(false);

  const latestScan = scans[0] || {
    acne_score: 35,
    facial_hair_score: 20,
    pigmentation_score: 45,
    overall_improvement: 15,
    scan_date: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  const scanHistory = scans.slice(0, 4).map(scan => ({
    date: new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    acne: scan.acne_score,
    facialHair: scan.facial_hair_score,
    pigmentation: scan.pigmentation_score
  }));

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-green-600";
    if (score < 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score < 30) return "bg-green-100";
    if (score < 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score < 30) return "Good";
    if (score < 60) return "Moderate";
    return "Needs Attention";
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mx-auto w-48 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-xl mb-6"></div>
        </div>
      </div>
    );
  }

  if (showScanner) {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">Face Analysis</h2>
          <p className="text-gray-600">AI-powered PCOS symptom detection</p>
        </div>
        
        <FaceScanner />
        
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowScanner(false)}
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            Back to Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">Scan Results</h2>
        <p className="text-gray-600">AI-powered facial analysis for PCOS symptoms</p>
      </div>

      {/* Latest Scan Card */}
      <Card className="p-6 card-glow border-0 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Latest Analysis</h3>
          <span className="text-sm text-gray-500">
            {new Date(latestScan.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Overall Improvement */}
        <div className="gradient-gentle rounded-xl p-4 mb-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="flex items-center justify-center mb-2">
            {latestScan.overall_improvement >= 0 ? (
              <TrendingUp className="w-6 h-6 mr-2" />
            ) : (
              <TrendingDown className="w-6 h-6 mr-2" />
            )}
            <span className="text-lg font-semibold">
              {Math.abs(latestScan.overall_improvement)}% {latestScan.overall_improvement >= 0 ? 'Improvement' : 'Change'}
            </span>
          </div>
          <p className="text-sm opacity-90">From last scan</p>
        </div>

        {/* Individual Scores */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Acne Severity</span>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getScoreColor(latestScan.acne_score)}`}>
                  {Math.round(latestScan.acne_score)}/100
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getScoreBg(latestScan.acne_score)} ${getScoreColor(latestScan.acne_score)}`}>
                  {getScoreLabel(latestScan.acne_score)}
                </span>
              </div>
            </div>
            <Progress value={latestScan.acne_score} className="h-3" />
            <p className="text-xs text-gray-600 mt-1">
              {latestScan.acne_score < 30 ? "Minimal acne detected" : 
               latestScan.acne_score < 60 ? "Mild to moderate acne on T-zone" : 
               "Active breakouts detected"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Facial Hair</span>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getScoreColor(latestScan.facial_hair_score)}`}>
                  {Math.round(latestScan.facial_hair_score)}/100
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getScoreBg(latestScan.facial_hair_score)} ${getScoreColor(latestScan.facial_hair_score)}`}>
                  {getScoreLabel(latestScan.facial_hair_score)}
                </span>
              </div>
            </div>
            <Progress value={latestScan.facial_hair_score} className="h-3" />
            <p className="text-xs text-gray-600 mt-1">
              {latestScan.facial_hair_score < 30 ? "Minimal facial hair growth" : 
               latestScan.facial_hair_score < 60 ? "Moderate hair growth detected" : 
               "Significant hair growth patterns"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Pigmentation</span>
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${getScoreColor(latestScan.pigmentation_score)}`}>
                  {Math.round(latestScan.pigmentation_score)}/100
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getScoreBg(latestScan.pigmentation_score)} ${getScoreColor(latestScan.pigmentation_score)}`}>
                  {getScoreLabel(latestScan.pigmentation_score)}
                </span>
              </div>
            </div>
            <Progress value={latestScan.pigmentation_score} className="h-3" />
            <p className="text-xs text-gray-600 mt-1">
              {latestScan.pigmentation_score < 30 ? "Even skin tone detected" : 
               latestScan.pigmentation_score < 60 ? "Mild discoloration areas" : 
               "Notable pigmentation patterns"}
            </p>
          </div>
        </div>
      </Card>

      {/* Scan History Timeline */}
      {scanHistory.length > 0 && (
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="font-semibold mb-4 text-lg">Progress Timeline</h3>
          <div className="space-y-3">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-purple-500' : 'bg-purple-300'}`}></div>
                  <span className="font-medium text-sm">{scan.date}</span>
                </div>
                <div className="flex space-x-4 text-xs">
                  <span className={`font-medium ${getScoreColor(scan.acne)}`}>A: {Math.round(scan.acne)}</span>
                  <span className={`font-medium ${getScoreColor(scan.facialHair)}`}>H: {Math.round(scan.facialHair)}</span>
                  <span className={`font-medium ${getScoreColor(scan.pigmentation)}`}>P: {Math.round(scan.pigmentation)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
          <h3 className="font-semibold text-lg">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
            <p className="text-sm font-medium text-blue-800 mb-1">💧 Skincare</p>
            <p className="text-xs text-blue-600">Consider adding niacinamide to your routine for better oil control</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-400">
            <p className="text-sm font-medium text-green-800 mb-1">🥗 Nutrition</p>
            <p className="text-xs text-green-600">Increase omega-3 rich foods to support hormonal balance</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400">
            <p className="text-sm font-medium text-purple-800 mb-1">🏃‍♀️ Lifestyle</p>
            <p className="text-xs text-purple-600">Regular cardio exercise can help reduce PCOS symptoms</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => setShowScanner(true)}
          className="h-14 gradient-wellness text-white shadow-lg border-0"
        >
          <Camera className="w-5 h-5 mr-2" />
          New Face Scan
        </Button>
        <Button variant="outline" className="h-14 border-purple-200 text-purple-600 hover:bg-purple-50 shadow-lg">
          <Activity className="w-5 h-5 mr-2" />
          View Charts
        </Button>
      </div>
    </div>
  );
};

export default ScanPage;