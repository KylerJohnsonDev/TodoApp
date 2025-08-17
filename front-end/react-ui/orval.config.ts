import { defineConfig } from 'orval';

export default defineConfig({
  todoAPI: {
    input: 'http://localhost:5000/openapi/v1.json',
    output: {
      clean: true,
      mode: 'tags-split',
      target: 'src/__generated__/todoAPI',
      // schemas: 'src/__generated__/model',
      client: 'react-query',
      httpClient: 'axios',
      mock: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
