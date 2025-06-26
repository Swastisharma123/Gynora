
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export type Scan = {
  id: string;
  user_id: string;
  acne_score: number;
  facial_hair_score: number;
  pigmentation_score: number;
  overall_improvement: number;
  scan_date: string;
  recommendations?: string[];
  created_at: string;
};

export const useScans = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchScans();
    } else {
      setScans([]);
      setLoading(false);
    }
  }, [user]);

  const fetchScans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
      toast({
        title: "Error",
        description: "Failed to load scan data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addScan = async (scanData: Omit<Scan, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          ...scanData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setScans(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Scan results saved successfully",
      });
    } catch (error) {
      console.error('Error adding scan:', error);
      toast({
        title: "Error",
        description: "Failed to save scan results",
        variant: "destructive",
      });
    }
  };

  return { scans, loading, addScan, refetch: fetchScans };
};
