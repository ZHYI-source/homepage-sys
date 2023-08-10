const request = require('supertest');
const app = require('../app');

describe('POST /v1/users/list', () => {
    test('查询用户列表', async () => {
        const response = await request(app)
            .post('/v1/users/list')
            .set('Accept', 'application/json')
            .set('Authorization', process.env.Authorization)
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});

describe('POST /v1/users/create', () => {
    it('新增用户-已被注册', async () => {
        const res = await request(app)
            .post('/v1/users/create')
            .set('Authorization', process.env.Authorization)
            .send({
                "username": "测试的账户",
                "password": "123456",
                "email": "1840354090@qq.com",
            });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe(0);
    });

    it('新增用户', async () => {
        const res = await request(app)
            .post('/v1/users/create')
            .set('Authorization', process.env.Authorization)
            .send({
                "username": "芒果发",
                "password": "123456",
                "email": `${new Date().getTime()}@qq.com`,
            });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(1);
    });
});

describe('POST /v1/users/delete', () => {
    it('删除用户-该用户不存在或已被删除', async () => {
        const response = await request(app)
            .post('/v1/users/delete')
            .set('Authorization', process.env.Authorization)
            .send({
                "id": "642e2b5188c04ae43bb942e8",
            });
        expect(response.status).toBe(404);
        expect(response.body.status).toBe(0)
    });
    it('删除用户', async () => {
        const response = await request(app)
            .post('/v1/users/delete')
            .set('Authorization', process.env.Authorization)
            .send({
                "id": "642e2b5188c04ae43bb942e8",
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(1)
    });
});

describe('POST /v1/users/update', () => {
    it('更新用户-该用户不存在或已被删除', async () => {
        const response = await request(app)
            .post('/v1/users/update')
            .set('Authorization', process.env.Authorization)
            .send({
                "username": "芒果发",
                "password": "123456",
                "email": '1840354092@qq.com',
                "id": "642bd7bc746382f7d646238c",
            });
        expect(response.status).toBe(404);
        expect(response.body.status).toBe(0)
    });
    it('更新用户', async () => {
        const response = await request(app)
            .post('/v1/users/update')
            .set('Authorization', process.env.Authorization)
            .send({
                "username": "修改",
                "password": "123456",
                "email": '1840354092@qq.com',
                "id": "642e43e21e0a0932bdcdcb4a",
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(1)
    });
});

