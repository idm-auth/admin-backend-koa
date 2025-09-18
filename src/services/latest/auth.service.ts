import { LoginRequest } from '@/schemas/auth/v1/login/request';
import { LoginResponse } from '@/schemas/auth/v1/login/response';
import { getLogger } from '@/utils/localStorage.util';

const login = async (args: LoginRequest): Promise<LoginResponse> => {
  const logger = getLogger();

  logger.debug({
    email: args.email,
  });

  // TODO: Implementar validação de usuário e senha
  // TODO: Implementar geração de token JWT

  return {
    token: 'mock-jwt-token',
    user: {
      id: '1',
      email: args.email,
    },
  };
};

export default { login };
