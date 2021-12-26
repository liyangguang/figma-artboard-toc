import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy-watch';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    copy({
      watch: 'src/ui.html',
      targets: [
        {src: 'src/ui.html', dest: 'dist'},
      ],
    }),
  ],
};
