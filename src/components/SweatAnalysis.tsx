import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, FlaskConical, Loader2 } from 'lucide-react';
import { callGeminiFlash } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';      // ✅ your custom auth hook
import { useProfile } from '@/hooks/useProfile'; // ✅ your profile hook
import { supabase } from '@/lib/supabase';

const calculatePCOSRiskPercentage = (glucose: string, ph: string, cortisol: string, salt:string) => {
  let score = 0;
  let maxScore = 30;

  if (glucose.toLowerCase().includes("dark") || glucose.toLowerCase().includes("high")) {
    score += 10;
  } else if (glucose.toLowerCase().includes("moderate")) {
    score += 5;
  }

  if (ph.toLowerCase().includes("purple") || ph.toLowerCase().includes("alkaline")) {
    score += 10;
  } else if (ph.toLowerCase().includes("neutral") || ph.toLowerCase().includes("green")) {
    score += 5;
  }

  if (cortisol.toLowerCase().includes("dark") || cortisol.toLowerCase().includes("high")) {
    score += 10;
  } else if (cortisol.toLowerCase().includes("faint") || cortisol.toLowerCase().includes("moderate")) {
    score += 5;
  }

  if (salt.toLowerCase().includes("yellow", "light") || salt.toLowerCase().includes("high")) {
    score += 10;
  } else if (salt.toLowerCase().includes("dark yellow", "light brown") || salt.toLowerCase().includes("moderate")) {
    score += 5;
  }

  return Math.round((score / maxScore) * 100);
};

const SweatAnalysis = () => {
  const [glucose, setGlucose] = useState('');
  const [ph, setPh] = useState('');
  const [cortisol, setCortisol] = useState('');
  const [salt, setSalt] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [pcosScore, setPcosScore] = useState<number | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();
  const { profile } = useProfile();

  const handleAnalyze = async () => {
    if (!glucose || !ph || !cortisol || !salt) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all test results.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const score = calculatePCOSRiskPercentage(glucose, ph, cortisol, salt);
      setPcosScore(score);

      const prompt = `
You're a health AI helping young women detect early PCOS indicators via sweat-based test strips.

User submitted:
• Glucose Zone: ${glucose}
• pH Zone: ${ph}
• Cortisol Zone: ${cortisol}
• Salt Zone: ${salt}

Give a detailed analysis of what this may mean. Then suggest 4-5 personalized tips (lifestyle or diet). Make it friendly and encouraging.
      `.trim();

      const aiInsight = await callGeminiFlash(prompt);
      const cleanAiInsight = aiInsight.replace(/\*\*/g, ''); // Remove ** bold markers
      setAiResult(cleanAiInsight);

      const { error } = await supabase
        .from('sweat_results')
        .insert([{
          user_id: profile?.id || profile?.user_id,
          glucose,
          ph,
          cortisol,
          salt,
          ai_insight: cleanAiInsight,
          pcos_score: score
        }]);

      if (error) {
        console.error("Insert error:", error);
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sweat analysis saved successfully.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      toast({
        title: "Save Error",
        description: "Could not save the result or fetch AI insight.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">Sweat Analysis</h2>
        <p className="text-gray-600">Log your DIY strip result to get PCOS insights</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">Glucose Zone Result</label>
          <Input
            placeholder="e.g., Dark Blue, No Color"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">pH Zone Result</label>
          <Input
            placeholder="e.g., Pink, Green, Purple"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Cortisol Zone Result</label>
          <Input
            placeholder="e.g., Dark Brown, Faint, No Color"
            value={cortisol}
            onChange={(e) => setCortisol(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Salt Zone Result</label>
          <Input
  placeholder="e.g., Light Brown, Yellow ,Dark"
  value={salt}
  onChange={(e) => setSalt(e.target.value)}
/>
        </div>

        <Button
          onClick={handleAnalyze}
          className="gradient-rose text-white w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze Sweat Result"}
        </Button>
      </Card>

      {pcosScore !== null && (
        <Card className="p-6 mt-4">
          <h3 className="font-semibold text-purple-700 mb-2">PCOS Risk Score</h3>
          <p className="text-3xl font-bold text-purple-600">{pcosScore}%</p>
        </Card>
      )}

      {aiResult && (
        <Card className="p-6 mt-4">
          <h3 className="font-semibold mb-3 flex items-center text-purple-700">
            <Sparkles className="w-5 h-5 mr-2" /> AI Insight
          </h3>
          <p className="text-sm whitespace-pre-wrap text-gray-800">{aiResult}</p>
        </Card>
      )}
    </div>
  );
};

export default SweatAnalysis;
