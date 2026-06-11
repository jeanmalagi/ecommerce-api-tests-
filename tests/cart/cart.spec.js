import {
  test,
  expect,
} from "@playwright/test";

let userToken = "";
let adminToken = "";
let productId = "";
let cartItemId = "";

//
// ✅ Setup
//

test.beforeAll(
  async ({ request }) => {

    // ✅ login admin
    const adminResponse =
      await request.post(
        "/api/users/login",
        {
          data: {
            email:
              "admin@email.com",
            password:
              "123456",
          },
        }
      );

    adminToken =
      (await adminResponse.json())
        .token;

    // ✅ login usuário
    const userResponse =
      await request.post(
        "/api/users/login",
        {
          data: {
            email:
              "cliente@email.com",
            password:
              "123456",
          },
        }
      );

    userToken =
      (await userResponse.json())
        .token;

    // ✅ cria produto
    const productResponse =
      await request.post(
        "/api/products",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          multipart: {
            name: "Produto Cart Test",
            description:
              "Teste carrinho",
            price: "50",
            stock: "10",
            category: "Games",
          },
        }
      );

    const product =
      await productResponse.json();

    productId =
      product.id;
  }
);

//
// ✅ Adicionar ao carrinho
//

test(
  "deve adicionar produto ao carrinho",
  async ({ request }) => {
    const response =
      await request.post(
        "/api/cart",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          data: {
            product_id:
              productId,
            quantity: 1,
          },
        }
      );

    expect(
      response.status()
    ).toBe(201);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty("id");

    cartItemId =
      body.id;
  }
);

//
// ✅ Listar carrinho
//

test(
  "deve listar itens do carrinho",
  async ({ request }) => {
    const response =
      await request.get(
        "/api/cart",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty("cart");

    expect(
      Array.isArray(body.cart)
    ).toBe(true);

    body.cart.forEach((item) => {
      expect(item)
        .toHaveProperty("id");

      expect(item)
        .toHaveProperty(
          "product_id"
        );

      expect(item)
        .toHaveProperty(
          "quantity"
        );
    });
  }
);

//
// ✅ Atualizar quantidade
//

test(
  "deve atualizar quantidade do carrinho",
  async ({ request }) => {
    const response =
      await request.put(
        `/api/cart/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          data: {
            quantity: 3,
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    expect(
      body.quantity
    ).toBe(3);
  }
);

//
// ✅ Remover item
//

test(
  "deve remover item do carrinho",
  async ({ request }) => {
    const response =
      await request.delete(
        `/api/cart/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);
  }
);

//
// ✅ Não deve permitir acesso sem token
//

test(
  "não deve acessar carrinho sem token",
  async ({ request }) => {
    const response =
      await request.get("/api/cart");

    expect(
      response.status()
    ).toBe(401);
  }
);

//
// ✅ Não deve adicionar produto inexistente
//

test(
  "não deve adicionar produto inválido",
  async ({ request }) => {
    const response =
      await request.post(
        "/api/cart",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          data: {
            product_id: 999999,
            quantity: 1,
          },
        }
      );

    expect(
      response.status()
    ).toBeGreaterThanOrEqual(
      400
    );
  }
);