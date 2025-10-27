import { useState } from 'react';
import { Video, VideoOff, Minimize2, Maximize2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useEmotionDetection } from '@/hooks/useEmotionDetection';

interface WebcamPreviewProps {
  enabled: boolean;
  onEmotionUpdate?: (emotion: string, confidence: number) => void;
}

export const WebcamPreview = ({ enabled, onEmotionUpdate }: WebcamPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    videoRef,
    canvasRef,
    isActive,
    currentEmotion,
    confidence,
    error,
    startWebcam,
    stopWebcam,
  } = useEmotionDetection({
    enabled,
    onEmotionUpdate,
    captureInterval: 500,
  });

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div
        className={`fixed bottom-20 right-4 z-40 glass-effect rounded-xl overflow-hidden border-primary/30 glow-primary transition-all duration-300 ${
          isExpanded ? 'w-96 h-72' : 'w-48 h-36'
        }`}
      >
        <div className="relative w-full h-full">
          {isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-500/80 text-white px-2 py-1 rounded text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Camera Active
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white">
                <span className="font-semibold capitalize">{currentEmotion}</span>
                <span className="text-gray-300 ml-2">{Math.round(confidence)}%</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-2">
              <VideoOff className="w-8 h-8 text-muted-foreground" />
              {error && (
                <div className="flex items-center gap-1 text-xs text-destructive px-2 text-center">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 opacity-80 hover:opacity-100"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 opacity-80 hover:opacity-100"
              onClick={() => {
                if (isActive) {
                  stopWebcam();
                } else {
                  startWebcam();
                }
              }}
            >
              {isActive ? (
                <VideoOff className="w-4 h-4" />
              ) : (
                <Video className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
