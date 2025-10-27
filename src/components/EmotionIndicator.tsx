import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { getLatestEmotion } from '@/services/emotionStorage';

interface EmotionIndicatorProps {
  enabled: boolean;
  currentEmotion?: string;
  confidence?: number;
}

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprised: '😮',
  neutral: '😐',
  fearful: '😨',
  disgusted: '🤢',
};

export const EmotionIndicator = ({ 
  enabled, 
  currentEmotion, 
  confidence 
}: EmotionIndicatorProps) => {
  const [emotion, setEmotion] = useState<string>('neutral');
  const [conf, setConf] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (!currentEmotion) {
        const storedEmotion = getLatestEmotion();
        setEmotion(storedEmotion);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, currentEmotion]);

  useEffect(() => {
    if (currentEmotion) {
      setEmotion(currentEmotion);
    }
    if (confidence !== undefined) {
      setConf(Math.round(confidence));
    }
  }, [currentEmotion, confidence]);

  if (!enabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 glass-effect rounded-xl px-4 py-3 border-primary/30 glow-primary animate-fade-in">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-primary animate-pulse" />
        <div>
          <div className="text-sm font-medium flex items-center gap-2">
            <span>{emotionEmojis[emotion] || '😐'}</span>
            <span className="capitalize text-foreground">{emotion}</span>
          </div>
          {conf > 0 && (
            <div className="text-xs text-muted-foreground">
              Confidence: {conf}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
