import { expect } from '@playwright/test';
import { test } from '../../fixtures/auth.fixture.js';
import { createProductData } from '../../factories/product.factory.js';
import { authHeaders } from '../../utils/authHeaders.js';

//
// ✅ Criar pedido completo
//
test('deve criar pedido com item do carrinho', async ({ request, userToken, adminToken }) => {

  // ✅ cria produto
  const productData = createProductData();

  const productRes = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: productData,
  });

  expect(productRes.status()).toBe(201);

  const product = await productRes.json();

  // ✅ adiciona ao carrinho
  const cartRes = await request.post('/api/cart', {
    headers: authHeaders(userToken),
    data: {
      product_id: product.id,
      quantity: 1,
    },
  });

  expect(cartRes.status()).toBe(201);

  const cart = await cartRes.json();

  // ✅ cria pedido
  const orderRes = await request.post('/api/orders', {
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

  expect(orderRes.status()).toBe(201);

  const order = await orderRes.json();

  expect(order).toHaveProperty('id');
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