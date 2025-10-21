import bcrypt from 'bcrypt';
import { AppUser } from '../../models/appUser.js';
import { Work } from '../../models/work.js';
import { Character } from '../../models/character.js';
import { CharacterInWork } from '../../models/characterInWork.js';
import { Location } from '../../models/location.js';
import { LocationInWork } from '../../models/locationInWork.js';
import { Event } from '../../models/event.js';

export async function createUser(attrs = {}) {
    const password = attrs.password ?? 'P@ssw0rd1';
    const hash_password = await bcrypt.hash(password, 10);
    const user = await AppUser.create({
        username: attrs.username ?? `user_${Date.now()}`,
        email: attrs.email ?? `u_${Date.now()}@ex.com`,
        hash_password,
        name: attrs.name ?? 'Test User',
        verified: attrs.verified ?? true,
    });
    return { user, rawPassword: password };
}

export async function createWork(owner_id, attrs = {}) {
    return Work.create({
        owner_id,
        title: attrs.title ?? 'My Work',
        annotation: attrs.annotation ?? null,
        synopsis: attrs.synopsis ?? null,
    });
}

export async function createCharacter(owner_id, attrs = {}) {
    return Character.create({
        owner_id,
        name: attrs.name ?? 'Tyrel',
        appearance: attrs.appearance ?? 'Tall, steel gaze',
        personality: attrs.personality ?? 'Calm strategist',
        bio: attrs.bio ?? 'Commander of ...',
        image_url: attrs.image_url ?? null,
        attributes: attrs.attributes ?? {},
    });
}

export async function linkCharacterToWork(character_id, work_id, attrs = {}) {
    return CharacterInWork.create({
        character_id,
        work_id,
        image_url: attrs.image_url ?? null,
        attributes: attrs.attributes ?? {},
    });
}

export async function createLocation(owner_id, attrs = {}) {
    return Location.create({
        owner_id,
        title: attrs.title ?? 'Camp',
        description: attrs.description ?? 'A forest camp',
        parent_location_id: attrs.parent_location_id ?? null,
    });
}

export async function linkLocationToWork(location_id, work_id, attrs = {}) {
    return LocationInWork.create({
        location_id,
        work_id,
        attributes: attrs.attributes ?? {},
    });
}

export async function createEvent(work_id, attrs = {}) {
    return Event.create({
        work_id,
        location_in_work_id: attrs.location_in_work_id ?? null,
        description: attrs.description ?? 'Scouting at dawn',
    });
}
