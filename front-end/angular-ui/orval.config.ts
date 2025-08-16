import { faker } from '@faker-js/faker';
import { defineConfig } from 'orval';

export default defineConfig({
  todoApp: {
    input: 'http://localhost:5000/swagger/v1/swagger.json',
    output: {
      mode: 'tags-split',
      target: 'src/app/__generated__/todo-api.ts',
      schemas: 'src/app/__generated__/model',
      client: 'angular',
      // httpClient: 'axios', // Not used for Angular client
      mock: true,
      override: {
        operations: {
          GetTodos: {
            mock: {
              properties: () => ({
                id: () => faker.number.int({ min: 1, max: 100 }),
                title: () => faker.lorem.sentence(),
                created: () => faker.date.past(),
                status: () => faker.number.int({ min: 0, max: 2 }),
                dateCompleted: () => undefined,
              }),
            },
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
