# Service Pattern Rules

## Padrão de Retorno
- **SEMPRE retorne o objeto diretamente ou lance erro específico**
- NUNCA retorne `null` ou `undefined` em services
- Use `throw new NotFoundError('message')` quando recurso não for encontrado
- Para operações de busca: retorne o objeto ou lance NotFoundError
- Para operações de modificação: retorne o objeto modificado ou lance NotFoundError

## Estrutura de Funções
- Validações primeiro (zod, negócio)
- Operação no banco
- Verificação de resultado: `if (!result) throw new NotFoundError('message')`
- Retorno do objeto

## Exemplos
```typescript
// ✅ Correto
export const findById = async (id: string): Promise<UserDocument> => {
  const user = await getModel().findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

// ❌ Incorreto
export const findById = async (id: string) => {
  const user = await getModel().findById(id);
  return user ? user.toObject() : null;
};
```