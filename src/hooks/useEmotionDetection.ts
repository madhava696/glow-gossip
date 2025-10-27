import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/services/api';
import { setEmotion } from '@/services/emotionStorage';

interface UseEmotionDetectionProps {
  enabled: boolean;
  onEmotionUpdate?: (emotion: string, confidence: number) => void;
  captureInterval?: number;
}

export const useEmotionDetection = ({ 
  enabled, 
  onEmotionUpdate,
  captureInterval = 500 
}: UseEmotionDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    try {
      const result = await api.sendFrame(base64Frame);
      setCurrentEmotion(result.emotion);
      setConfidence(result.confidence);
      setEmotion(result.emotion);
      onEmotionUpdate?.(result.emotion, result.confidence);
      setError(null);
    } catch (err) {
      console.error('Error analyzing frame:', err);
      setError('Backend unavailable');
      setEmotion('neutral');
    }
  }, [isActive, onEmotionUpdate]);

  const startWebcam = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsActive(true);
      setError(null);
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera permission denied');
      setIsActive(false);
    }
  }, []);

  const stopWebcam = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    try {
      await api.stopEmotionDetection();
    } catch (err) {
      console.error('Error stopping detection:', err);
    }

    setIsActive(false);
  }, [stream]);

  useEffect(() => {
    if (enabled && !stream) {
      startWebcam();
    } else if (!enabled && stream) {
      stopWebcam();
    }
  }, [enabled, stream, startWebcam, stopWebcam]);

  useEffect(() => {
    if (isActive && enabled) {
      intervalRef.current = setInterval(captureAndAnalyze, captureInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, enabled, captureInterval, captureAndAnalyze]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (!document.hidden && isActive && enabled) {
        intervalRef.current = setInterval(captureAndAnalyze, captureInterval);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, enabled, captureInterval, captureAndAnalyze]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    canvasRef,
    isActive,
    currentEmotion,
    confidence,
    error,
    startWebcam,
    stopWebcam,
  };
};
