import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * `@australiangreens/ag-internal-components/pwa` exists so an app without Auth0, the data grid
 * and the rest of this library (for example the public how-to-vote site) can use the install
 * hint without bundling any of it. That only holds while this folder imports nothing but React
 * and MUI, and nothing from elsewhere in the library.
 */
const ALLOWED_PACKAGES = [/^react$/, /^@mui\//];

const sourceFiles = readdirSync(__dirname).filter(
  (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file)
);

const importsOf = (file: string) =>
  [...readFileSync(join(__dirname, file), 'utf8').matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);

describe('pwa entry point isolation', () => {
  it('finds the source files to check', () => {
    expect(sourceFiles).toEqual(
      expect.arrayContaining(['InstallHint.tsx', 'usePwaInstall.ts', 'pwaInstallPrompt.ts'])
    );
  });

  it.each(sourceFiles)('%s imports only react, MUI, or siblings in this folder', (file) => {
    const offenders = importsOf(file).filter((id) => {
      if (id.startsWith('./')) return false;
      return !ALLOWED_PACKAGES.some((allowed) => allowed.test(id));
    });
    expect(offenders).toEqual([]);
  });
});
