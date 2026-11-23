const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// All verified publicly accessible video URLs (no auth required)
const VIDEOS = [
  // samplelib.com - various lengths
  { name: "v01.mp4", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
  { name: "v02.mp4", url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4" },
  { name: "v03.mp4", url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4" },
  { name: "v04.mp4", url: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4" },
  { name: "v05.mp4", url: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4" },
  // w3schools
  { name: "v06.mp4", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { name: "v07.mp4", url: "https://www.w3schools.com/html/movie.mp4" },
  // Mazwai / public domain test clips (archive.org)
  { name: "v08.mp4", url: "https://ia601409.us.archive.org/7/items/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4" },
  { name: "v09.mp4", url: "https://ia601409.us.archive.org/7/items/SampleVideo1280x7202mb/SampleVideo_1280x720_2mb.mp4" },
  { name: "v10.mp4", url: "https://ia601409.us.archive.org/7/items/SampleVideo1280x7201mb/SampleVideo_1280x720_1mb.mp4" },
  // MDN samples
  { name: "v11.mp4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  // filesamples.com
  { name: "v12.mp4", url: "https://filesamples.com/samples/video/mp4/sample_640x360.mp4" },
  { name: "v13.mp4", url: "https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4" },
  { name: "v14.mp4", url: "https://filesamples.com/samples/video/mp4/sample_1280x720.mp4" },
  // test-videos.co.uk
  { name: "v15.mp4", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4" },
  { name: "v16.mp4", url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_2MB.mp4" },
  { name: "v17.mp4", url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4" },
  { name: "v18.mp4", url: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_2MB.mp4" },
  { name: "v19.mp4", url: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4" },
  { name: "v20.mp4", url: "https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_2MB.mp4" },
];

const outDir = path.join(__dirname, '..', 'public', 'videos');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const request = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    });
    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Downloading ${VIDEOS.length} videos to ${outDir}...`);
  let success = 0;
  for (let i = 0; i < VIDEOS.length; i++) {
    const v = VIDEOS[i];
    const dest = path.join(outDir, v.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log(`  [${i + 1}/${VIDEOS.length}] ${v.name} already exists, skipping.`);
      success++;
      continue;
    }
    process.stdout.write(`  [${i + 1}/${VIDEOS.length}] Downloading ${v.name}...`);
    try {
      await download(v.url, dest);
      const size = (fs.statSync(dest).size / 1024 / 1024).toFixed(1);
      console.log(` done (${size} MB)`);
      success++;
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }
  console.log(`\nDone! ${success}/${VIDEOS.length} videos downloaded successfully.`);
}

main();
