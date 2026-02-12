import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth and Books', () => {
  // let app: INestApplication<App>;

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

    let app: INestApplication;
    let token: string;  

    const testUser = {
      email: 'e2e_test@example.com',
      password: 'testpassword123',
      name: 'E2E Test User'
    }

    beforeAll(async () =>{
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    })

    it('POST /auth/register → creates user and returns token (201)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');

    token = response.body.access_token;
  });

  it('POST /auth/login → returns token for valid credentials (201)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    token = response.body.access_token; 
  });

  it('GET /books → 401 Unauthorized without token', async () => {
    await request(app.getHttpServer())
      .get('/books')
      .expect(401);
  });
  

  it('GET /books → 200 OK with valid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /books → 401 Unauthorized without token', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({
        title: 'E2E Test Book',
        author: 'E2E Author',
      })
      .expect(401);
  });

  it('POST /books → 201 Created with valid token', async () => {
    const response = await request(app.getHttpServer())
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'E2E Protected Book',
        author: 'E2E Author',
        isbn: '9876543210',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('E2E Protected Book');
  });
});
