import { api } from './helpers/request.js';
import { createUser, createWork, createCharacter, linkCharacterToWork } from './helpers/factories.js';
import { makeBearer } from './helpers/auth.js';

describe('Characters', () => {
    test('list characters not linked to a work', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);
        const work = await createWork(user.id);

        const c1 = await createCharacter(user.id, { name: 'Tyrel' });
        const c2 = await createCharacter(user.id, { name: 'Fayzer' });
        await linkCharacterToWork(c1.id, work.id);

        const res = await api().get(`/api/works/${work.id}/cast/available`).set('Authorization', auth);
        expect(res.status).toBe(200);
    });
});
