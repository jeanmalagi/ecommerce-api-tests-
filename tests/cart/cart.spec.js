import { test, expect } from "@playwright/test";

let userToken = "";
let adminToken = "";
let productId = "";

//
// ✅ Setup global
//
test.beforeAll(async ({ request }) => {

  // ✅ login admin
  const adminResponse = await request.post("/api/users/login", {
    data: {
      email: "admin@email.com",
      password: "123456",
    },
  });

  const adminBody = await adminResponse.json();
  adminToken = adminBody.token;

  // ✅ login usuário
  const userResponse = await request.post("/api/users/login", {
    data: {
      email: "cliente@email.com",
      password: "123456",
    },
  });

  const userBody = await userResponse.json();
  userToken = userBody.token;

  // ✅ cria produto
  const productResponse = await request.post("/api/products", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    multipart: {
      name: "Produto Cart Test",
      description: "Teste carrinho",
      price: "50",
      stock: "10",
      category: "Games",
    },
  });

  const product = await productResponse.json();
  productId = product.id;
});

//
// ✅ Helper de headers
//
function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

//
// ✅ Adicionar ao carrinho
//
test("deve adicionar produto ao carrinho", async ({ request }) => {

  const response = await request.post("/api/cart", {
    headers: authHeaders(userToken),
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body).toHaveProperty("id");
});

//
// ✅ Listar carrinho
//
test("deve listar itens do carrinho", async ({ request }) => {

  // ✅ cria item antes de listar
  await request.post("/api/cart", {
    headers: authHeaders(userToken),
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  const response = await request.get("/api/cart", {
    headers: authHeaders(userToken),
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body).toHaveProperty("cart");
  expect(Array.isArray(body.cart)).toBe(true);
});

//
// ✅ Atualizar quantidade (CORRIGIDO)
//
test("deve atualizar quantidade do carrinho", async ({ request }) => {

  const headers = authHeaders(userToken);

  // ✅ cria item isolado
  const create = await request.post("/api/cart", {
    headers,
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  expect(create.status()).toBe(200);

  const cart = await create.json();

  // ✅ atualiza
  const response = await request.put(`/api/cart/${cart.id}`, {
    headers,
    data: {
      quantity: 3,
    },
  });

  expect(response.status()).toBe(200);
});

//
// ✅ Remover item (CORRIGIDO)
//
test("deve remover item do carrinho", async ({ request }) => {

  const headers = authHeaders(userToken);

  // ✅ cria item isolado
  const create = await request.post("/api/cart", {
    headers,
    data: {
      product_id: productId,
      quantity: 1,
    },
  });

  const cart = await create.json();

  // ✅ remove
  const response = await request.delete(`/api/cart/${cart.id}`, {
    headers,
  });

  expect(response.status()).toBe(200);
});

//
// ✅ Não deve permitir acesso sem token
//
test("não deve acessar carrinho sem token", async ({ request }) => {

  const response = await request.get("/api/cart");

  expect(response.status()).toBe(401);
});

//
// ✅ Produto inválido
//
test("não deve adicionar produto inválido", async ({ request }) => {

  const response = await request.post("/api/cart", {
    headers: authHeaders(userToken),
    data: {
      product_id: 999999,
      quantity: 1,
    },
  });

  expect(response.status()).toBeGreaterThanOrEqual(400);
});