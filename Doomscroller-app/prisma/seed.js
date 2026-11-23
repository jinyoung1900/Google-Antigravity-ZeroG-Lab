const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 19 locally downloaded videos (v09 failed, skip it)
const LOCAL_VIDEOS = [
  "/videos/v01.mp4",
  "/videos/v02.mp4",
  "/videos/v03.mp4",
  "/videos/v04.mp4",
  "/videos/v05.mp4",
  "/videos/v06.mp4",
  "/videos/v07.mp4",
  "/videos/v08.mp4",
  "/videos/v10.mp4",
  "/videos/v11.mp4",
  "/videos/v12.mp4",
  "/videos/v13.mp4",
  "/videos/v14.mp4",
  "/videos/v15.mp4",
  "/videos/v16.mp4",
  "/videos/v17.mp4",
  "/videos/v18.mp4",
  "/videos/v19.mp4",
  "/videos/v20.mp4",
];

const AUTHORS = [
  "@brainrot_king", "@doom_scroller", "@void_gazer",
  "@overstim_addict", "@noise_maker", "@glitch_entity",
  "@pixel_rot", "@scroll_demon", "@feed_fiend", "@chaos_engine"
];

const CAPTIONS = [
  "wait for it... 💀",
  "this is so unhinged",
  "POV: you can't stop scrolling",
  "the algorithm sent me here",
  "brainrot speedrun any%",
  "i need to go outside",
  "who else watching at 3am",
  "me when the doom scrolls back",
  "certified brainrot moment",
  "the overstimulation is real",
];

async function main() {
  console.log("Seeding database with 19 unique local videos...");
  await prisma.video.deleteMany();

  // Create one entry per video with unique metadata
  for (let i = 0; i < LOCAL_VIDEOS.length; i++) {
    await prisma.video.create({
      data: {
        url: LOCAL_VIDEOS[i],
        author: AUTHORS[i % AUTHORS.length],
        likes: Math.floor(Math.random() * 1000000),
        comments: Math.floor(Math.random() * 50000),
        duration: 5 + Math.random() * 25,
      }
    });
  }

  // Add 31 more shuffled entries so each tile has a deep queue
  for (let i = 0; i < 31; i++) {
    await prisma.video.create({
      data: {
        url: LOCAL_VIDEOS[Math.floor(Math.random() * LOCAL_VIDEOS.length)],
        author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
        likes: Math.floor(Math.random() * 1000000),
        comments: Math.floor(Math.random() * 50000),
        duration: 5 + Math.random() * 25,
      }
    });
  }

  const count = await prisma.video.count();
  console.log(`Database seeded with ${count} video entries (19 unique clips).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
