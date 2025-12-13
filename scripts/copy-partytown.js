import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const source = join(rootDir, 'node_modules/@qwik.dev/partytown/lib');
const dest = join(rootDir, 'public/~partytown');

try {
  // Check if source exists
  if (!existsSync(source)) {
    console.error('❌ Partytown source not found at:', source);
    process.exit(1);
  }

  // Create destination directory
  mkdirSync(dest, { recursive: true });

  // Copy files
  cpSync(source, dest, { recursive: true });

  console.log('✅ Partytown files copied successfully');
} catch (error) {
  console.error('❌ Failed to copy Partytown files:', error.message);
  process.exit(1);
}
