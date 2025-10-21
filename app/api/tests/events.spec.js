import { api } from './helpers/request.js';
import {
    createUser,
    createWork,
    createLocation,
    linkLocationToWork,
    createEvent,
    createCharacter,
    linkCharacterToWork,
} from './helpers/factories.js';
import { makeBearer } from './helpers/auth.js';

describe('Events', () => {
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
    });
});
