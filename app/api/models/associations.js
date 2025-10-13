let initialized = false;

export async function initAssociations() {
    if (initialized) return;
    initialized = true;

    const { AppUser } = await import('./appUser.js');
    const { Work } = await import('./work.js');
    const { Character } = await import('./character.js');
    const { CharacterInWork } = await import('./characterInWork.js');

    if (!AppUser.associations?.works) {
        AppUser.hasMany(Work, { foreignKey: 'owner_id', sourceKey: 'id', as: 'works' });
    }
    if (!Work.associations?.owner) {
        Work.belongsTo(AppUser, { foreignKey: 'owner_id', targetKey: 'id', as: 'owner' });
    }

    if (!AppUser.associations?.characters) {
        AppUser.hasMany(Character, { foreignKey: 'owner_id', sourceKey: 'id', as: 'characters' });
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
    if (!CharacterInWork.associations?.character) {
        CharacterInWork.belongsTo(Character, { foreignKey: 'character_id', targetKey: 'id', as: 'character' });
    }
    if (!CharacterInWork.associations?.work) {
        CharacterInWork.belongsTo(Work, { foreignKey: 'work_id', targetKey: 'id', as: 'work' });
    }
    if (!Character.associations?.appearances) {
        Character.hasMany(CharacterInWork, { foreignKey: 'character_id', sourceKey: 'id', as: 'appearances' });
    }
    if (!Work.associations?.cast) {
        Work.hasMany(CharacterInWork, { foreignKey: 'work_id', sourceKey: 'id', as: 'cast' });
    }
}
