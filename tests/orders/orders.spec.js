import { test } from '../../fixtures/auth.fixture.js';
import { expect } from '@playwright/test';
import { createProductData } from '../../factories/product.factory.js';
import { authHeaders } from '../../utils/authHeaders.js';

//
// ✅ Criar pedido completo
//

test('deve criar pedido com item do carrinho', async ({ request, userToken }) => {

  // ✅ criar produto
  const productRes = await request.post('/api/products', {
    headers: {
      Authorization: `Bearer ${userToken}`
    },
    data: {
      name: `Produto-${Date.now()}`,
      description: 'Produto teste',
      price: '50.00',
      stock: 10,
      category: 'Games'
    }
  });

  expect(productRes.status()).toBe(201);

  const product = await productRes.json();

  // ✅ adicionar ao carrinho
  const cartRes = await request.post('/api/cart', {
    headers: {
      Authorization: `Bearer ${userToken}`
    },
    data: {
      product_id: product.id,
      quantity: 1
    }
  });

  expect(cartRes.status()).toBe(201);

  // ✅ criar pedido
  const orderRes = await request.post('/api/orders', {
    headers: {
      Authorization: `Bearer ${userToken}`
    }
  });

  expect(orderRes.status()).toBe(201);

  const body = await orderRes.json();

  expect(body).toHaveProperty('order');
  expect(body.order).toHaveProperty('id');
});

//
// ✅ Listar pedidos do usuário
//
test('deve listar pedidos do usuário', async ({ request, userToken, adminToken }) => {

  // ✅ cria produto
  const productData = createProductData();

  const productRes = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: productData,
  });

  const product = await productRes.json();

  // ✅ adiciona ao carrinho
  await request.post('/api/cart', {
    headers: authHeaders(userToken),
    data: {
      product_id: product.id,
      quantity: 1,
    },
  });

  // ✅ cria pedido
  await request.post('/api/orders', {
    headers: authHeaders(userToken),
    data: {
      items: [
        {
          product_id: product.id,
          quantity: 1,
        },
      ],
    },
  });

  // ✅ lista pedidos
  const response = await request.get('/api/orders', {
    headers: authHeaders(userToken),
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
});

//
// ✅ Não deve criar pedido sem token
//
test('não deve criar pedido sem autenticação', async ({ request }) => {

  const response = await request.post('/api/orders', {
    data: {
      items: [
        {
          product_id: 1,
          quantity: 1,
        },
      ],
    },
  });

  expect(response.status()).toBe(401);
});

//
// ✅ Não deve criar pedido com produto inválido
//
test('não deve criar pedido com produto inválido', async ({ request, userToken }) => {

  const response = await request.post('/api/orders', {
    headers: authHeaders(userToken),
    data: {
      items: [
        {
          product_id: 999999,
          quantity: 1,
        },
      ],
    },
  });

  expect(response.status()).toBeGreaterThanOrEqual(400);
});