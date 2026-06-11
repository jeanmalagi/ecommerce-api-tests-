import {
  test,
  expect,
} from "@playwright/test";

let userToken = "";

let adminToken = "";

let createdOrderId = "";

let productId = "";

//
// ✅ Login usuário + admin
//

test.beforeAll(
  async ({ request }) => {
    // ✅ Login cliente
    const userResponse =
      await request.post(
        "api/users/login",
        {
          data: {
            email:
              "cliente@email.com",
            password:
              "123456",
          },
        }
      );

    const userBody =
      await userResponse.json();

    userToken =
      userBody.token;

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
    
    
 // ✅ Criar produto de teste
  const productResponse = await request.post("api/products", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    multipart: {
      name: "Produto Teste Orders",
      description: "Teste",
      price: "100",
      stock: "10",
      category: "Games",
    },
  });

  const product = await productResponse.json();

  productId = product.id;
  
  });

//
// ✅ Criar pedido
//

test(
  "deve criar pedido",
  async ({ request }) => {
    // ✅ Adiciona item carrinho
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

    // ✅ Checkout
    const response =
      await request.post(
        "api/orders",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

    expect(
      response.status()
    ).toBe(201);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty(
        "order"
      );

    createdOrderId =
      body.order.id;
  }
);

//
// ✅ Listar pedidos usuário
//

test(
  "deve listar pedidos do usuário",
  async ({ request }) => {
    const response =
      await request.get(
        "api/orders",
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

    expect(
      Array.isArray(body)
    ).toBeTruthy();
  }
);

//
// ✅ Não deve listar sem token
//

test(
  "não deve acessar pedidos sem token",
  async ({ request }) => {
    const response =
      await request.get(
        "api/orders"
      );

    expect(
      response.status()
    ).toBe(401);
  }
);

//
// ✅ Admin listar pedidos
//

test(
  "admin deve listar todos pedidos",
  async ({ request }) => {
    const response =
      await request.get(
        "api/orders",
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

    expect(
      Array.isArray(body)
    ).toBeTruthy();
  }
);

//
// ✅ Atualizar status pedido
//

test(
  "admin deve atualizar status pedido",
  async ({ request }) => {

    // ✅ Criar pedido primeiro
    await request.post("api/cart", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    const createResponse =
      await request.post("api/orders", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

    const createdOrder =
      await createResponse.json();

    const orderId =
      createdOrder.order.id;

    // ✅ Agora atualiza o pedido
    const response =
      await request.put(
        `api/orders/admin/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },

          data: {
            status: "Enviado",
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    expect(
      body.status
    ).toBe("Enviado");
  }
);

//
// ✅ Validar estoque após pedido
//

test(
  "estoque deve diminuir após compra",
  async ({ request }) => {
    const beforeResponse =
      await request.get(
        `api/products/${productId}`
      );

    const beforeProduct =
      await beforeResponse.json();

    const stockBefore =
      beforeProduct.stock;

    // ✅ Adiciona produto
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

    // ✅ Checkout
    await request.post(
      "api/orders",
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    // ✅ Busca estoque atualizado
    const afterResponse =
      await request.get(
        `api/products/${productId}`
      );

    const afterProduct =
      await afterResponse.json();

    expect(
      afterProduct.stock
    ).toBe(
      stockBefore - 1
    );
  }
);