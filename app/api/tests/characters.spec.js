import { api } from './helpers/request.js';
import { getToken } from './helpers/auth.js';
import { createCharacter } from './helpers/factories.js';

const base = '/api/characters';

const authApi = token => ({
    get: url => api().get(url).set('Authorization', `Bearer ${token}`),
    post: url => api().post(url).set('Authorization', `Bearer ${token}`),
    patch: url => api().patch(url).set('Authorization', `Bearer ${token}`),
    delete: url => api().delete(url).set('Authorization', `Bearer ${token}`),
});

const withAuth = async () => {
    const { user, token } = await getToken();
    const http = authApi(token);
    return { user, token, http };
};

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
        const { http, user } = await withAuth();

        const characterToCreate = {
            owner_id: user.id,
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

    test('get character appearances > empty', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);

        const res = await http.get(`${base}/${character.id}/appearances`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('get character available appearances > empty', async () => {
        const { http, user } = await withAuth();

        const character = await createCharacter(user.id);

        const res = await http.get(`${base}/${character.id}/appearances/available`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
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
