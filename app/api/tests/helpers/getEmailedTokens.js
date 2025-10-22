import { Token } from '../../models/token';
import appUserService from '../../services/appUserService';

export async function getToken(email, scope) {
    const appUser = await appUserService.getAppUserByEmail(email);
    const token = await Token.findOne({
        where: { owner_id: appUser.id, scope },
    });
    return token.token;
}
