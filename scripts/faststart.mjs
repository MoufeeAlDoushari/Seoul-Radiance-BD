/**
 * Move an MP4's `moov` atom in front of `mdat` ("faststart") so browsers can
 * begin playback while the file is still downloading.
 *
 * The uploaded background clip had moov at the very end, which forces a browser
 * to fetch all 20.7 MB before it can render a single frame.
 *
 * Chunk offsets in stco/co64 are absolute file offsets, so every entry has to be
 * shifted by the size of the moov box once moov moves ahead of mdat.
 *
 * Usage: node scripts/faststart.mjs <in.mp4> <out.mp4>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const CONTAINERS = new Set([
  'moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf', 'mvex', 'udta',
]);

/** Walk a box payload, invoking fn(type, absoluteBoxStart) for every box. */
function walk(buf, start, end, fn) {
  let pos = start;
  while (pos + 8 <= end) {
    let size = buf.readUInt32BE(pos);
    const type = buf.toString('latin1', pos + 4, pos + 8);
    let headerSize = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(pos + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < headerSize) break;

    fn(type, pos, headerSize, size);
    if (CONTAINERS.has(type)) walk(buf, pos + headerSize, pos + size, fn);
    pos += size;
  }
}

function topLevelBoxes(buf) {
  const boxes = [];
  walkTop: {
    let pos = 0;
    while (pos + 8 <= buf.length) {
      let size = buf.readUInt32BE(pos);
      const type = buf.toString('latin1', pos + 4, pos + 8);
      if (size === 1) size = Number(buf.readBigUInt64BE(pos + 8));
      if (size < 8) break walkTop;
      boxes.push({ type, start: pos, size });
      pos += size;
    }
  }
  return boxes;
}

const [inPath, outPath] = process.argv.slice(2);
if (!inPath || !outPath) {
  console.error('usage: node scripts/faststart.mjs <in.mp4> <out.mp4>');
  process.exit(1);
}

const src = readFileSync(inPath);
const boxes = topLevelBoxes(src);
const moovBox = boxes.find((b) => b.type === 'moov');
const mdatBox = boxes.find((b) => b.type === 'mdat');

if (!moovBox || !mdatBox) {
  console.error('could not find both moov and mdat');
  process.exit(1);
}

if (moovBox.start < mdatBox.start) {
  console.log('already faststart — copying unchanged');
  writeFileSync(outPath, src);
  process.exit(0);
}

// Copy moov out so we can patch its offset tables in isolation.
const moov = Buffer.from(src.subarray(moovBox.start, moovBox.start + moovBox.size));
const shift = moov.length;

let stcoEntries = 0;
let co64Entries = 0;
walk(moov, 0, moov.length, (type, pos, headerSize, size) => {
  if (type === 'stco') {
    const count = moov.readUInt32BE(pos + headerSize + 4);
    let p = pos + headerSize + 8;
    for (let i = 0; i < count; i++, p += 4) {
      moov.writeUInt32BE(moov.readUInt32BE(p) + shift, p);
      stcoEntries++;
    }
  } else if (type === 'co64') {
    const count = moov.readUInt32BE(pos + headerSize + 4);
    let p = pos + headerSize + 8;
    for (let i = 0; i < count; i++, p += 8) {
      moov.writeBigUInt64BE(moov.readBigUInt64BE(p) + BigInt(shift), p);
      co64Entries++;
    }
  }
});

// Reassemble: everything except moov, in original order, with moov spliced in
// immediately before mdat.
const parts = [];
for (const b of boxes) {
  if (b.type === 'moov') continue;
  if (b.type === 'mdat') parts.push(moov);
  parts.push(src.subarray(b.start, b.start + b.size));
}

const out = Buffer.concat(parts);
writeFileSync(outPath, out);

console.log(
  `faststart written: shift=${shift}B, stco entries patched=${stcoEntries}, co64=${co64Entries}, ` +
    `in=${src.length}B out=${out.length}B`
);
