import { createSelector } from '@reduxjs/toolkit';

export const selectGetWorksLoading = state => state.works.getWorks.loading;
export const selectGetWorksError = state => state.works.getWorks.error;

export const selectWorksRaw = state => state.works.works ?? [];
export const selectWorks = createSelector(selectWorksRaw, list =>
    list.map(({ id, title }) => ({ id, content: title, to: `/works/${id}` }))
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

export const selectDeleteWorkLoading = state => state.works.deleteWork.loading;
export const selectDeleteWorkError = state => state.works.deleteWork.error;
export const selectDeleteWorkSuccess = state => state.works.deleteWork.success;

export const selectGetWorkCastLoading = state => state.works.getWorkCast.loading;
export const selectGetWorkCastError = state => state.works.getWorkCast.error;
export const selectWorkCastRaw = state => state.works.getWorkCast.cast ?? [];
export const selectWorkCast = createSelector(selectWorkCastRaw, list =>
    list.map(({ id, works_id, character_id, character }) => ({
        id,
        content: character.name,
        character_id,
        to: `/works/${works_id}/cast/${id}`,
    }))
);

export const selectGetWorkPossibleCastLoading = state => state.works.getWorkPossibleCast.loading;
export const selectGetWorkPossibleCastError = state => state.works.getWorkPossibleCast.error;
export const selectWorkPossibleCastRaw = state => state.works.getWorkPossibleCast.possibleCast ?? [];
export const selectWorkPossibleCast = createSelector(selectWorkPossibleCastRaw, list =>
    list.map(({ id, name }) => ({ id, content: name, to: `/characters/${id}` }))
);

export const selectGetCharacterInWorkLoading = state => state.works.getCharacterInWork.loading;
export const selectGetCharacterInWorkError = state => state.works.getCharacterInWork.error;

export const selectUpdateCharacterInWorkLoading = state => state.works.updateCharacterInWork.loading;
export const selectUpdateCharacterInWorkError = state => state.works.updateCharacterInWork.error;

export const selectDeleteCharacterInWorkLoading = state => state.works.deleteCharacterInWork.loading;
export const selectDeleteCharacterInWorkError = state => state.works.deleteCharacterInWork.error;
export const selectDeleteCharacterInWorkSuccess = state => state.works.deleteCharacterInWork.success;

export const selectGetCharacterInWorkRelationshipsLoading = state =>
    state.works.getCharacterInWorkRelationships.loading;
export const selectGetCharacterInWorkRelationshipsError = state => state.works.getCharacterInWorkRelationships.error;

export const selectCharacterInWorkRelationshipsRaw = state =>
    state.works.getCharacterInWorkRelationships.relationships ?? [];

export const selectCharacterInWorkRelationships = createSelector(selectCharacterInWorkRelationshipsRaw, list =>
    list.map(({ id, work_id, from_character_in_work_id, to }) => ({
        id,
        content: to.name,
        to: `/works/${work_id}/cast/${from_character_in_work_id}/relationships/${id}`,
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
    list =>
        list.map(({ id, work_id, character }) => ({ id, content: character.name, to: `/works/${work_id}/cast/${id}` }))
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
    list.map(({ id, work_id, location_id, location }) => ({
        id,
        content: location.title,
        location_id,
        to: `/works/${work_id}/location-links/${id}`,
    }))
);

export const selectGetWorkPossibleLocationLinksLoading = state => state.works.getWorkPossibleLocationLinks.loading;
export const selectGetWorkPossibleLocationLinksError = state => state.works.getWorkPossibleLocationLinks.error;
export const selectWorkPossibleLocationLinksRaw = state =>
    state.works.getWorkPossibleLocationLinks.possibleLocationLinks ?? [];
export const selectWorkPossibleLocationLinks = createSelector(selectWorkPossibleLocationLinksRaw, list =>
    list.map(({ id, title }) => ({ id, content: title, to: `/locations/${id}` }))
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
export const selectEventsId = state => state.works.getEvents.events ?? [];

export const selectCreateEventLoading = state => state.works.createEvent.loading;
export const selectCreateEventError = state => state.works.createEvent.error;

export const selectGetEventLoading = state => state.works.getEvent.loading;
export const selectGetEventError = state => state.works.getEvent.error;

export const selectUpdateEventLoading = state => state.works.updateEvent.loading;
export const selectUpdateEventError = state => state.works.updateEvent.error;

export const selectDeleteEventLoading = state => state.works.deleteEvent.loading;
export const selectDeleteEventError = state => state.works.deleteEvent.error;
export const selectDeleteEventSuccess = state => state.works.deleteEvent.success;

export const selectGetEventParticipantsLoading = state => state.works.getEventParticipants.loading;
export const selectGetEventParticipantsError = state => state.works.getEventParticipants.error;
export const selectEventParticipantsRaw = state => state.works.getEventParticipants.participants ?? [];
export const selectEventParticipants = createSelector(selectEventParticipantsRaw, list =>
    list.map(({ id, character }) => ({ id, content: character.name }))
);

export const selectGetEventPossibleParticipantsLoading = state => state.works.getEventPossibleParticipants.loading;
export const selectGetEventPossibleParticipantsError = state => state.works.getEventPossibleParticipants.error;
export const selectEventPossibleParticipantsRaw = state =>
    state.works.getEventPossibleParticipants.possibleParticipants ?? [];
export const selectEventPossibleParticipants = createSelector(selectEventPossibleParticipantsRaw, list =>
    list.map(({ id, character }) => ({ id, content: character.name }))
);

export const selectLinkEventParticipantLoading = state => state.works.linkEventParticipant.loading;
export const selectLinkEventParticipantError = state => state.works.linkEventParticipant.error;
export const selectLinkEventParticipantSuccess = state => state.works.linkEventParticipant.success;

export const selectUnlinkEventParticipantLoading = state => state.works.unlinkEventParticipant.loading;
export const selectUnlinkEventParticipantError = state => state.works.unlinkEventParticipant.error;
export const selectUnlinkEventParticipantSuccess = state => state.works.unlinkEventParticipant.success;
