import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    preserveModules: true,
  },
  plugins: [
    typescript(),
    replace({
      'PKG_NAME': pkg.name,
      'PKG_VERSION': pkg.version,
      preventAssignment: true,
    }),
  ],
};
