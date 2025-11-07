export const stripAppUserResponse = appUser => {
    return {
        id: appUser.id,
        username: appUser.username,
        email: appUser.email,
        name: appUser.name,
        created_at: appUser.created_at,
        updated_at: appUser.updated_at,
    };
};

export const stripBulkCharacterResponse = character => {
    return {
        id: character.id,
        name: character.name,
    };
};

export const stripBulkLocationResponse = location => {
    return {
        id: location.id,
        title: location.title,
    };
};

export const stripBulkWorkResponse = work => {
    return {
        id: work.id,
        title: work.title,
    };
};

export const stripBulkCharacterInWorkResponse = characterInWork => {
    return {
        id: characterInWork.id,
        character_id: characterInWork.character_id,
        work_id: characterInWork.work_id,
        work: stripBulkWorkResponse(characterInWork.work),
        character: stripBulkCharacterResponse(characterInWork.character),
    };
};

export const stripBulkLocationInWorkResponse = locationInWork => {
    return {
        id: locationInWork.id,
        location_id: locationInWork.location_id,
        work_id: locationInWork.work_id,
        work: stripBulkWorkResponse(locationInWork.work),
        location: stripBulkLocationResponse(locationInWork.location),
    };
};

export const stripBulkEventResponse = event => {
    return {
        id: event.id,
        work_id: event.work_id,
        location_in_work_id: event.location_in_work_id,
        title: event.title,
        order_in_work: event.order_in_work,
        work: stripBulkWorkResponse(event.work),
        location: event.locationLink ? stripBulkLocationResponse(event.locationLink.location) : null,
    };
};

export const stripBulkEventParticipantResponse = eventParticipant => {
    return {
        id: eventParticipant.id,
        event_id: eventParticipant.event_id,
        character_in_work_id: eventParticipant.character_in_work_id,
        character: stripBulkCharacterResponse(eventParticipant.characterLink.character),
        event: stripBulkEventResponse(eventParticipant.event),
    };
};

export const stripBulkRelationshipResponse = relationship => {
    return {
        id: relationship.id,
        work_id: relationship.from.work_id,
        from_character_in_work_id: relationship.from_character_in_work_id,
        to_character_in_work_id: relationship.to_character_in_work_id,
        type: relationship.type,
        from: stripBulkCharacterResponse(relationship.from.character),
        to: stripBulkCharacterResponse(relationship.to.character),
    };
};
