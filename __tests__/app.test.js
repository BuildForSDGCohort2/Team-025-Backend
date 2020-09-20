/**
 * @jest-environment jsdom
 */

import app from '../src/index';
const supertest = require('supertest');
const request = supertest(app);
const getRoutes = require ('../src/routes/index'); 


describe('app module', () => {
  test('it exists', async () => {
    expect(app).toBeDefined();
  });

  test('it returns program name with SDGs', async () => {
    const result = await app();
    const sdgPos = (result || '').indexOf('SDG');
    expect(sdgPos).toBeGreaterThanOrEqual(0);
  });

  test('it exits', async () => {
    const res = await request(getRoutes);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('get');
  });
});
