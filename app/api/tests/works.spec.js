import { api } from './helpers/request.js';
import { createUser, createWork } from './helpers/factories.js';
import { makeBearer } from './helpers/auth.js';

describe('Works', () => {
    test('create/list/get/update/delete work (owner only)', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);

        const created = await api()
            .post('/api/works')
            .set('Authorization', auth)
            .send({ title: 'Alpha', annotation: '', synopsis: '' });
        expect(created.status).toBe(201);
        const workId = created.body.id || created.body?.work?.id;

        const list = await api().get('/api/works').set('Authorization', auth);
        expect(list.status).toBe(200);
        expect(Array.isArray(list.body)).toBe(true);

        const get = await api().get(`/api/works/${workId}`).set('Authorization', auth);
        expect(get.status).toBe(200);
        expect(get.body.title).toBe('Alpha');

        const upd = await api().patch(`/api/works/${workId}`).set('Authorization', auth).send({ title: 'Alpha 2' });
        expect(upd.status).toBe(200);

        const del = await api().delete(`/api/works/${workId}`).set('Authorization', auth);
        expect(del.status).toBe(204);
    });

    test('owner isolation: cannot access others work', async () => {
        const { user: a } = await createUser();
        const { user: b } = await createUser();
        const work = await createWork(a.id, { title: 'Secret' });

        const res = await api().get(`/api/works/${work.id}`).set('Authorization', makeBearer(b));
        expect([403]).toContain(res.status);
    });
});
