import { withAuth } from './helpers/auth.js';
import {
    createCharacter,
    createLocation,
    createWork,
    linkLocationToWork,
    linkCharacterToWork,
    linkCharacterToCharacter,
    createEvent,
} from './helpers/factories.js';

const base = '/api/works';

describe('Works API', () => {
    test('get works', async () => {
        const { http, user } = await withAuth();

        const res1 = await http.get(base);
        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);

        const work = await createWork(user.id);

        const res2 = await http.get(base);
        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body[0]).toHaveProperty('id', work.id);
    });

    test('create work', async () => {
        const { http } = await withAuth();

        const workToCreate = {
            title: 'My Work',
        };

        const res = await http.post(base).send(workToCreate);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', workToCreate.title);
    });

    test('get work', async () => {
        const { http, user } = await withAuth();

        const work = await createWork(user.id);

        const res = await http.get(`${base}/${work.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', work.id);
    });

    test('update work', async () => {
        const { http, user } = await withAuth();

        const work = await createWork(user.id);
        const newAnnotation = 'test';

        const res = await http.patch(`${base}/${work.id}`).send({ annotation: newAnnotation });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', work.id);
        expect(res.body).toHaveProperty('annotation', newAnnotation);
    });

    test('get work cast + available cast', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);
        const work = await createWork(user.id);

        const res1 = await http.get(`${base}/${work.id}/cast`);

        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length === 0);

        const res2 = await http.get(`${base}/${work.id}/cast/available`);

        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body.length === 1);
        expect(res2.body[0].id === character.id);

        const characterInWork = await linkCharacterToWork(character.id, work.id);

        const res3 = await http.get(`${base}/${work.id}/cast`);

        expect(res3.status).toBe(200);
        expect(Array.isArray(res3.body)).toBe(true);
        expect(res3.body.length === 1);
        expect(res3.body[0].id === characterInWork.id);

        const res4 = await http.get(`${base}/${work.id}/cast/available`);

        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length === 0);
    });

    test('create / get / update / delete character in work', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);
        const work = await createWork(user.id);

        const characterInWorkToCreate = {
            work_id: work.id,
            character_id: character.id,
        };

        const resCreate = await http.post(`${base}/${work.id}/cast`).send(characterInWorkToCreate);

        expect(resCreate.status).toBe(201);
        expect(resCreate.body).toHaveProperty('id');

        const characterInWorkId = resCreate.body.id;

        const resGet = await http.get(`${base}/${work.id}/cast/${characterInWorkId}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toHaveProperty('id', characterInWorkId);

        const newAttributes = { lost: ['arm', 'core'] };

        const resUpdate = await http
            .patch(`${base}/${work.id}/cast/${characterInWorkId}`)
            .send({ attributes: newAttributes });

        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body).toHaveProperty('id', characterInWorkId);
        expect(resUpdate.body).toHaveProperty('attributes', newAttributes);

        const resDelete = await http.delete(`${base}/${work.id}/cast/${characterInWorkId}`);

        expect(resDelete.status).toBe(204);

        const resGet2 = await http.get(`${base}/${work.id}/cast/${characterInWorkId}`);

        expect(resGet2.status).toBe(403);
    });

    test('get character in work relationships + available relationships', async () => {
        const { http, user } = await withAuth();

        const characterA = await createCharacter(user.id);
        const characterB = await createCharacter(user.id, {
            name: 'Feiser',
            appearance: 'Lean, strong',
            personality: 'Sarcastic tactician',
            bio: 'Lone ektrikhos',
        });
        const work = await createWork(user.id);
        const characterInWorkA = await linkCharacterToWork(characterA.id, work.id);
        const characterInWorkB = await linkCharacterToWork(characterB.id, work.id);

        const res1 = await http.get(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships`);

        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length === 0);

        const res2 = await http.get(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships/available`);

        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body.length === 1);
        expect(res2.body[0].id === characterInWorkB.id);

        const relationship = await linkCharacterToCharacter(characterInWorkA.id, characterInWorkB.id, {
            type: 'friend, partner',
        });

        const res3 = await http.get(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships`);

        expect(res3.status).toBe(200);
        expect(Array.isArray(res3.body)).toBe(true);
        expect(res3.body.length === 1);
        expect(res3.body[0].id === relationship.id);

        const res4 = await http.get(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships/available`);

        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length === 0);
    });

    test('create / get / update / delete relationship', async () => {
        const { http, user } = await withAuth();

        const characterA = await createCharacter(user.id);
        const characterB = await createCharacter(user.id, {
            name: 'Feiser',
            appearance: 'Lean, strong',
            personality: 'Sarcastic tactician',
            bio: 'Lone ektrikhos',
        });
        const work = await createWork(user.id);
        const characterInWorkA = await linkCharacterToWork(characterA.id, work.id);
        const characterInWorkB = await linkCharacterToWork(characterB.id, work.id);

        const resCreate = await http
            .post(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships`)
            .send({ to_character_in_work_id: characterInWorkB.id, type: 'friend, partner' });

        expect(resCreate.status).toBe(201);
        expect(resCreate.body).toHaveProperty('id');

        const relationshipId = resCreate.body.id;

        const resGet = await http.get(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships/${relationshipId}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toHaveProperty('id', relationshipId);

        const newNotes = 'Saved Feiser from the jail.';

        const resUpdate = await http
            .patch(`${base}/${work.id}/cast/${characterInWorkA.id}/relationships/${relationshipId}`)
            .send({ notes: newNotes });

        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body).toHaveProperty('id', relationshipId);
        expect(resUpdate.body).toHaveProperty('notes', newNotes);

        const resDelete = await http.delete(
            `${base}/${work.id}/cast/${characterInWorkA.id}/relationships/${relationshipId}`
        );

        expect(resDelete.status).toBe(204);

        const resGet2 = await http.get(
            `${base}/${work.id}/cast/${characterInWorkA.id}/relationships/${relationshipId}`
        );

        expect(resGet2.status).toBe(403);
    });

    test('get work location links + available location links', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);
        const work = await createWork(user.id);

        const res1 = await http.get(`${base}/${work.id}/location-links`);

        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length === 0);

        const res2 = await http.get(`${base}/${work.id}/location-links/available`);

        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body.length === 1);
        expect(res2.body[0].id === location.id);

        const locationInWork = await linkLocationToWork(location.id, work.id);

        const res3 = await http.get(`${base}/${work.id}/location-links`);

        expect(res3.status).toBe(200);
        expect(Array.isArray(res3.body)).toBe(true);
        expect(res3.body.length === 1);
        expect(res3.body[0].id === locationInWork.id);

        const res4 = await http.get(`${base}/${work.id}/location-links/available`);

        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length === 0);
    });

    test('delete work', async () => {
        const { http, user } = await withAuth();

        const work = await createWork(user.id);

        const del = await http.delete(`${base}/${work.id}`);
        expect(del.status).toBe(204);

        const getAfter = await http.get(`${base}/${work.id}`);
        expect(getAfter.status).toBe(403);
    });

    test('get events', async () => {
        const { http, user } = await withAuth();

        const work = await createWork(user.id);

        const res1 = await http.get(`${base}/${work.id}/events`);
        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length).toBe(0);

        const event = await createEvent(work.id);

        const res2 = await http.get(`${base}/${work.id}/events`);
        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body[0]).toHaveProperty('id', event.id);
    });

    test('create / get / update / delete event', async () => {
        const { http, user } = await withAuth();

        const work = await createWork(user.id);

        const resCreate = await http
            .post(`${base}/${work.id}/events`)
            .send({ title: 'Scouting at dawn', description: 'Scouting at dawn' });

        expect(resCreate.status).toBe(201);
        expect(resCreate.body).toHaveProperty('id');

        const eventId = resCreate.body.id;

        const resGet = await http.get(`${base}/${work.id}/events/${eventId}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toHaveProperty('id', eventId);

        const location = await createLocation(user.id);
        const locationInWork = await linkLocationToWork(location.id, work.id);

        const resUpdate = await http
            .patch(`${base}/${work.id}/events/${eventId}`)
            .send({ location_in_work_id: locationInWork.id });

        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body).toHaveProperty('id', eventId);
        expect(resUpdate.body).toHaveProperty('location_in_work_id', locationInWork.id);

        const resUpdate2 = await http.patch(`${base}/${work.id}/events/${eventId}`).send({ order_in_work: 2 });

        expect(resUpdate2.status).toBe(200);
        expect(resUpdate2.body).toHaveProperty('id', eventId);
        expect(resUpdate2.body).toHaveProperty('order_in_work', 2);

        const resGet2 = await http.get(`${base}/${work.id}/location-links/${locationInWork.id}/events`);

        expect(resGet2.status).toBe(200);
        expect(Array.isArray(resGet2.body)).toBe(true);
        expect(resGet2.body[0]).toHaveProperty('id', eventId);

        const resDelete = await http.delete(`${base}/${work.id}/events/${eventId}`);

        expect(resDelete.status).toBe(204);

        const resGet3 = await http.get(`${base}/${work.id}/events/${eventId}`);

        expect(resGet3.status).toBe(403);
    });

    test('create / get / delete event participants', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);
        const work = await createWork(user.id);
        const characterInWork = await linkCharacterToWork(character.id, work.id);
        const event = await createEvent(work.id);

        const res1 = await http.get(`${base}/${work.id}/events/${event.id}/participants`);
        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length).toBe(0);

        const res2 = await http.get(`${base}/${work.id}/events/${event.id}/participants/available`);
        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body[0]).toHaveProperty('id', characterInWork.id);

        const res3 = await http.post(`${base}/${work.id}/events/${event.id}/participants`).send({
            character_in_work_id: characterInWork.id,
        });
        expect(res3.status).toBe(201);
        expect(res3.body).toHaveProperty('id');

        const eventParticipantId = res3.body.id;

        const res4 = await http.get(`${base}/${work.id}/events/${event.id}/participants/available`);
        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length).toBe(0);

        const res5 = await http.get(`${base}/${work.id}/events/${event.id}/participants`);
        expect(res5.status).toBe(200);
        expect(Array.isArray(res5.body)).toBe(true);
        expect(res5.body[0]).toHaveProperty('id', eventParticipantId);

        const res6 = await http.delete(`${base}/${work.id}/events/${event.id}/participants/${eventParticipantId}`);
        expect(res6.status).toBe(204);

        const res7 = await http.get(`${base}/${work.id}/events/${event.id}/participants`);
        expect(res7.status).toBe(200);
        expect(Array.isArray(res7.body)).toBe(true);
        expect(res7.body.length).toBe(0);
    });
});
