export const test = base.extend({

  userToken: async ({ request }, use) => {

    // ✅ garante usuário
    await request.post('/api/users/register', {
      data: {
        name: 'User',
        email: 'cliente@email.com',
        password: '123456',
      },
    });

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

    // ✅ garante admin
    await request.post('/api/users/register', {
      data: {
        name: 'Admin',
        email: 'admin@email.com',
        password: '123456',
        isAdmin: true
      },
    });

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