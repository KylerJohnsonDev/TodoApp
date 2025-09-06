// orval.config.ts

import { faker } from '@faker-js/faker';
import { defineConfig } from 'orval';

export default defineConfig({
  todoAPI: {
    input: {
      target: 'http://localhost:5000/swagger/v1/swagger.json',
      validation: false,
    },
    output: {
      mode: 'tags-split',
      target: 'src/app/__generated__/todoAPI',
      namingConvention: 'kebab-case',
      client: 'angular',
      docs: {
        out: './docs-markdown',
        disableSources: true,
        theme: '',
      },
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
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
