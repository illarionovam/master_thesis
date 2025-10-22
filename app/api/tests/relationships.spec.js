import { api } from './helpers/request.js';
import { createUser, createWork, createCharacter, linkCharacterToWork } from './helpers/factories.js';
import { makeBearer } from './helpers/auth.js';

describe('Relationships', () => {
    /*
    test('create relationship between two CIW in same work', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);
        const work = await createWork(user.id);

        const chA = await createCharacter(user.id, { name: 'Tyrel' });
        const chB = await createCharacter(user.id, { name: 'Fayzer' });
        const ciwA = await linkCharacterToWork(chA.id, work.id);
        const ciwB = await linkCharacterToWork(chB.id, work.id);

        const res = await api()
            .post(`api/works/${work.id}/cast/${ciwA.id}/relationships`)
            .set('Authorization', auth)
            .send({
                to_character_in_work_id: ciwB.id,
                type: 'ally',
                notes: 'since chapter 6',
            });
        expect(res.status).toBe(201);
    });

    test('reject relationship if characters belong to different works', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);
        const w1 = await createWork(user.id);
        const w2 = await createWork(user.id);

        const chA = await createCharacter(user.id, { name: 'A' });
        const chB = await createCharacter(user.id, { name: 'B' });
        const ciwA = await linkCharacterToWork(chA.id, w1.id);
        const ciwB = await linkCharacterToWork(chB.id, w2.id);

        const res = await api()
            .post(`/api/works/${w1.id}/cast/${ciwA.id}/relationships`)
            .set('Authorization', auth)
            .send({ to_character_in_work_id: ciwB.id, type: 'ally' });
        expect([403]).toContain(res.status);
    });*/
});
