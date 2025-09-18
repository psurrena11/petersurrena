import { resolve } from 'path';
import { defineConfig } from 'vite';
import { globSync } from 'glob';

export default defineConfig({
  define: {
    global: {},
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        globSync('**/*.html', { ignore: ['dist/**', 'node_modules/**'] }).map(file => [
          // This part generates the correct output name for the file
          file.slice(0, file.length - '.html'.length),
          resolve(__dirname, file)
        ])
      ),
    },
  },
});