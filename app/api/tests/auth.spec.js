import { jest } from '@jest/globals';

const sendMail = jest.fn().mockResolvedValue({ messageId: 'stubbed' });

await jest.unstable_mockModule('../mailer/mailer.js', () => ({
    __esModule: true,
    mailer: { sendMail },
}));

const { api } = await import('./helpers/request.js');
const { withAuth } = await import('./helpers/auth.js');
const { createUser } = await import('./helpers/factories.js');
const { getEmailedToken } = await import('./helpers/auth.js');

const base = '/api/auth';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Auth API', () => {
    test('sign-up + confirm-email + sign-in', async () => {
        const userToCreate = {
            username: `u_${Date.now()}`,
            email: `e_${Date.now()}@ex.com`,
            password: 'P@ssw0rd1',
            name: 'Mariia',
        };

        const signUpRes = await api().post(`${base}/sign-up`).send(userToCreate);
        expect(signUpRes.status).toBe(201);
        expect(sendMail).toHaveBeenCalledTimes(1);

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
        expect(sendMail).toHaveBeenCalledTimes(1);

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
        const { http, user } = await withAuth();

        const newEmail = 'newemail@ex.com';

        const updateEmailRes = await http.post(`${base}/update-email`).send({ new_email: newEmail });
        expect(updateEmailRes.status).toBe(200);
        expect(sendMail).toHaveBeenCalledTimes(1);

        const emailVerifyToken = await getEmailedToken(user.email, 'email_verify');

        const confirmEmailRes = await api()
            .post(`${base}/confirm-email`)
            .set('Authorization', `Bearer ${emailVerifyToken}`)
            .send();
        expect(confirmEmailRes.status).toBe(200);
    });

    test('sign-in + update + user-info + sign-out', async () => {
        const { http, user, rawPassword } = await withAuth();

        const newPassword = 'P@ssw0rd2';
        const newUsername = 'test2';

        const updatePasswordRes = await http.post(`${base}/update`).send({
            password: rawPassword,
            new_password: newPassword,
        });
        expect(updatePasswordRes.status).toBe(200);

        const updateRes = await http.post(`${base}/update`).send({
            username: newUsername,
        });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body).toHaveProperty('username', newUsername);

        const userInfoRes = await http.get(`${base}/user-info`);
        expect(userInfoRes.status).toBe(200);
        expect(userInfoRes.body).toHaveProperty('username', newUsername);
        expect(userInfoRes.body).toHaveProperty('email', user.email);

        const signOutRes = await http.post(`${base}/sign-out`);
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
