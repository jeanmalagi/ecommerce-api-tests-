import { expect } from '@playwright/test';
import { test } from '../../fixtures/auth.fixture.js';
import { createProductData } from '../../factories/product.factory.js';
import { authHeaders } from '../../utils/authHeaders.js';

//
// ✅ Criar produto
//
test('deve criar produto', async ({ request, adminToken }) => {

  const productData = createProductData();

  const response = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: productData,
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toHaveProperty('id');
  expect(body.name).toBe(productData.name);
});

//
// ✅ Listar produtos
//
test('deve listar produtos', async ({ request }) => {

  const response = await request.get('/api/products');

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
});

//
// ✅ Buscar produto por ID
//
test('deve buscar produto por ID', async ({ request, adminToken }) => {

  const productData = createProductData();

  const create = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: productData,
  });

  const product = await create.json();

  const response = await request.get(`/api/products/${product.id}`);

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBe(product.id);
});

//
// ✅ Atualizar produto
//
test('deve atualizar produto', async ({ request, adminToken }) => {

  const headers = authHeaders(adminToken);
  const productData = createProductData();

  // ✅ cria produto
  const create = await request.post('/api/products', {
    headers,
    multipart: productData,
  });

  const product = await create.json();

  // ✅ atualiza
  const updatedName = `Produto Atualizado-${Date.now()}`;

const update = await request.put(`/api/products/${product.id}`, {
  headers,
  data: {
    name: updatedName,
    description: "Atualizado",
    price: "100",
    stock: "5",
    category: "Games"
  },
});

// ✅ primeiro pega o body
const body = await update.text();

// ✅ depois valida
expect(update.status()).toBe(200);
});

//
// ✅ Deletar produto
//
test('deve remover produto', async ({ request, adminToken }) => {

  const headers = authHeaders(adminToken);

  // ✅ cria produto
  const create = await request.post('/api/products', {
    headers,
    multipart: createProductData(),
  });

  const product = await create.json();

  // ✅ remove
  const response = await request.delete(`/api/products/${product.id}`, {
    headers,
  });

  expect(response.status()).toBe(200);
});

//
// ✅ Não deve criar produto sem token
//
test('não deve criar produto sem autenticação', async ({ request }) => {

  const response = await request.post('/api/products', {
    multipart: createProductData(),
  });

  expect(response.status()).toBe(401);
});

//
// ✅ Não deve atualizar produto como usuário comum
//
test('não deve permitir update sem permissão', async ({ request, userToken, adminToken }) => {

  // cria produto com admin
  const create = await request.post('/api/products', {
    headers: authHeaders(adminToken),
    multipart: createProductData(),
  });

  const product = await create.json();

  // tenta atualizar com user comum
  const response = await request.put(`/api/products/${product.id}`, {
    headers: authHeaders(userToken),
    data: {
      name: 'Tentativa inválida',
    },
  });

  expect(response.status()).toBeGreaterThanOrEqual(403);
});

//
// ✅ Produto inexistente
//
test('não deve buscar produto inexistente', async ({ request }) => {

  const response = await request.get('/api/products/999999');

  expect(response.status()).toBe(404);
});