import { bootstrap, getFramework } from '@/infrastructure/core/bootstrap';
import { createTestNodeSDK } from '@test/utils/test-sdk';
import { TEST_PASSWORD } from '@test/utils/test-constants';
import request from 'supertest';

export default async function globalSetup() {
  const sdk = createTestNodeSDK();
  const { container, app } = await bootstrap(sdk);
  const framework = getFramework();

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
