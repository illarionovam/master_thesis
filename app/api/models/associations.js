let initialized = false;

export async function initAssociations() {
    if (initialized) return;
    initialized = true;

    const { AppUser } = await import('./appUser.js');
    const { Work } = await import('./work.js');
    const { Character } = await import('./character.js');
    const { CharacterInWork } = await import('./characterInWork.js');
    const { Location } = await import('./location.js');
    const { LocationInWork } = await import('./locationInWork.js');
    const { Relationship } = await import('./relationship.js');
    const { Event } = await import('./event.js');
    const { EventParticipant } = await import('./eventParticipant.js');

    if (!AppUser.associations?.works) {
        AppUser.hasMany(Work, { foreignKey: 'owner_id', sourceKey: 'id', as: 'works' });
    }
    if (!AppUser.associations?.locations) {
        AppUser.hasMany(Location, { foreignKey: 'owner_id', sourceKey: 'id', as: 'locations' });
    }
    if (!AppUser.associations?.characters) {
        AppUser.hasMany(Character, { foreignKey: 'owner_id', sourceKey: 'id', as: 'characters' });
    }

    if (!Work.associations?.owner) {
        Work.belongsTo(AppUser, { foreignKey: 'owner_id', targetKey: 'id', as: 'owner' });
    }
    if (!Location.associations?.owner) {
        Location.belongsTo(AppUser, { foreignKey: 'owner_id', targetKey: 'id', as: 'owner' });
    }
    if (!Character.associations?.owner) {
        Character.belongsTo(AppUser, { foreignKey: 'owner_id', targetKey: 'id', as: 'owner' });
    }

    if (!Character.associations?.works) {
        Character.belongsToMany(Work, {
            through: CharacterInWork,
            foreignKey: 'character_id',
            otherKey: 'work_id',
            as: 'works',
        });
    }

    if (!Work.associations?.characters) {
        Work.belongsToMany(Character, {
            through: CharacterInWork,
            foreignKey: 'work_id',
            otherKey: 'character_id',
            as: 'characters',
        });
    }

    if (!Location.associations?.works) {
        Location.belongsToMany(Work, {
            through: LocationInWork,
            foreignKey: 'location_id',
            otherKey: 'work_id',
            as: 'works',
        });
    }

    if (!Work.associations?.locations) {
        Work.belongsToMany(Location, {
            through: LocationInWork,
            foreignKey: 'work_id',
            otherKey: 'location_id',
            as: 'locations',
        });
    }

    if (!Location.associations?.children) {
        Location.hasMany(Location, { as: 'children', foreignKey: 'parent_location_id', sourceKey: 'id' });
    }
    if (!Location.associations?.parent) {
        Location.belongsTo(Location, { as: 'parent', foreignKey: 'parent_location_id', targetKey: 'id' });
    }

    if (!CharacterInWork.associations?.character) {
        CharacterInWork.belongsTo(Character, { foreignKey: 'character_id', targetKey: 'id', as: 'character' });
    }
    if (!CharacterInWork.associations?.work) {
        CharacterInWork.belongsTo(Work, { foreignKey: 'work_id', targetKey: 'id', as: 'work' });
    }

    if (!LocationInWork.associations?.location) {
        LocationInWork.belongsTo(Location, { foreignKey: 'location_id', targetKey: 'id', as: 'location' });
    }
    if (!LocationInWork.associations?.work) {
        LocationInWork.belongsTo(Work, { foreignKey: 'work_id', targetKey: 'id', as: 'work' });
    }

    if (!Character.associations?.appearances) {
        Character.hasMany(CharacterInWork, { foreignKey: 'character_id', sourceKey: 'id', as: 'appearances' });
    }
    if (!Work.associations?.cast) {
        Work.hasMany(CharacterInWork, { foreignKey: 'work_id', sourceKey: 'id', as: 'cast' });
    }

    if (!Location.associations?.placements) {
        Location.hasMany(LocationInWork, {
            foreignKey: 'location_id',
            sourceKey: 'id',
            as: 'placements',
        });
    }
    if (!Work.associations?.locationLinks) {
        Work.hasMany(LocationInWork, {
            foreignKey: 'work_id',
            sourceKey: 'id',
            as: 'locationLinks',
        });
    }

    if (!Relationship.associations?.from) {
        Relationship.belongsTo(CharacterInWork, {
            as: 'from',
            foreignKey: 'from_character_in_work_id',
            targetKey: 'id',
        });
    }
    if (!Relationship.associations?.to) {
        Relationship.belongsTo(CharacterInWork, {
            as: 'to',
            foreignKey: 'to_character_in_work_id',
            targetKey: 'id',
        });
    }

    if (!CharacterInWork.associations?.outgoingRelationships) {
        CharacterInWork.hasMany(Relationship, {
            as: 'outgoingRelationships',
            foreignKey: 'from_character_in_work_id',
            sourceKey: 'id',
        });
    }
    if (!CharacterInWork.associations?.incomingRelationships) {
        CharacterInWork.hasMany(Relationship, {
            as: 'incomingRelationships',
            foreignKey: 'to_character_in_work_id',
            sourceKey: 'id',
        });
    }

    CharacterInWork.belongsToMany(CharacterInWork, {
        through: Relationship,
        as: 'relatedTo', // from > to
        foreignKey: 'from_character_in_work_id',
        otherKey: 'to_character_in_work_id',
    });
    CharacterInWork.belongsToMany(CharacterInWork, {
        through: Relationship,
        as: 'relatedFrom', // to < from
        foreignKey: 'to_character_in_work_id',
        otherKey: 'from_character_in_work_id',
    });

    if (!Event.associations?.work) {
        Event.belongsTo(Work, { as: 'work', foreignKey: 'work_id', targetKey: 'id' });
    }
    if (!Work.associations?.events) {
        Work.hasMany(Event, { as: 'events', foreignKey: 'work_id', sourceKey: 'id' });
    }

    if (!Event.associations?.locationLink) {
        Event.belongsTo(LocationInWork, {
            as: 'locationLink',
            foreignKey: 'location_in_work_id',
            targetKey: 'id',
        });
    }
    if (!LocationInWork.associations?.events) {
        LocationInWork.hasMany(Event, {
            as: 'events',
            foreignKey: 'location_in_work_id',
            sourceKey: 'id',
        });
    }

    if (!Event.associations?.participants) {
        Event.belongsToMany(CharacterInWork, {
            through: EventParticipant,
            as: 'participants',
            foreignKey: 'event_id',
            otherKey: 'character_in_work_id',
        });
    }
    if (!CharacterInWork.associations?.events) {
        CharacterInWork.belongsToMany(Event, {
            through: EventParticipant,
            as: 'events',
            foreignKey: 'character_in_work_id',
            otherKey: 'event_id',
        });
    }

    if (!Event.associations?.participantLinks) {
        Event.hasMany(EventParticipant, {
            as: 'participantLinks',
            foreignKey: 'event_id',
            sourceKey: 'id',
        });
    }
    if (!EventParticipant.associations?.event) {
        EventParticipant.belongsTo(Event, {
            as: 'event',
            foreignKey: 'event_id',
            targetKey: 'id',
        });
    }
    if (!EventParticipant.associations?.characterLink) {
        EventParticipant.belongsTo(CharacterInWork, {
            as: 'characterLink',
            foreignKey: 'character_in_work_id',
            targetKey: 'id',
        });
    }
    if (!CharacterInWork.associations?.participations) {
        CharacterInWork.hasMany(EventParticipant, {
            as: 'participations',
            foreignKey: 'character_in_work_id',
            sourceKey: 'id',
        });
    }
}
