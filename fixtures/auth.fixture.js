import { test as base } from '@playwright/test';

export const test = base.extend({

  userToken: async ({ request }, use) => {

    const response = await request.post('/api/users/login', {
      data: {
        email: 'cliente@email.com',
        password: '123456',
      },
    });

    const body = await response.json();
    await use(body.token);
  },

  adminToken: async ({ request }, use) => {

    const response = await request.post('/api/users/login', {
      data: {
        email: 'admin@email.com',
        password: '123456',
      },
    });

    const body = await response.json();
    await use(body.token);
  },
});