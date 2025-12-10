// Simulação exata do account.service.ts
export const create = async (tenantId: string, data: { email: string }) => {
  // Simula comportamento real com dependências
  await new Promise((resolve) => setTimeout(resolve, 1));

  if (tenantId === 'invalid') {
    throw new Error('Invalid tenant');
  }

  return { _id: 'real-id', ...data };
};

export const findById = async (tenantId: string, id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1));
  return { _id: id, name: 'Real User' };
};
