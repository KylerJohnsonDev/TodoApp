import { defineConfig } from 'orval';


export default defineConfig({

  todoApp: {

    input: 'http://localhost:5000/openapi/v1.json',

    output: {
      mode: 'tags-split',
      target: 'src/__generated__/todo-api.ts',
      schemas: 'src/__generated__/model',
      client: 'react-query',
      mock: true,
    },

    hooks: {

      afterAllFilesWrite: 'prettier --write',

    },

  },

});