# 🧪 Testes de API - Ecommerce

Projeto de testes automatizados para a API do ecommerce utilizando **Playwright Test**. Este projeto valida todos os endpoints da aplicação incluindo autenticação, produtos, carrinho, pedidos e dashboard administrativo.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando os Testes](#executando-os-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes Disponíveis](#testes-disponíveis)
- [Exemplos de Uso](#exemplos-de-uso)

## 🎯 Visão Geral

Este projeto contém uma suite completa de testes de API para validar a funcionalidade do backend do ecommerce. Os testes cobrem:

- **Autenticação (Auth)**: Login e validação de credenciais
- **Produtos (Products)**: CRUD de produtos e gerenciamento de estoque
- **Carrinho (Cart)**: Operações de carrinho de compras
- **Pedidos (Orders)**: Criação e gerenciamento de pedidos
- **Dashboard**: Funcionalidades administrativas

### Stack de Testes

- **Framework**: Playwright Test
- **Linguagem**: JavaScript (ES Modules)
- **Node.js**: v16+

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **Backend API** rodando localmente na porta `3000`

## 🚀 Instalação

1. **Clone ou navegue para o diretório do projeto:**
   ```bash
   cd ecommerce-api-tests
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   
   Isso instalará o Playwright e todas as dependências necessárias.

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (se não existir):

```bash
# Base URL da API
BASE_URL=http://localhost:3000/api

# Credenciais padrão para testes
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=123456
```

### 2. Arquivo de Configuração (playwright.config.js)

O arquivo `playwright.config.js` já está configurado com:

- **testDir**: Diretório raiz dos testes (`./tests`)
- **baseURL**: URL da API (`http://localhost:3000/api`)
- **Suporte para múltiplos navegadores** (opcional)

## 🏃 Executando os Testes

### Modo Normal (Headless)
Executa todos os testes em modo headless (sem interface gráfica):

```bash
npm test
```

### Modo UI (Interface Gráfica)
Executa os testes com a interface visual do Playwright:

```bash
npm run test:ui
```

Esta opção abre uma janela interativa onde você pode ver os testes sendo executados em tempo real e inspecionar cada passo.

### Modo Headed (Com Navegador Visível)
Executa os testes com o navegador visível:

```bash
npm run test:headed
```

### Executar Testes Específicos

Para executar apenas um arquivo de testes:

```bash
npx playwright test tests/auth/login.spec.js
```

Para executar testes de um diretório específico:

```bash
npx playwright test tests/products/
```

## 📁 Estrutura do Projeto

```
ecommerce-api-tests/
├── tests/
│   ├── auth/
│   │   └── login.spec.js              # Testes de autenticação
│   ├── products/
│   │   └── products.spec.js           # Testes de produtos
│   ├── cart/
│   │   └── cart.spec.js               # Testes de carrinho
│   ├── orders/
│   │   └── orders.spec.js             # Testes de pedidos
│   └── dashboard/
│       └── dashboard.spec.js          # Testes do dashboard
├── .env                               # Variáveis de ambiente
├── package.json                       # Dependências do projeto
├── playwright.config.js               # Configuração do Playwright
└── README.md                          # Este arquivo
```

## 📊 Testes Disponíveis

### 🔐 Autenticação (tests/auth/)

| Teste | Descrição |
|-------|-----------|
| `deve realizar login com sucesso` | Valida login com credenciais válidas |
| `deve retornar erro com credenciais inválidas` | Testa login com senha incorreta |
| `deve validar token JWT` | Verifica se o token retornado é válido |

**Endpoint testado**: `POST /api/users/login`

### 🛍️ Produtos (tests/products/)

| Teste | Descrição |
|-------|-----------|
| `deve listar todos os produtos` | GET em `/products` |
| `deve criar um novo produto` | POST em `/products` (Admin) |
| `deve atualizar um produto` | PUT em `/products/{id}` (Admin) |
| `deve deletar um produto` | DELETE em `/products/{id}` (Admin) |
| `deve buscar por nome` | GET com query params |

**Endpoints testados**: 
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

### 🛒 Carrinho (tests/cart/)

| Teste | Descrição |
|-------|-----------|
| `deve adicionar item ao carrinho` | Adiciona produto ao carrinho do usuário |
| `deve listar itens do carrinho` | Recupera todos os itens do carrinho |
| `deve remover item do carrinho` | Remove um produto específico |
| `deve atualizar quantidade` | Altera quantidade de um item |

**Endpoints testados**:
- `POST /api/cart/add`
- `GET /api/cart`
- `DELETE /api/cart/{itemId}`
- `PUT /api/cart/{itemId}`

### 📦 Pedidos (tests/orders/)

| Teste | Descrição |
|-------|-----------|
| `deve criar um novo pedido` | Cria pedido a partir do carrinho |
| `deve listar pedidos do usuário` | Recupera histórico de pedidos |
| `deve buscar detalhes do pedido` | GET em `/orders/{id}` |
| `deve atualizar status do pedido` | PUT em `/orders/{id}` (Admin) |

**Endpoints testados**:
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `PUT /api/orders/{id}/status`

### 👨‍💼 Dashboard (tests/dashboard/)

| Teste | Descrição |
|-------|-----------|
| `deve acessar dashboard admin` | Valida acesso ao painel administrativo |
| `deve obter estatísticas` | Recupera dados de vendas e produtos |
| `deve gerenciar estoque` | Operações no sistema de estoque |
| `deve listar todos os pedidos` | View geral de pedidos para admin |

**Endpoints testados**:
- `GET /api/dashboard/stats`
- `GET /api/dashboard/orders`
- `GET /api/dashboard/stock`

## 💡 Exemplos de Uso

### Exemplo 1: Testar Login

```javascript
import { test, expect } from "@playwright/test";

test("deve realizar login com sucesso", async ({ request }) => {
  const response = await request.post("/api/users/login", {
    data: {
      email: "admin@email.com",
      password: "123456",
    },
  });

  expect(response.status()).toBe(200);
  
  const body = await response.json();
  expect(body.token).toBeDefined();
});
```

### Exemplo 2: Testar Criação de Produto (com autenticação)

```javascript
import { test, expect } from "@playwright/test";

let adminToken = "";

test.beforeAll(async ({ request }) => {
  // Faz login primeiro
  const response = await request.post("/api/users/login", {
    data: {
      email: "admin@email.com",
      password: "123456",
    },
  });
  
  const body = await response.json();
  adminToken = body.token;
});

test("deve criar um novo produto", async ({ request }) => {
  const response = await request.post("/api/products", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    data: {
      name: "Novo Produto",
      price: 99.99,
      stock: 10,
      description: "Descrição do produto",
    },
  });

  expect(response.status()).toBe(201);
  
  const body = await response.json();
  expect(body.id).toBeDefined();
  expect(body.name).toBe("Novo Produto");
});
```

### Exemplo 3: Executar Testes em Ordem

```bash
# Roda apenas testes de auth
npm test tests/auth/

# Roda testes com padrão específico
npx playwright test --grep "login"

# Roda com debug
npx playwright test --debug
```

## 🔍 Relatórios e Debugging

### Ver Relatório HTML

Após executar os testes, um relatório HTML é gerado:

```bash
npx playwright show-report
```

### Modo Debug

Execute os testes em modo debug para inspecionar cada passo:

```bash
npx playwright test --debug
```

### Aumentar Timeout

Se os testes estão com timeout, aumentar o timeout global:

```javascript
// No playwright.config.js
timeout: 30000 // 30 segundos
```

## ⚠️ Requisitos para Executar

1. **Backend rodando**: Certifique-se de que o servidor da API está rodando em `http://localhost:3000`
2. **Banco de dados**: O banco de dados deve estar configurado e acessível
3. **Usuário admin**: Um usuário admin com email `admin@email.com` e senha `123456` deve existir

## 📝 Dicas e Boas Práticas

### ✅ Fazer

- Usar `test.describe()` para agrupar testes relacionados
- Usar `test.beforeAll()` para setup geral (login, etc)
- Usar `test.beforeEach()` para setup por teste
- Validar status HTTP e corpo da resposta
- Usar nomes descritivos para os testes

### ❌ Não Fazer

- Não hardcodear valores sensíveis (senhas, tokens)
- Não deixar testes dependentes uns dos outros
- Não ignorar testes sem motivo (`test.skip()`)
- Não criar testes muito longos e complexos

## 🐛 Troubleshooting

### Erro: ECONNREFUSED localhost:3000

A API não está rodando. Inicie o backend:
```bash
cd ../ecommerce/backend
npm start
```

### Erro: 401 Unauthorized

O token está expirado ou inválido. Certifique-se de fazer login antes dos testes.

### Testes com timeout

Aumentar o timeout no `playwright.config.js`:
```javascript
timeout: 30000
```

## 📚 Recursos Úteis

- [Documentação Playwright Test](https://playwright.dev/docs/intro)
- [API Request Documentation](https://playwright.dev/docs/api/class-apirequestcontext)
- [Assertion API](https://playwright.dev/docs/test-assertions)

## 👤 Contribuidor

Desenvolvido como parte da suite de testes do projeto Ecommerce.

---

**Última atualização**: 2026-06-11
