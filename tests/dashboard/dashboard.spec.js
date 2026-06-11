import {
  test,
  expect,
} from "@playwright/test";

let adminToken = "";
let userToken = "";
let productId = "";

//
// ✅ Setup inicial
//

test.beforeAll(
  async ({ request }) => {
    // ✅ Login admin
    const adminResponse =
      await request.post(
        "api/users/login",
        {
          data: {
            email:
              "admin@email.com",
            password:
              "123456",
          },
        }
      );

    const adminBody =
      await adminResponse.json();

    adminToken =
      adminBody.token;

    // ✅ Login usuário
    const userResponse =
      await request.post(
        "api/users/login",
        {
          data: {
            email:
              "user@email.com",
            password:
              "123456",
          },
        }
      );

    const userBody =
      await userResponse.json();

    userToken =
      userBody.token;

    // ✅ Criar produto
    const productResponse =
      await request.post(
        "api/products",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          multipart: {
            name:
              "Produto Dashboard Test",

            description:
              "Produto criado para testes",

            price: "100",

            stock: "10",

            category:
              "Games",
          },
        }
      );

    const product =
      await productResponse.json();

    productId =
      product.id;

    // ✅ Adicionar ao carrinho
    await request.post(
      "api/cart",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          product_id: productId,
          quantity: 1,
        },
      }
    );

    // ✅ Criar pedido
    await request.post(
      "api/orders",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
  }
);

//
// ✅ Deve retornar métricas do dashboard
//

test(
  "deve retornar métricas do dashboard",
  async ({ request }) => {
    const response =
      await request.get(
        "api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    // ✅ Estrutura correta baseada NA SUA API
    expect(body)
      .toHaveProperty("totalOrders");

    expect(body)
      .toHaveProperty("totalSales");

    expect(body)
      .toHaveProperty("totalUsers");

    expect(body)
      .toHaveProperty("recentOrders");

    expect(body)
      .toHaveProperty("criticalProducts");

    expect(body)
      .toHaveProperty("lowStock");
  }
);

//
// ✅ Não deve permitir acesso sem token
//

test(
  "não deve acessar dashboard sem token",
  async ({ request }) => {
    const response =
      await request.get("api/dashboard");

    expect(
      response.status()
    ).toBe(401);
  }
);

//
// ✅ Usuário comum não deve acessar
//

test(
  "usuário comum não deve acessar dashboard",
  async ({ request }) => {
    const response =
      await request.get(
        "api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

    expect(
      response.status()
    ).toBe(401);
  }
);

//
// ✅ Deve retornar pedidos recentes
//

test(
  "dashboard deve retornar pedidos recentes",
  async ({ request }) => {
    const response =
      await request.get(
        "api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

    const body =
      await response.json();

    expect(
      Array.isArray(body.recentOrders)
    ).toBe(true);
  }
);

//
// ✅ Deve retornar valores válidos
//

test(
  "dashboard deve retornar valores válidos",
  async ({ request }) => {
    const response =
      await request.get(
        "api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

    const body =
      await response.json();

    expect(
      Number(body.totalOrders)
    ).toBeGreaterThanOrEqual(1);

    expect(
      Number(body.totalSales)
    ).toBeGreaterThanOrEqual(0);

    expect(
      Number(body.totalUsers)
    ).toBeGreaterThanOrEqual(1);
  }
);