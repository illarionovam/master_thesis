import '../models/appUser.js';
import '../models/work.js';
import '../models/character.js';
import '../models/characterInWork.js';
import { initAssociations } from '../models/associations.js';

export async function initModels() {
    await initAssociations();
}
