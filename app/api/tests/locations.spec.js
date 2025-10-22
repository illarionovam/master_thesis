import { api } from './helpers/request.js';
import { withAuth } from './helpers/auth.js';
import { createLocation, createWork, linkLocationToWork } from './helpers/factories.js';

const base = '/api/locations';

describe('Locations API', () => {
    test('no token', async () => {
        const res = await api().get(base);
        expect(res.status).toBe(401);
    });

    test('get locations > empty', async () => {
        const { http } = await withAuth();
        const res = await http.get(base);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('create location > bad request', async () => {
        const { http } = await withAuth();
        const res = await http.post(base).send({});
        expect(res.status).toBe(400);
    });

    test('create location', async () => {
        const { http } = await withAuth();

        const locationToCreate = {
            title: 'Camp',
            description: 'A forest camp',
        };

        const res = await http.post(base).send(locationToCreate);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', locationToCreate.title);
    });

    test('get locations > 1 location', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);

        const res = await http.get(base);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('id', location.id);
    });

    test('get location', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);

        const res = await http.get(`${base}/${location.id}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', location.id);
    });

    test('update location', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);
        const parentLocation = await createLocation(user.id, {
            title: 'Ektrikhos territory',
            description: 'Ektrikhos territory',
        });

        const res = await http.patch(`${base}/${location.id}`).send({ parent_location_id: parentLocation.id });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', location.id);
        expect(res.body).toHaveProperty('parent_location_id', parentLocation.id);
    });

    test('get location placements + available placements', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);
        const work = await createWork(user.id);

        const res1 = await http.get(`${base}/${location.id}/placements`);

        expect(res1.status).toBe(200);
        expect(Array.isArray(res1.body)).toBe(true);
        expect(res1.body.length === 0);

        const res2 = await http.get(`${base}/${location.id}/placements/available`);

        expect(res2.status).toBe(200);
        expect(Array.isArray(res2.body)).toBe(true);
        expect(res2.body.length === 1);
        expect(res2.body[0].id === work.id);

        const locationInWork = await linkLocationToWork(location.id, work.id);

        const res3 = await http.get(`${base}/${location.id}/placements`);

        expect(res3.status).toBe(200);
        expect(Array.isArray(res3.body)).toBe(true);
        expect(res3.body.length === 1);
        expect(res3.body[0].id === locationInWork.id);

        const res4 = await http.get(`${base}/${location.id}/placements/available`);

        expect(res4.status).toBe(200);
        expect(Array.isArray(res4.body)).toBe(true);
        expect(res4.body.length === 0);
    });

    test('delete location', async () => {
        const { http, user } = await withAuth();

        const location = await createLocation(user.id);

        const del = await http.delete(`${base}/${location.id}`);
        expect(del.status).toBe(204);

        const getAfter = await http.get(`${base}/${location.id}`);
        expect(getAfter.status).toBe(403);
    });
});
