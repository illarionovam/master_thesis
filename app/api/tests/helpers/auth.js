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

export const getToken = async () => {
    const { user, rawPassword } = await createUser({ verified: true });
    const signInRes = await api().post('/api/auth/sign-in').send({
        email: user.email,
        password: rawPassword,
    });
    return { user, token: signInRes.body.token };
};
