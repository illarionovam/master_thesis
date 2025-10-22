import { api } from './helpers/request.js';
import { createUser } from './helpers/factories.js';
import { getEmailedToken } from './helpers/auth.js';

const base = '/api/auth';

describe('Auth', () => {
    test('sign-up + confirm-email + sign-in', async () => {
        const userToCreate = {
            username: `u_${Date.now()}`,
            email: `e_${Date.now()}@ex.com`,
            password: 'P@ssw0rd1',
            name: 'Mariia',
        };

        const signUpRes = await api().post(`${base}/sign-up`).send(userToCreate);
        expect(signUpRes.status).toBe(201);

        const emailVerifyToken = await getEmailedToken(userToCreate.email, 'email_verify');

        const confirmEmailRes = await api()
            .post(`${base}/confirm-email`)
            .set('Authorization', `Bearer ${emailVerifyToken}`)
            .send();
        expect(confirmEmailRes.status).toBe(200);

        const signInRes = await api().post(`${base}/sign-in`).send({
            email: userToCreate.email,
            password: userToCreate.password,
        });
        expect(signInRes.status).toBe(200);
        expect(signInRes.body).toHaveProperty('token');
    });

    test('forgot-password + confirm-password', async () => {
        const { user } = await createUser({ verified: true });
        const forgotPasswordRes = await api().post(`${base}/forgot-password`).send({ email: user.email });
        expect(forgotPasswordRes.status).toBe(200);

        const passwordResetToken = await getEmailedToken(user.email, 'password_reset');
        const newPassword = 'P@ssw0rd2';

        const confirmPasswordRes = await api()
            .post(`${base}/confirm-password`)
            .set('Authorization', `Bearer ${passwordResetToken}`)
            .send({ new_password: newPassword });
        expect(confirmPasswordRes.status).toBe(200);

        const signInRes = await api().post(`${base}/sign-in`).send({
            email: user.email,
            password: newPassword,
        });
        expect(signInRes.status).toBe(200);
        expect(signInRes.body).toHaveProperty('token');
    });

    test('sign-in + update-email + confirm-email', async () => {
        const { user, rawPassword } = await createUser({ verified: true });
        const signInRes = await api().post(`${base}/sign-in`).send({
            email: user.email,
            password: rawPassword,
        });
        expect(signInRes.status).toBe(200);
        expect(signInRes.body).toHaveProperty('token');

        const token = signInRes.body.token;
        const newEmail = 'newemail@ex.com';

        const updateEmailRes = await api()
            .post(`${base}/update-email`)
            .set('Authorization', `Bearer ${token}`)
            .send({ new_email: newEmail });
        expect(updateEmailRes.status).toBe(200);

        const emailVerifyToken = await getEmailedToken(user.email, 'email_verify');

        const confirmEmailRes = await api()
            .post(`${base}/confirm-email`)
            .set('Authorization', `Bearer ${emailVerifyToken}`)
            .send();
        expect(confirmEmailRes.status).toBe(200);
        expect(confirmEmailRes.body).toHaveProperty('email', newEmail);
    });

    test('sign-in + update + user-info + sign-out', async () => {
        const { user, rawPassword } = await createUser({ verified: true });
        const signInRes = await api().post(`${base}/sign-in`).send({
            email: user.email,
            password: rawPassword,
        });
        expect(signInRes.status).toBe(200);
        expect(signInRes.body).toHaveProperty('token');

        const token = signInRes.body.token;
        const newPassword = 'P@ssw0rd2';
        const newUsername = 'test2';

        const updatePasswordRes = await api().post(`${base}/update`).set('Authorization', `Bearer ${token}`).send({
            password: rawPassword,
            new_password: newPassword,
        });
        expect(updatePasswordRes.status).toBe(200);

        const updateRes = await api().post(`${base}/update`).set('Authorization', `Bearer ${token}`).send({
            username: newUsername,
        });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty('username', newUsername);

        const userInfoRes = await api().get(`${base}/user-info`).set('Authorization', `Bearer ${token}`);
        expect(userInfoRes.status).toBe(200);
        expect(userInfoRes.body).toHaveProperty('username', newUsername);
        expect(userInfoRes.body).toHaveProperty('email', user.email);

        const signOutRes = await api().post(`${base}/sign-out`).set('Authorization', `Bearer ${token}`);
        expect(signOutRes.status).toBe(204);
    });

    test('sign-in FAIL', async () => {
        const { user } = await createUser({ verified: true });
        const res = await api().post(`${base}/sign-in`).send({
            email: user.email,
            password: 'wrong',
        });
        expect(res.status).toBe(401);
    });
});
