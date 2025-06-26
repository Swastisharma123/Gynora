import { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useScans } from '@/hooks/useScans';
import { useProfile } from '@/hooks/useProfile';

interface ScanResults {
  acne_score: number;
  facial_hair_score: number;
  pigmentation_score: number;
  overall_improvement: number;
  pcos_score: number;
  recommendations: string[];
}

const FaceScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [countdown, setCountdown] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();
  const { addScan } = useScans();
  const { user } = useProfile();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      toast({
        title: 'Camera Access Required',
        description: 'Please allow camera access to use the face scanner.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setHasPermission(false);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const startScanSequence = useCallback(async () => {
    setIsScanning(true);
    setScanComplete(false);

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setCountdown(0);

    const imageData = captureImage();
    if (!imageData) {
      toast({
        title: 'Capture Failed',
        description: 'Failed to capture image. Please try again.',
        variant: 'destructive'
      });
      setIsScanning(false);
      return;
    }

    setCapturedImage(imageData);
    setIsScanning(false);
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-face-scan', {
        body: {
          image: imageData,
          analysisType: 'pcos-facial-symptoms'
        }
      });

      if (error) throw error;

      const rawResults = data.analysis;

      const calculatedPCOSScore = Math.round(
        (rawResults.acne_score + rawResults.facial_hair_score + rawResults.pigmentation_score + (100 - rawResults.overall_improvement)) / 4
      );

      const results: ScanResults = {
        ...rawResults,
        pcos_score: calculatedPCOSScore
      };

      setScanResults(results);

      const { error: dbError } = await supabase.from('face_scans').insert({
        user_id: user?.id,
        acne_score: results.acne_score,
        facial_hair_score: results.facial_hair_score,
        pigmentation_score: results.pigmentation_score,
        overall_improvement: results.overall_improvement,
        pcos_score: results.pcos_score,
        recommendations: results.recommendations,
        scan_date: new Date().toISOString()
      });

      if (dbError) {
        console.error('DB save error:', dbError);
        toast({
          title: 'Save Error',
          description: 'Unable to save scan to database.',
          variant: 'destructive'
        });
      }

      await addScan({
        acne_score: results.acne_score,
        facial_hair_score: results.facial_hair_score,
        pigmentation_score: results.pigmentation_score,
        overall_improvement: results.overall_improvement,
        pcos_score: results.pcos_score,
        recommendations: results.recommendations,
        scan_date: new Date().toISOString()
      });

      setScanComplete(true);
      toast({
        title: 'Scan Complete',
        description: 'Your facial analysis has been completed and saved.'
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze the image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
      stopCamera();
    }
  }, [captureImage, addScan, toast, stopCamera, user?.id]);

  const resetScan = () => {
    setScanComplete(false);
    setCapturedImage(null);
    setScanResults(null);
    startCamera();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        videoRef.current.style.width = '100%';
        videoRef.current.style.height = 'auto';
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full max-w-screen-md mx-auto p-4">
      {!scanComplete && (
        <div className="space-y-4">
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full rounded-lg border-4 border-purple-500 object-cover"
            />
            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                <p className="text-6xl font-bold text-white">{countdown}</p>
              </div>
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg">
                <Loader2 className="animate-spin w-12 h-12 text-white mb-4" />
                <p className="text-white">Analyzing facial features...</p>
              </div>
            )}
          </div>
          <Button
            onClick={startScanSequence}
            className="w-full py-4 bg-purple-600 text-white text-lg rounded-full hover:bg-purple-700"
          >
            {isScanning ? 'Scanning...' : 'Start Facial Scan'}
          </Button>
        </div>
      )}

      {scanComplete && scanResults && (
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-bold mb-4">Scan Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Acne</p>
              <p className="text-2xl font-bold text-purple-600">{scanResults.acne_score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Facial Hair</p>
              <p className="text-2xl font-bold text-teal-600">{scanResults.facial_hair_score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pigmentation</p>
              <p className="text-2xl font-bold text-pink-600">{scanResults.pigmentation_score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PCOS Risk</p>
              <p className="text-2xl font-bold text-red-600">{scanResults.pcos_score}%</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            {scanResults.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-500 mt-1" />
                <p className="text-sm text-gray-800">{rec}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={resetScan}
            className="mt-6 w-full py-3 bg-purple-500 text-white hover:bg-purple-600"
          >
            New Scan
          </Button>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceScanner;
