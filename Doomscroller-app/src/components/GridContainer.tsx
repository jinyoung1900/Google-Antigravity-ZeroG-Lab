'use client';

import { useGridStore } from '@/store/useGridStore';
import VideoTile from './VideoTile';
import FocusOverlay from './FocusOverlay';
import { Skull } from 'lucide-react';
import { useEffect } from 'react';

export default function GridContainer({ initialVideos }: { initialVideos: Record<string, any[]> }) {
  const gridSize = useGridStore((state) => state.gridSize);
  const initializeTiles = useGridStore((state) => state.initializeTiles);
  const triggerCleanse = useGridStore((state) => state.triggerCleanse);
  const uncleanse = useGridStore((state) => state.uncleanse);
  const cleansed = useGridStore((state) => state.cleansed);

  useEffect(() => {
    initializeTiles(initialVideos);
  }, [initialVideos, initializeTiles]);

  const tileIds = Array.from({ length: gridSize }).map((_, i) => `tile-${i}`);

  // Mobile layout mapping
  // 4 screens: 2x2
  // 6 screens: 2x3
  // 8 screens: 2x4
  const gridClasses = {
    4: 'grid-cols-2 grid-rows-2',
    6: 'grid-cols-2 grid-rows-3',
    8: 'grid-cols-2 grid-rows-4',
  }[gridSize] || 'grid-cols-2 grid-rows-4';

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className={`w-full h-full grid ${gridClasses} gap-0`}>
        {tileIds.map(id => (
          <VideoTile key={id} tileId={id} />
        ))}
      </div>

      <FocusOverlay />

      {/* The Cleanse / Panic Button */}
      <button
        onClick={() => cleansed ? uncleanse() : triggerCleanse()}
        className="fixed top-4 right-4 z-40 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full drop-shadow-xl transition-transform active:scale-95"
        title="Panic Button / Cleanse"
      >
        <Skull size={24} />
      </button>

      {/* The Rot Dial (Grid Size Control) */}
      <div className="fixed bottom-4 right-4 z-40 flex bg-black/80 rounded-full border border-zinc-800 backdrop-blur-md overflow-hidden">
        {[4, 6, 8].map((size) => (
          <button
            key={size}
            onClick={() => useGridStore.getState().setGridSize(size)}
            className={`px-4 py-2 text-sm font-bold transition-colors ${gridSize === size ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
