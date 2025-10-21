import jwt from 'jsonwebtoken';

export function makeBearer(user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return `Bearer ${token}`;
}
