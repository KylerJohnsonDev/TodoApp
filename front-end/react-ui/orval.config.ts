import { faker } from '@faker-js/faker';
import { defineConfig } from 'orval';

export default defineConfig({
  todoAPI: {
    input: {
      target: 'http://localhost:5000/swagger/v1/swagger.json',
      validation: false,
    },
    output: {
      clean: true,
      mode: 'tags-split',
      target: 'src/__generated__/todoAPI',
      client: 'react-query',
      httpClient: 'axios',
      mock: true,
      override: {
        operations: {
          GetTodos: {
            mock: {
              data: () => {
                return Array.from({ length: 10 }, () => ({
                  id: faker.number.int({ min: 1, max: 100 }),
                  text: faker.lorem.sentence(),
                  createdAt: faker.date.past(),
                  status: faker.number.int({ min: 0, max: 2 }),
                  completedAt: undefined,
                }));
              },
            },
          },
          GetUserActionLogs: {
            mock: {
              data: () => {
                return Array.from({ length: 5 }, () => ({
                  id: faker.number.int({ min: 1, max: 100 }),
                  userId: faker.number.int({ min: 1, max: 10 }),
                  action: faker.lorem.word(),
                  timestamp: faker.date.past(),
                }));
              },
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
