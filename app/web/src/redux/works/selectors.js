import { createSelector } from '@reduxjs/toolkit';

export const selectGetWorksLoading = state => state.works.getWorks.loading;
export const selectGetWorksError = state => state.works.getWorks.error;

export const selectWorksRaw = state => state.works.works ?? [];
export const selectWorks = createSelector(selectWorksRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/works/${item.id}` }))
);

export const selectWork = state => state.works.work;
export const selectCharacterInWork = state => state.works.characterInWork;
export const selectLocationInWork = state => state.works.locationInWork;
export const selectRelationship = state => state.works.relationship;
export const selectEvent = state => state.works.event;

export const selectCreateWorkLoading = state => state.works.createWork.loading;
export const selectCreateWorkError = state => state.works.createWork.error;

export const selectGetWorkLoading = state => state.works.getWork.loading;
export const selectGetWorkError = state => state.works.getWork.error;

export const selectUpdateWorkLoading = state => state.works.updateWork.loading;
export const selectUpdateWorkError = state => state.works.updateWork.error;

export const selectGenerateWorkDescriptionLoading = state => state.works.generateWorkDescription.loading;
export const selectGenerateWorkDescriptionError = state => state.works.generateWorkDescription.error;
export const selectGenerateWorkDescriptionResult = state => state.works.generateWorkDescription.result;

export const selectGenerateEventCheckLoading = state => state.works.generateEventCheck.loading;
export const selectGenerateEventCheckError = state => state.works.generateEventCheck.error;
export const selectGenerateEventCheckResult = state => state.works.generateEventCheck.result;

export const selectDeleteWorkLoading = state => state.works.deleteWork.loading;
export const selectDeleteWorkError = state => state.works.deleteWork.error;
export const selectDeleteWorkSuccess = state => state.works.deleteWork.success;

export const selectGetWorkCastLoading = state => state.works.getWorkCast.loading;
export const selectGetWorkCastError = state => state.works.getWorkCast.error;
export const selectWorkCastRaw = state => state.works.getWorkCast.cast ?? [];
export const selectWorkCast = createSelector(selectWorkCastRaw, list =>
    list.map(item => ({
        ...item,
        content: item.character.name,
        to: `/works/${item.work_id}/cast/${item.id}`,
    }))
);

export const selectGetWorkPossibleCastLoading = state => state.works.getWorkPossibleCast.loading;
export const selectGetWorkPossibleCastError = state => state.works.getWorkPossibleCast.error;
export const selectWorkPossibleCastRaw = state => state.works.getWorkPossibleCast.possibleCast ?? [];
export const selectWorkPossibleCast = createSelector(selectWorkPossibleCastRaw, list =>
    list.map(item => ({ ...item, content: item.name, to: `/characters/${item.id}` }))
);

export const selectGetCharacterInWorkLoading = state => state.works.getCharacterInWork.loading;
export const selectGetCharacterInWorkError = state => state.works.getCharacterInWork.error;

export const selectUpdateCharacterInWorkLoading = state => state.works.updateCharacterInWork.loading;
export const selectUpdateCharacterInWorkError = state => state.works.updateCharacterInWork.error;

export const selectGenerateCharacterInWorkImageLoading = state => state.works.generateCharacterInWorkImage.loading;
export const selectGenerateCharacterInWorkImageError = state => state.works.generateCharacterInWorkImage.error;

export const selectDeleteCharacterInWorkLoading = state => state.works.deleteCharacterInWork.loading;
export const selectDeleteCharacterInWorkError = state => state.works.deleteCharacterInWork.error;
export const selectDeleteCharacterInWorkSuccess = state => state.works.deleteCharacterInWork.success;

export const selectGetCharacterInWorkRelationshipsLoading = state =>
    state.works.getCharacterInWorkRelationships.loading;
export const selectGetCharacterInWorkRelationshipsError = state => state.works.getCharacterInWorkRelationships.error;
export const selectCharacterInWorkRelationshipsRaw = state =>
    state.works.getCharacterInWorkRelationships.relationships ?? [];
export const selectCharacterInWorkRelationships = createSelector(selectCharacterInWorkRelationshipsRaw, list =>
    list.map(item => ({
        ...item,
        content: item.to.name,
        to: `/works/${item.work_id}/cast/${item.from_character_in_work_id}/relationships/${item.id}`,
    }))
);

export const selectGetWorkRelationshipsLoading = state => state.works.getWorkRelationships.loading;
export const selectGetWorkRelationshipsError = state => state.works.getWorkRelationships.error;
export const selectWorkRelationshipsRaw = state => state.works.getWorkRelationships.relationships ?? [];
export const selectWorkRelationships = createSelector(selectWorkRelationshipsRaw, list =>
    list.map(item => ({
        ...item,
        content: item.to.name,
        to: `/works/${item.work_id}/cast/${item.from_character_in_work_id}/relationships/${item.id}`,
    }))
);

export const selectGetCharacterInWorkPossibleRelationshipsLoading = state =>
    state.works.getCharacterInWorkPossibleRelationships.loading;
export const selectGetCharacterInWorkPossibleRelationshipsError = state =>
    state.works.getCharacterInWorkPossibleRelationships.error;
export const selectCharacterInWorkPossibleRelationshipsRaw = state =>
    state.works.getCharacterInWorkPossibleRelationships.possibleRelationships ?? [];
export const selectCharacterInWorkPossibleRelationships = createSelector(
    selectCharacterInWorkPossibleRelationshipsRaw,
    list => list.map(item => ({ ...item, content: item.character.name, to: `/works/${item.work_id}/cast/${item.id}` }))
);

export const selectCreateRelationshipLoading = state => state.works.createRelationship.loading;
export const selectCreateRelationshipError = state => state.works.createRelationship.error;

export const selectGetRelationshipLoading = state => state.works.getRelationship.loading;
export const selectGetRelationshipError = state => state.works.getRelationship.error;

export const selectUpdateRelationshipLoading = state => state.works.updateRelationship.loading;
export const selectUpdateRelationshipError = state => state.works.updateRelationship.error;

export const selectDeleteRelationshipLoading = state => state.works.deleteRelationship.loading;
export const selectDeleteRelationshipError = state => state.works.deleteRelationship.error;
export const selectDeleteRelationshipSuccess = state => state.works.deleteRelationship.success;

export const selectGetWorkLocationLinksLoading = state => state.works.getWorkLocationLinks.loading;
export const selectGetWorkLocationLinksError = state => state.works.getWorkLocationLinks.error;
export const selectWorkLocationLinksRaw = state => state.works.getWorkLocationLinks.locationLinks ?? [];
export const selectWorkLocationLinks = createSelector(selectWorkLocationLinksRaw, list =>
    list.map(item => ({
        ...item,
        content: item.location.title,
        to: `/works/${item.work_id}/location-links/${item.id}`,
    }))
);

export const selectGetWorkPossibleLocationLinksLoading = state => state.works.getWorkPossibleLocationLinks.loading;
export const selectGetWorkPossibleLocationLinksError = state => state.works.getWorkPossibleLocationLinks.error;
export const selectWorkPossibleLocationLinksRaw = state =>
    state.works.getWorkPossibleLocationLinks.possibleLocationLinks ?? [];
export const selectWorkPossibleLocationLinks = createSelector(selectWorkPossibleLocationLinksRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/locations/${item.id}` }))
);

