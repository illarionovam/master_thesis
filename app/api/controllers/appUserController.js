import bcrypt from 'bcryptjs';
import appUserService from '../services/appUserService.js';

const createAppUser = async (req, res) => {
    const { username, email, password, name, avatar_url } = req.body;

    const hash_password = await bcrypt.hash(password, 10);

    const appUser = await appUserService.createAppUser({ username, email, hash_password, name, avatar_url });

    res.status(201).json(appUser);
};

export default {
    createAppUser,
};
