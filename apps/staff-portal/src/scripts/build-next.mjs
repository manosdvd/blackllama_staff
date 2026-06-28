import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const tempDir = join(process.cwd(), '.next-tmp');
const nodeModulesDir = join(process.cwd(), 'node_modules');
mkdirSync(tempDir, { recursive: true });

const nextCli = join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const result = spawnSync(process.execPath, [nextCli, 'build', '--webpack'], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    TEMP: tempDir,
    TMP: tempDir,
    TMPDIR: tempDir,
    NODE_PATH: nodeModulesDir,
  },
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
