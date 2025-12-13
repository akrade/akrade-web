import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Try multiple possible locations for the Partytown library
const possibleSources = [
  join(rootDir, 'node_modules/@qwik.dev/partytown/lib'),
  join(rootDir, 'node_modules/.pnpm/@qwik.dev+partytown@0.11.2/node_modules/@qwik.dev/partytown/lib'),
  resolve(rootDir, 'node_modules/@qwik.dev/partytown/lib'),
];

const dest = join(rootDir, 'public/~partytown');

let source = null;

// Find the first existing source
for (const possibleSource of possibleSources) {
  if (existsSync(possibleSource)) {
    source = possibleSource;
    console.log('✅ Found Partytown source at:', source);
    break;
  }
}

if (!source) {
  console.error('❌ Partytown source not found. Tried:');
  possibleSources.forEach(path => console.error('  -', path));
  process.exit(1);
}

try {
  // Create destination directory
  mkdirSync(dest, { recursive: true });

  // Copy files
  cpSync(source, dest, { recursive: true });

  console.log('✅ Partytown files copied successfully to:', dest);
} catch (error) {
  console.error('❌ Failed to copy Partytown files:', error.message);
  process.exit(1);
}
