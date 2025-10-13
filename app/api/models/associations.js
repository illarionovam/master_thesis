let initialized = false;

export async function initAssociations() {
    if (initialized) return;
    initialized = true;

    const { AppUser } = await import('./appUser.js');
    const { Work } = await import('./work.js');

    if (!AppUser.associations?.works) {
        AppUser.hasMany(Work, { foreignKey: 'owner_id', sourceKey: 'id', as: 'works' });
    }
    if (!Work.associations?.owner) {
        Work.belongsTo(AppUser, { foreignKey: 'owner_id', targetKey: 'id', as: 'owner' });
    }
}
