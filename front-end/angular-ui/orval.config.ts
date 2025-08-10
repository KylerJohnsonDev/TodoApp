import { defineConfig } from 'orval';

export default defineConfig({
  todoApp: {
    input: 'http://localhost:5000/openapi/v1.json',
    output: {
      mode: 'tags-split',
      target: 'src/app/__generated__/todo-api.ts',
      schemas: 'src/app/__generated__/model',
      client: 'angular',
      // httpClient: 'axios', // Not used for Angular client
      mock: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
