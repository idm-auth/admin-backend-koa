import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { RealmPaginatedResponse } from '@/domains/core/realms/latest/realm.schema';

describe('GET /api/core/v1/realms (paginated)', () => {
  const getApp = () => globalThis.testKoaApp;
  const createdRealmIds: string[] = [];

  beforeAll(async () => {
    // Create 30 test realms for pagination testing
    for (let i = 1; i <= 30; i++) {
      const realmData = {
        name: `test-realm-${i.toString().padStart(2, '0')}`,
        description: `Test realm ${i} for pagination`,
        dbName: `test_db_${i}`,
        jwtConfig: {
          secret: 'test-secret',
          expiresIn: '24h',
        },
      };

      const response = await request(getApp().callback())
        .post('/api/core/v1/realms')
        .send(realmData);

      if (response.status === 201) {
        createdRealmIds.push(response.body.id);
      }
    }
  });

  afterAll(async () => {
    // Clean up created realms
    for (const id of createdRealmIds) {
      await request(getApp().callback()).delete(`/api/core/v1/realms/${id}`);
    }
  });

  it('should return paginated realms with default parameters', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('pagination');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBe(25); // Default limit

    expect(body.pagination.total).toBeGreaterThanOrEqual(30);
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.rowsPerPage).toBe(25);
    expect(body.pagination.totalPages).toBeGreaterThanOrEqual(2);
  });

  it('should return correct page 2 with smaller limit', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?page=2&limit=10')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body.pagination.page).toBe(2);
    expect(body.pagination.rowsPerPage).toBe(10);
    expect(body.data.length).toBeLessThanOrEqual(10);
    expect(body.pagination.total).toBeGreaterThanOrEqual(30);
  });

  it('should return correct page 3 with limit 5', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?page=3&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body.pagination.page).toBe(3);
    expect(body.pagination.rowsPerPage).toBe(5);
    expect(body.data.length).toBeLessThanOrEqual(5);
  });

  it('should filter realms by name pattern', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?filter=test-realm')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((realm) => {
      expect(realm.name).toMatch(/test-realm/);
    });
  });

  it('should sort realms by name ascending', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=false&limit=10')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should sort realms by name descending', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=true&limit=10')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  it('should handle pagination with filter and sort', async () => {
    const response = await request(getApp().callback())
      .get(
        '/api/core/v1/realms?filter=test-realm&sortBy=name&descending=false&page=1&limit=5'
      )
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body.data.length).toBeLessThanOrEqual(5);
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.rowsPerPage).toBe(5);

    // Verify all results match filter
    body.data.forEach((realm) => {
      expect(realm.name).toMatch(/test-realm/);
    });

    // Verify sorting
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should return empty page when page exceeds total pages', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?page=999&limit=10')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    expect(body.data.length).toBe(0);
    expect(body.pagination.page).toBe(999);
  });

  it('should calculate total pages correctly', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?limit=7')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;

    const { total, rowsPerPage, totalPages } = body.pagination;
    const expectedTotalPages = Math.ceil(total / rowsPerPage);
    expect(totalPages).toBe(expectedTotalPages);
  });

  it('should return 400 for invalid page parameter', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?page=0')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for invalid limit parameter', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?limit=0')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for limit exceeding maximum', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?limit=101')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  // Tests for z.stringbool() descending parameter
  it('should handle descending=1 as true', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=1&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  it('should handle descending=0 as false', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=0&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should handle descending=yes as true', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=yes&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  it('should handle descending=no as false', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&descending=no&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should use default descending=false when parameter is omitted', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?sortBy=name&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    const names = body.data.map((realm) => realm.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should return 400 for invalid descending parameter', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?descending=invalid')
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should handle string numbers for page and limit parameters', async () => {
    const response = await request(getApp().callback())
      .get('/api/core/v1/realms?page=2&limit=5')
      .expect(200);

    const body: RealmPaginatedResponse = response.body;
    expect(body.pagination.page).toBe(2);
    expect(body.pagination.rowsPerPage).toBe(5);
  });
});
