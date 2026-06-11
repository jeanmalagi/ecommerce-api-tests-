import {
  test,
  expect,
} from "@playwright/test";

//
// ✅ Login com sucesso
//

test(
  "deve realizar login com sucesso",
  async ({ request }) => {
    const response =
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

    expect(
      response.status()
    ).toBe(200);

    const body =
      await response.json();

    // ✅ Valida token
    expect(body)
      .toHaveProperty(
        "token"
      );

    // ✅ Valida usuário
    expect(body)
      .toHaveProperty(
        "user"
      );

    // ✅ Valida email
    expect(
      body.user.email
    ).toBe(
      "admin@email.com"
    );
  }
);

//
// ✅ Senha inválida
//

test(
  "não deve permitir login com senha inválida",
  async ({ request }) => {
    const response =
      await request.post(
        "/api/users/login",
        {
          data: {
            email:
              "admin@email.com",
            password:
              "senha_errada",
          },
        }
      );

    expect(
      response.status()
    ).toBe(401);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty(
        "error"
      );
  }
);

//
// ✅ Email inválido
//

test(
  "não deve permitir login com email inexistente",
  async ({ request }) => {
    const response =
      await request.post(
        "/api/users/login",
        {
          data: {
            email:
              "naoexiste@email.com",
            password:
              "123456",
          },
        }
      );

    expect(
      response.status()
    ).toBe(401);

    const body =
      await response.json();

    expect(body)
      .toHaveProperty(
        "error"
      );
  }
);

//
// ✅ Campos vazios
//

test(
  "não deve permitir login sem email e senha",
  async ({ request }) => {
    const response =
      await request.post(
        "/api/users/login",
        {
          data: {},
        }
      );

    expect(
      response.status()
    ).toBeGreaterThanOrEqual(
      400
    );
  }
);

//
// ✅ Token deve ser string
//

test(
  "deve retornar token válido",
  async ({ request }) => {
    const response =
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

    const body =
      await response.json();

    expect(
      typeof body.token
    ).toBe("string");

    expect(
      body.token.length
    ).toBeGreaterThan(10);
  }
);