import { prisma } from '@/lib/prisma';
import GridContainer from '@/components/GridContainer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // We need to fetch enough videos for 8 tiles to each have a small queue.
  // We seeded 50 videos.
  const allVideos = await prisma.video.findMany({
    take: 50,
  });

  // Shuffle function
  const shuffle = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Group videos into initial queues for each of the maximum 8 tiles
  const initialVideosByTile: Record<string, any[]> = {};
  for (let i = 0; i < 8; i++) {
    // Give each tile a shuffled subset of videos
    initialVideosByTile[`tile-${i}`] = shuffle(allVideos);
  }

  return (
    <main className="w-full h-screen bg-black overflow-hidden m-0 p-0">
      <GridContainer initialVideos={initialVideosByTile} />
    </main>
  );
}
