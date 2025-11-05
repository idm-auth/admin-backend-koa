// Service de exemplo para testes de mock
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserData {
  name: string;
  email: string;
}

export const create = async (
  tenantId: string,
  data: CreateUserData
): Promise<User> => {
  // Simula operação assíncrona
  await new Promise((resolve) => setTimeout(resolve, 10));

  return {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
  };
};

export const findById = async (tenantId: string, id: string): Promise<User> => {
  // Simula busca no banco
  await new Promise((resolve) => setTimeout(resolve, 5));

  if (id === 'not-found') {
    throw new Error('User not found');
  }

  return {
    id,
    name: 'Example User',
    email: 'user@example.com',
  };
};

export const update = async (
  tenantId: string,
  id: string,
  data: Partial<CreateUserData>
): Promise<User> => {
  // Simula atualização
  await new Promise((resolve) => setTimeout(resolve, 8));

  return {
    id,
    name: data.name || 'Updated User',
    email: data.email || 'updated@example.com',
  };
};