export const selectLinkWorkLocationLoading = state => state.works.linkWorkLocation.loading;
export const selectLinkWorkLocationError = state => state.works.linkWorkLocation.error;

export const selectGetLocationInWorkLoading = state => state.works.getLocationInWork.loading;
export const selectGetLocationInWorkError = state => state.works.getLocationInWork.error;

export const selectUpdateLocationInWorkLoading = state => state.works.updateLocationInWork.loading;
export const selectUpdateLocationInWorkError = state => state.works.updateLocationInWork.error;

export const selectDeleteLocationInWorkLoading = state => state.works.deleteLocationInWork.loading;
export const selectDeleteLocationInWorkError = state => state.works.deleteLocationInWork.error;
export const selectDeleteLocationInWorkSuccess = state => state.works.deleteLocationInWork.success;

export const selectGetEventsLoading = state => state.works.getEvents.loading;
export const selectGetEventsError = state => state.works.getEvents.error;
export const selectEventsRaw = state => state.works.getEvents.events ?? [];
export const selectEvents = createSelector(selectEventsRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/works/${item.work_id}/events/${item.id}` }))
);

export const selectGetEventsByLocationInWorkIdLoading = state => state.works.getEventsByLocationInWorkId.loading;
export const selectGetEventsByLocationInWorkIdError = state => state.works.getEventsByLocationInWorkId.error;
export const selectGetEventsByLocationInWorkIdRaw = state => state.works.getEventsByLocationInWorkId.events ?? [];
export const selectGetEventsByLocationInWorkId = createSelector(selectGetEventsByLocationInWorkIdRaw, list =>
    list.map(item => ({ ...item, content: item.title, to: `/works/${item.work_id}/events/${item.id}` }))
);

export const selectGetEventsByCharacterInWorkIdLoading = state => state.works.getEventsByCharacterInWorkId.loading;
export const selectGetEventsByCharacterInWorkIdError = state => state.works.getEventsByCharacterInWorkId.error;
export const selectGetEventsByCharacterInWorkIdRaw = state => state.works.getEventsByCharacterInWorkId.events ?? [];
export const selectGetEventsByCharacterInWorkId = createSelector(selectGetEventsByCharacterInWorkIdRaw, list =>
    list.map(item => ({
        ...item,
        content: item.event.title,
        to: `/works/${item.event.work_id}/events/${item.event_id}`,
    }))
);

export const selectCreateEventLoading = state => state.works.createEvent.loading;
export const selectCreateEventError = state => state.works.createEvent.error;

export const selectGetEventLoading = state => state.works.getEvent.loading;
export const selectGetEventError = state => state.works.getEvent.error;

export const selectUpdateEventLoading = state => state.works.updateEvent.loading;
export const selectUpdateEventError = state => state.works.updateEvent.error;

export const selectDeleteEventLoading = state => state.works.deleteEvent.loading;
export const selectDeleteEventError = state => state.works.deleteEvent.error;
export const selectDeleteEventSuccess = state => state.works.deleteEvent.success;

export const selectReorderEventsLoading = state => state.works.reorderEvents.loading;
export const selectReorderEventsError = state => state.works.reorderEvents.error;
export const selectReorderEventsSuccess = state => state.works.reorderEvents.success;

export const selectGetEventParticipantsLoading = state => state.works.getEventParticipants.loading;
export const selectGetEventParticipantsError = state => state.works.getEventParticipants.error;
export const selectEventParticipantsRaw = state => state.works.getEventParticipants.participants ?? [];
export const selectEventParticipants = createSelector(selectEventParticipantsRaw, list =>
    list.map(item => ({
        ...item,
        content: item.character.name,
        to: `/works/${item.event.work_id}/cast/${item.character_in_work_id}`,
    }))
);

export const selectGetEventPossibleParticipantsLoading = state => state.works.getEventPossibleParticipants.loading;
export const selectGetEventPossibleParticipantsError = state => state.works.getEventPossibleParticipants.error;
export const selectEventPossibleParticipantsRaw = state =>
    state.works.getEventPossibleParticipants.possibleParticipants ?? [];
export const selectEventPossibleParticipants = createSelector(selectEventPossibleParticipantsRaw, list =>
    list.map(item => ({ ...item, content: item.character.name }))
);

export const selectLinkEventParticipantLoading = state => state.works.linkEventParticipant.loading;
export const selectLinkEventParticipantError = state => state.works.linkEventParticipant.error;
export const selectLinkEventParticipantSuccess = state => state.works.linkEventParticipant.success;

export const selectUnlinkEventParticipantLoading = state => state.works.unlinkEventParticipant.loading;
export const selectUnlinkEventParticipantError = state => state.works.unlinkEventParticipant.error;
export const selectUnlinkEventParticipantSuccess = state => state.works.unlinkEventParticipant.success;
