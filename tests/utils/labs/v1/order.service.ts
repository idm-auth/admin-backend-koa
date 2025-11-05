// Service v1 - implementação real (cenário inverso)
export interface Order {
  id: string;
  product: string;
  quantity: number;
}

export interface CreateOrderData {
  product: string;
  quantity: number;
}

export const create = async (tenantId: string, data: CreateOrderData): Promise<Order> => {
  // Simula operação real
  console.log('V1 SERVICE: Creating order', { tenantId, data });
  
  return {
    id: `order-${Date.now()}`,
    product: data.product,
    quantity: data.quantity,
  };
};

export const findById = async (tenantId: string, id: string): Promise<Order> => {
  console.log('V1 SERVICE: Finding order by ID', { tenantId, id });
  
  if (id === 'not-found') {
    throw new Error('Order not found');
  }
  
  return {
    id,
    product: 'V1 Product',
    quantity: 5,
  };
};