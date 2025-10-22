import { api } from './helpers/request.js';
import { withAuth } from './helpers/auth.js';
import { createCharacter, createWork, linkCharacterToWork } from './helpers/factories.js';

const base = '/api/characters';

describe('Character API', () => {
    test('no token', async () => {
        const res = await api().get(base);
        expect(res.status).toBe(401);
    });

    test('get characters > empty', async () => {
        const { http } = await withAuth();
        const res = await http.get(base);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('create character > bad request', async () => {
        const { http } = await withAuth();
        const res = await http.post(base).send({});
        expect(res.status).toBe(400);
    });

    test('create character', async () => {
        const { http } = await withAuth();

        const characterToCreate = {
            name: 'Tyrel',
            appearance: 'Tall, steel gaze',
            personality: 'Calm strategist',
            bio: 'Commander of the North Division',
        };

        const res = await http.post(base).send(characterToCreate);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', characterToCreate.name);
    });

    test('get characters > 1 character', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);

        const res = await http.get(base);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('id', character.id);
    });

    test('get character', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);

        const res = await http.get(`${base}/${character.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', character.id);
    });

    test('update character', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);
        const newName = `Updated_${Date.now()}`;

        const res = await http.patch(`${base}/${character.id}`).send({ name: newName });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', character.id);
        expect(res.body).toHaveProperty('name', newName);
    });

    test('get character appearances + available appearances', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);
        const work = await createWork(user.id);

        const res1 = await http.get(`${base}/${character.id}/appearances`);

        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length === 0);

        const res2 = await http.get(`${base}/${character.id}/appearances/available`);

        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body.length === 1);
        expect(res2.body[0].id === work.id);

        const characterInWork = await linkCharacterToWork(character.id, work.id);

        const res3 = await http.get(`${base}/${character.id}/appearances`);

        expect(res3.status).toBe(200);
        expect(Array.isArray(res3.body)).toBe(true);
        expect(res3.body.length === 1);
        expect(res3.body[0].id === characterInWork.id);

        const res4 = await http.get(`${base}/${character.id}/appearances/available`);

        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length === 0);
    });

    test('delete character', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);

        const del = await http.delete(`${base}/${character.id}`);
        expect(del.status).toBe(204);

        const getAfter = await http.get(`${base}/${character.id}`);
        expect(getAfter.status).toBe(403);
    });
});
