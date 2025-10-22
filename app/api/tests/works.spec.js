import { api } from './helpers/request.js';
import { createUser, createWork } from './helpers/factories.js';
import { makeBearer } from './helpers/auth.js';

describe('Works', () => {
    /*
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
    */
    /*
    test('create event with location_in_work and add participant', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);
        const work = await createWork(user.id);
        const loc = await createLocation(user.id);
        const liw = await linkLocationToWork(loc.id, work.id);
        const event = await createEvent(work.id, { location_in_work_id: liw.id });

        const ch = await createCharacter(user.id);
        const ciw = await linkCharacterToWork(ch.id, work.id);

        const res = await api()
            .post(`/api/works/${work.id}/events/${event.id}/participants`)
            .set('Authorization', auth)
            .send({ character_in_work_id: ciw.id });
        expect(res.status).toBe(201);
    });

    test('reject participant if event.work_id != ciw.work_id', async () => {
        const { user } = await createUser();
        const auth = makeBearer(user);
        const w1 = await createWork(user.id);
        const w2 = await createWork(user.id);

        const event = await createEvent(w1.id);
        const ch = await createCharacter(user.id);
        const ciw = await linkCharacterToWork(ch.id, w2.id);

        const res = await api()
            .post(`/api/works/${work.id}/events/${event.id}/participants`)
            .set('Authorization', auth)
            .send({ event_id: event.id, character_in_work_id: ciw.id });
        expect([403]).toContain(res.status);
    });*/
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
