'use client';

import { useGridStore } from '@/store/useGridStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function FocusOverlay() {
  const focusedTileId = useGridStore((state) => state.focusedTileId);
  const tiles = useGridStore((state) => state.tiles);
  const unfocusTile = useGridStore((state) => state.unfocusTile);
  const cleansed = useGridStore((state) => state.cleansed);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (cleansed) unfocusTile();
  }, [cleansed, unfocusTile]);

  if (!focusedTileId || !tiles[focusedTileId]) return null;

  const currentVid = tiles[focusedTileId].currentVideo;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        <button 
          onClick={unfocusTile}
          className="absolute top-6 left-4 z-50 p-2 bg-black/50 rounded-full text-white"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="relative flex-1 w-full h-full bg-black">
          <video
            ref={videoRef}
            src={currentVid?.url}
            autoPlay
            playsInline
            controls
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-10 left-4 right-20 flex flex-col gap-2 text-white drop-shadow-md">
            <h2 className="font-bold text-xl">{currentVid?.author}</h2>
            <p className="text-sm opacity-80">This is a doomscroller focused video description. Overstimulation achieved.</p>
          </div>

          <div className="absolute bottom-10 right-4 flex flex-col gap-6 items-center text-white drop-shadow-md">
            <div className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Heart fill="white" size={28} />
              </div>
              <span className="text-xs font-bold">{currentVid?.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <MessageCircle fill="white" size={28} />
              </div>
              <span className="text-xs font-bold">{currentVid?.comments}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
