export function createProductData() {
  return {
    name: `Produto-${Date.now()}`,
    description: 'Produto gerado automaticamente',
    price: '50',
    stock: '10',
    category: 'Games',
    image_url: '/uploads/default-product.svg',
  };
}