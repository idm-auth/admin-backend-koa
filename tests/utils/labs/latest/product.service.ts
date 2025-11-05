// Service latest - implementação real
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CreateProductData {
  name: string;
  price: number;
}

export const create = async (tenantId: string, data: CreateProductData): Promise<Product> => {
  // Simula operação real
  console.log('LATEST SERVICE: Creating product', { tenantId, data });
  
  return {
    id: `product-${Date.now()}`,
    name: data.name,
    price: data.price,
  };
};

export const findById = async (tenantId: string, id: string): Promise<Product> => {
  console.log('LATEST SERVICE: Finding product by ID', { tenantId, id });
  
  if (id === 'not-found') {
    throw new Error('Product not found');
  }
  
  return {
    id,
    name: 'Latest Product',
    price: 99.99,
  };
};