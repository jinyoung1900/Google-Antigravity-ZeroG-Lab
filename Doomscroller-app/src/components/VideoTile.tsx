'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGridStore } from '@/store/useGridStore';

export default function VideoTile({ tileId }: { tileId: string }) {
  const tileState = useGridStore((state) => state.tiles[tileId]);
  const globalPause = useGridStore((state) => state.globalPause);
  const cleansed = useGridStore((state) => state.cleansed);
  const nextVideo = useGridStore((state) => state.nextVideo);
  const prevVideo = useGridStore((state) => state.prevVideo);
  const focusTile = useGridStore((state) => state.focusTile);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-scroll when video ends
  const handleEnded = () => {
    nextVideo(tileId);
  };

  // Reverse scroll handling
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    if (touchStart - touchEnd < -50) {
      // Swiped down -> previous video
      prevVideo(tileId);
    } else if (touchStart - touchEnd > 50) {
      // Swiped up -> next video
      nextVideo(tileId);
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -50) prevVideo(tileId);
    else if (e.deltaY > 50) nextVideo(tileId);
  };

  // Global pause logic
  useEffect(() => {
    if (videoRef.current) {
      if (globalPause || cleansed) {
        videoRef.current.pause();
      } else {
        // Only attempt to play if it was paused by global state, 
        // to avoid autoplay policies we might just let it play.
        videoRef.current.play().catch(() => {});
      }
    }
  }, [globalPause, cleansed]);

  // Cleanse state
  if (cleansed) {
    return <div className="w-full h-full bg-black"></div>;
  }

  if (!tileState || !tileState.currentVideo) {
    return <div className="w-full h-full bg-black animate-pulse"></div>;
  }

  const currentVid = tileState.currentVideo;

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden group cursor-pointer border-none"
      onMouseEnter={() => setIsMuted(false)}
      onMouseLeave={() => setIsMuted(true)}
      onClick={() => focusTile(tileId)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentVid.id}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            ref={videoRef}
            src={currentVid.url}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
