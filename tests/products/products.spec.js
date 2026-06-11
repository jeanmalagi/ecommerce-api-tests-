import {
  test,
  expect,
} from "@playwright/test";

let adminToken = "";

//
// ✅ Login admin antes dos testes
//

test.beforeAll(
  async ({ request }) => {
    const response =
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

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    adminToken =
      body.token;
  }
);

//
// ✅ Listar produtos
//

test(
  "deve listar produtos",
  async ({ request }) => {
    const response =
      await request.get(
        "api/products"
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
// ✅ Buscar produto por ID
//

test(
  "deve buscar produto por id",
  async ({ request }) => {
    const response =
      await request.get(
        "api/products/12"
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty(
        "id"
      );

    expect(body)
      .toHaveProperty(
        "name"
      );
  }
);

//
// ✅ Produto inexistente
//

test(
  "deve retornar 404 para produto inexistente",
  async ({ request }) => {
    const response =
      await request.get(
        "api/products/999999"
      );

    expect(
      response.status()
    ).toBe(404);
  }
);

//
// ✅ Criar produto
//

test(
  "deve criar produto",
  async ({ request }) => {
    const response =
      await request.post(
        "api/products",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },

          multipart: {
            name:
              "Produto Teste API",

            description:
              "Produto criado via automação",

            price: "199.99",

            stock: "10",

            category:
              "Games",
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
        "id"
      );

    expect(
      body.name
    ).toBe(
      "Produto Teste API"
    );
  }
);

//
// ✅ Não deve criar sem token
//

test(
  "não deve criar produto sem token",
  async ({ request }) => {
    const response =
      await request.post(
        "api/products",
        {
          multipart: {
            name:
              "Produto sem auth",

            description:
              "Teste",

            price: "99.90",

            stock: "5",

            category:
              "Games",
          },
        }
      );

    expect(
      response.status()
    ).toBe(401);
  }
);

//
// ✅ Editar produto
//

test(
  "deve editar produto",
  async ({ request }) => {
    const response =
      await request.put(
        "api/products/12",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },

          multipart: {
            name:
              "Produto Editado",

            description:
              "Descrição editada",

            price:
              "299.99",

            stock: "20",

            category:
              "Informática",
          },
        }
      );

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    expect(
      body.name
    ).toBe(
      "Produto Editado"
    );
  }
);

//
// ✅ Deletar produto
//

test(
  "deve deletar produto",
  async ({ request }) => {
    // ✅ Cria produto temporário
    const createResponse =
      await request.post(
        "api/products",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },

          multipart: {
            name:
              "Produto Delete",

            description:
              "Produto temporário",

            price: "50",

            stock: "2",

            category:
              "Games",
          },
        }
      );

    expect(
      createResponse.status()
    ).toBe(201);

    const createdProduct =
      await createResponse.json();

    // ✅ Deleta produto
    const deleteResponse =
      await request.delete(
        `api/products/${createdProduct.id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

    expect(
      deleteResponse.status()
    ).toBe(200);
  }
);