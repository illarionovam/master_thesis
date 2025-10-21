import { api } from './helpers/request.js';
import { createUser } from './helpers/factories.js';

describe('Auth', () => {
    test('sign-up returns 201 (enumeration-safe)', async () => {
        const res = await api()
            .post('/api/auth/sign-up')
            .send({
                username: `u_${Date.now()}`,
                email: `e_${Date.now()}@ex.com`,
                password: 'P@ssw0rd1',
                name: 'Mariia',
            });
        expect(res.status).toBe(201);
    });

    test('sign-in issues token with correct credentials', async () => {
        const { user, rawPassword } = await createUser({ verified: true });
        const res = await api().post('/api/auth/sign-in').send({
            email: user.email,
            password: rawPassword,
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('sign-in fails with 401 for wrong password', async () => {
        const { user } = await createUser({ verified: true });
        const res = await api().post('/api/auth/sign-in').send({
            email: user.email,
            password: 'wrong',
        });
        expect(res.status).toBe(401);
    });
});
