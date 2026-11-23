import { create } from 'zustand';

export interface VideoTileState {
  id: string;
  historyQueue: any[]; // will contain video objects
  upcomingQueue: any[];
  currentVideo: any | null;
}

interface GridStore {
  tiles: Record<string, VideoTileState>;
  gridSize: number; // Defaults to 8 for mobile 2x4
  globalPause: boolean;
  focusedTileId: string | null;
  cleansed: boolean;

  setGridSize: (size: number) => void;
  initializeTiles: (initialVideosByTile: Record<string, any[]>) => void;
  nextVideo: (tileId: string) => void;
  prevVideo: (tileId: string) => void;
  focusTile: (tileId: string) => void;
  unfocusTile: () => void;
  triggerCleanse: () => void;
  uncleanse: () => void;
}

export const useGridStore = create<GridStore>((set) => ({
  tiles: {},
  gridSize: 8,
  globalPause: false,
  focusedTileId: null,
  cleansed: false,

  setGridSize: (size) => set({ gridSize: size }),

  initializeTiles: (initialVideosByTile) => set((state) => {
    const newTiles: Record<string, VideoTileState> = {};
    for (const [tileId, videos] of Object.entries(initialVideosByTile)) {
      newTiles[tileId] = {
        id: tileId,
        historyQueue: [],
        upcomingQueue: videos.slice(1),
        currentVideo: videos[0] || null,
      };
    }
    return { tiles: newTiles };
  }),

  nextVideo: (tileId) => set((state) => {
    const tile = state.tiles[tileId];
    if (!tile || tile.upcomingQueue.length === 0) return state; // End of queue

    const nextVid = tile.upcomingQueue[0];
    return {
      tiles: {
        ...state.tiles,
        [tileId]: {
          ...tile,
          historyQueue: [...tile.historyQueue, tile.currentVideo].filter(Boolean),
          currentVideo: nextVid,
          upcomingQueue: tile.upcomingQueue.slice(1),
        }
      }
    };
  }),

  prevVideo: (tileId) => set((state) => {
    const tile = state.tiles[tileId];
    if (!tile || tile.historyQueue.length === 0) return state;

    const prevVid = tile.historyQueue[tile.historyQueue.length - 1];
    return {
      tiles: {
        ...state.tiles,
        [tileId]: {
          ...tile,
          historyQueue: tile.historyQueue.slice(0, -1),
          currentVideo: prevVid,
          upcomingQueue: [tile.currentVideo, ...tile.upcomingQueue].filter(Boolean),
        }
      }
    };
  }),

  focusTile: (tileId) => set({ focusedTileId: tileId, globalPause: true }),
  
  unfocusTile: () => set({ focusedTileId: null, globalPause: false }),

  triggerCleanse: () => set({ cleansed: true, globalPause: true }),

  uncleanse: () => set({ cleansed: false, globalPause: false }),
}));
