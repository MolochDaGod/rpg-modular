#!/usr/bin/env node
/**
 * Grudge Studio — Sync assets to Cloudflare R2
 * Uploads sprites, effects, images, and audio to the grudge-assets bucket.
 *
 * Usage:
 *   node scripts/sync-r2.js                  # Upload all assets
 *   node scripts/sync-r2.js --dry-run        # Preview what would upload
 *   node scripts/sync-r2.js --folder sprites # Upload only sprites/
 *
 * Env vars (required):
 *   CF_ACCOUNT_ID, CF_R2_ACCESS_KEY, CF_R2_SECRET_KEY
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative, posix } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(__dirname, '..', 'public');

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID || 'ee475864561b02d4588180b8b9acf694';
const BUCKET = 'grudge-assets';

const ASSET_FOLDERS = ['sprites', 'effects', 'images', 'icons', 'backgrounds', 'audio'];

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json',
};

function getMimeType(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function walkDir(dir, fileList = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
  } catch (e) {
    // skip inaccessible dirs
  }
  return fileList;
}

async function getExistingKeys(client) {
  const existing = new Map();
  let continuationToken;
  do {
    const resp = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    }));
    for (const obj of resp.Contents || []) {
      existing.set(obj.Key, obj.Size);
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);
  return existing;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const folderIdx = args.indexOf('--folder');
  const onlyFolder = folderIdx >= 0 ? args[folderIdx + 1] : null;

  if (!process.env.CF_R2_ACCESS_KEY || !process.env.CF_R2_SECRET_KEY) {
    console.error('Missing CF_R2_ACCESS_KEY or CF_R2_SECRET_KEY env vars');
    process.exit(1);
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CF_R2_ACCESS_KEY,
      secretAccessKey: process.env.CF_R2_SECRET_KEY,
    },
  });

  console.log('Scanning existing R2 objects...');
  const existing = await getExistingKeys(client);
  console.log(`Found ${existing.size} objects already in R2\n`);

  const folders = onlyFolder ? [onlyFolder] : ASSET_FOLDERS;
  let files = [];
  for (const folder of folders) {
    const dir = join(PUBLIC_DIR, folder);
    const found = walkDir(dir);
    files.push(...found);
  }

  // Filter to uploadable file types
  files = files.filter(f => getMimeType(f) !== 'application/octet-stream');

  // Determine what needs uploading (new or changed size)
  const toUpload = [];
  const skipped = [];
  for (const filePath of files) {
    const key = relative(PUBLIC_DIR, filePath).split('\\').join('/');
    const size = statSync(filePath).size;
    if (existing.has(key) && existing.get(key) === size) {
      skipped.push(key);
    } else {
      toUpload.push({ filePath, key, size });
    }
  }

  console.log(`Total files found: ${files.length}`);
  console.log(`Already up-to-date: ${skipped.length}`);
  console.log(`To upload: ${toUpload.length}`);

  if (dryRun) {
    console.log('\n--- DRY RUN (no uploads) ---');
    for (const { key, size } of toUpload) {
      console.log(`  UPLOAD ${key} (${(size / 1024).toFixed(1)} KB)`);
    }
    return;
  }

  if (toUpload.length === 0) {
    console.log('\nEverything is in sync!');
    return;
  }

  // Upload in parallel batches of 10
  const BATCH_SIZE = 10;
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
    const batch = toUpload.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async ({ filePath, key, size }) => {
      try {
        const body = readFileSync(filePath);
        await client.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: body,
          ContentType: getMimeType(filePath),
          CacheControl: 'public, max-age=31536000, immutable',
        }));
        uploaded++;
        process.stdout.write(`\r  Uploaded ${uploaded}/${toUpload.length}`);
      } catch (err) {
        failed++;
        console.error(`\n  FAIL ${key}: ${err.message}`);
      }
    }));
  }

  console.log(`\n\nDone! ${uploaded} uploaded, ${failed} failed, ${skipped.length} unchanged`);
  console.log(`\nPublic URL pattern: https://pub-<your-id>.r2.dev/<key>`);
  console.log('Set CDN_URL env var in Render to enable CDN loading in the game.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
