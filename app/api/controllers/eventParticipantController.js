import eventParticipantService from '../services/eventParticipantService.js';

const stripEventParticipantResponse = eventParticipant => {
    return eventParticipant;
};

const getEventParticipant = async (req, res) => {
    const { id } = req.params;

    const eventParticipant = await eventParticipantService.getEventParticipant(id, req.appUser.id);

    if (eventParticipant == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripEventParticipantResponse(eventParticipant));
};

export default {
    stripEventParticipantResponse,
    getEventParticipant,
};
