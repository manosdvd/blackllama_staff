import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const appDir = join(root, 'apps', 'staff-portal');
const distDir = join(root, 'dist');
const outDir = join(appDir, 'out');
const npmCli = process.env.npm_execpath;

if (!npmCli) {
  console.error('Unable to locate the npm CLI from the current environment.');
  process.exit(1);
}

const run = (args) => {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(result.error);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(['--prefix', appDir, 'ci']);
run(['--prefix', appDir, 'run', 'build']);

if (!existsSync(outDir)) {
  console.error(`Expected static export was not created: ${outDir}`);
  process.exit(1);
}

rmSync(distDir, { recursive: true, force: true });
cpSync(outDir, distDir, { recursive: true });
