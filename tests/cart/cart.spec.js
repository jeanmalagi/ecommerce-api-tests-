import { expect } from '@playwright/test';
import { test } from '../../fixtures/auth.fixture.js';
import { createProductData } from '../../factories/product.factory.js';
import { authHeaders } from '../../utils/authHeaders.js';

let productId;

//
// ✅ Setup produto único
//
test.beforeAll(async ({ request, adminToken }) => {

  const productData = createProductData();

  const response = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: productData,
  });

  const product = await response.json();
  productId = product.id;
});

//
// ✅ Adicionar ao carrinho
//
test('deve adicionar produto ao carrinho', async ({ request, userToken }) => {

  const response = await request.post('/api/cart', {
    headers: authHeaders(userToken),
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  expect(response.status()).toBe(201);
});

//
// ✅ Listar carrinho
//
test('deve listar itens do carrinho', async ({ request, userToken }) => {

  // garantir item existente
  await request.post('/api/cart', {
    headers: authHeaders(userToken),
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  const response = await request.get('/api/cart', {
    headers: authHeaders(userToken),
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.cart)).toBe(true);
});

//
// ✅ Atualizar carrinho
//
test('deve atualizar quantidade do carrinho', async ({ request, userToken }) => {

  const headers = authHeaders(userToken);

  const create = await request.post('/api/cart', {
    headers,
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  const cart = await create.json();

  const update = await request.put(`/api/cart/${cart.id}`, {
    headers,
    data: {
      quantity: 3,
    },
  });

  expect(update.status()).toBe(200);
});

//
// ✅ Remover carrinho
//
test('deve remover item do carrinho', async ({ request, userToken }) => {

  const headers = authHeaders(userToken);

  const create = await request.post('/api/cart', {
    headers,
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  const cart = await create.json();

  const response = await request.delete(`/api/cart/${cart.id}`, {
    headers,
  });

  expect(response.status()).toBe(200);
});

//
// ✅ Sem token
//
test('não deve acessar carrinho sem token', async ({ request }) => {

  const response = await request.get('/api/cart');

  expect(response.status()).toBe(401);
});

//
// ✅ Produto inválido
//
test('não deve adicionar produto inválido', async ({ request, userToken }) => {

  const response = await request.post('/api/cart', {
    headers: authHeaders(userToken),
    data: {
      product_id: 999999,
      quantity: 1,
    },
  });

  expect(response.status()).toBeGreaterThanOrEqual(400);
});