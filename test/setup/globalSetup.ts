import { bootstrap } from '@/infrastructure/core/bootstrap';
import { TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';

export default async function globalSetup() {
  const { framework, container, app } = await bootstrap();

  const response = await request(app.callback())
    .post('/api/core/system-setup/init-setup')
    .send({
      adminAccount: {
        email: 'admin@test.com',
        password: TEST_PASSWORD,
      },
    });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      `Global setup failed: ${response.status} - ${JSON.stringify(response.body)}`
    );
  }

  return async () => {
    await framework.shutdown();
  };
}
