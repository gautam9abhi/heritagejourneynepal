
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';

interface EmergencyNotice {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const EmergencyNotice = () => {
  const [notices, setNotices] = useState<EmergencyNotice[]>([]);
  const [dismissedNotices, setDismissedNotices] = useState<string[]>(() => {
    const saved = localStorage.getItem('dismissedNotices');
    return saved ? JSON.parse(saved) : [];
  });
  const [showDialog, setShowDialog] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<EmergencyNotice | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_notices')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Filter and cast the data to ensure type safety
        if (data) {
          const typedNotices = data
            .filter(notice => ['info', 'warning', 'critical', 'success'].includes(notice.severity))
            .map(notice => ({
              id: notice.id,
              title: notice.title,
              message: notice.message,
              severity: notice.severity as 'critical' | 'warning' | 'info' | 'success',
              is_active: notice.is_active,
              created_at: notice.created_at,
              updated_at: notice.updated_at,
            }));
          
          setNotices(typedNotices);
          
          // Show dialog for the most critical notice that hasn't been dismissed
          const activeNotices = typedNotices.filter(notice => !dismissedNotices.includes(notice.id));
          if (activeNotices.length > 0) {
            // Sort by severity: critical first, then warning, then info
            const sortedNotices = [...activeNotices].sort((a, b) => {
              const severityOrder = { critical: 0, warning: 1, info: 2, success: 3 };
              return severityOrder[a.severity] - severityOrder[b.severity];
            });
            
            setCurrentNotice(sortedNotices[0]);
            setShowDialog(true);
          }
        }
      } catch (error) {
        console.error('Error fetching emergency notices:', error);
      }
    };

    fetchNotices();

    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('emergency_notices_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_notices' },
        fetchNotices
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [dismissedNotices]);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissedNotices, id];
    setDismissedNotices(newDismissed);
    localStorage.setItem('dismissedNotices', JSON.stringify(newDismissed));
    setShowDialog(false);
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600/90 backdrop-blur-md border-red-400/20';
      case 'warning':
        return 'bg-amber-600/90 backdrop-blur-md border-amber-400/20';
      case 'info':
        return 'bg-blue-600/90 backdrop-blur-md border-blue-400/20';
      case 'success':
        return 'bg-green-600/90 backdrop-blur-md border-green-400/20';
      default:
        return 'bg-red-600/90 backdrop-blur-md border-red-400/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'destructive';
    }
  };

  // If no active notices or all dismissed, return null
  if (!currentNotice || notices.length === 0) return null;

  return (
    <>
      {/* Emergency Notice Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className={`border-2 ${
          currentNotice.severity === 'critical' ? 'border-red-500' : 
          currentNotice.severity === 'warning' ? 'border-amber-500' : 
          currentNotice.severity === 'info' ? 'border-blue-500' : 
          'border-green-500'
        }`}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`${
                currentNotice.severity === 'critical' ? 'text-red-500' : 
                currentNotice.severity === 'warning' ? 'text-amber-500' : 
                currentNotice.severity === 'info' ? 'text-blue-500' : 
                'text-green-500'
              }`} />
              <DialogTitle className="text-xl">
                {currentNotice.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <Badge variant={getSeverityBadge(currentNotice.severity) as any} className="mb-2">
              {currentNotice.severity.toUpperCase()}
            </Badge>
            <div className="mt-2 text-base" dangerouslySetInnerHTML={{ __html: currentNotice.message }} />
          </div>
          
          <DialogFooter>
            <Button onClick={() => handleDismiss(currentNotice.id)}>
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Banner for the most critical notice (shown at the top of the page) */}
      <div className="fixed inset-x-0 top-0 z-50">
        {notices
          .filter(notice => !dismissedNotices.includes(notice.id))
          .map((notice) => (
            <div
              key={notice.id}
              className={`${getSeverityClass(notice.severity)} px-4 py-3 shadow-lg border-t flex items-center justify-between text-white transition-all duration-500 animate-fade-in`}
            >
              <div className="flex items-center space-x-3">
                <Badge variant={getSeverityBadge(notice.severity) as any} className="uppercase">
                  {notice.severity}
                </Badge>
                <div>
                  <span className="font-bold">{notice.title}:</span>{' '}
                  <span dangerouslySetInnerHTML={{ __html: notice.message }} />
                </div>
              </div>
              <button
                onClick={() => handleDismiss(notice.id)}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          ))}
      </div>
    </>
  );
};

export default EmergencyNotice;
