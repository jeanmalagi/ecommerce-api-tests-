import { test, expect } from '@playwright/test';

// ✅ Admin: acesso negado (UI)
// Verifica que usuário não-admin é redirecionado ao acessar /admin diretamente

test('usuário comum é redirecionado ao acessar rota admin', async ({ page }) => {
  // abre a aplicação para garantir mesmo domínio
  await page.goto('/');

  // define localStorage como usuário comum
  await page.evaluate(() => {
    localStorage.setItem('user', JSON.stringify({
      name: 'Cliente Test',
      email: 'cliente@email.com',
      is_admin: false,
    }));

    // token opcional (não necessário para AdminRoute, mas deixa mais realista)
    localStorage.setItem('token', 'token-de-teste');
  });

  // tenta navegar para área admin
  await page.goto('/admin');

  // deve ser redirecionado para /products
  await expect(page).toHaveURL(/\/products$/);
});
