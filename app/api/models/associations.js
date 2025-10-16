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
}
