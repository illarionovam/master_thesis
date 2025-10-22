import { Token } from '../../models/token';
import { createUser } from './factories';
import appUserService from '../../services/appUserService';
import { api } from './request';

export const getEmailedToken = async (email, scope) => {
    const appUser = await appUserService.getAppUserByEmail(email);
    const token = await Token.findOne({
        where: { owner_id: appUser.id, scope },
    });
    return token.token;
};

const getToken = async () => {
    const { user, rawPassword } = await createUser({ verified: true });
    const signInRes = await api().post('/api/auth/sign-in').send({
        email: user.email,
        password: rawPassword,
    });
    return { user, rawPassword, token: signInRes.body.token };
};

const authApi = token => ({
    get: url => api().get(url).set('Authorization', `Bearer ${token}`),
    post: url => api().post(url).set('Authorization', `Bearer ${token}`),
    patch: url => api().patch(url).set('Authorization', `Bearer ${token}`),
    delete: url => api().delete(url).set('Authorization', `Bearer ${token}`),
});

export const withAuth = async () => {
    const { user, token, rawPassword } = await getToken();
    const http = authApi(token);
    return { user, token, http, rawPassword };
};
