import { createSlice } from '@reduxjs/toolkit';
import {
    getWorks,
    createWork,
    getWork,
    updateWork,
    deleteWork,
    getWorkCast,
    linkWorkCharacter,
    getWorkPossibleCast,
    getCharacterInWork,
    updateCharacterInWork,
    deleteCharacterInWork,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    createRelationship,
    getRelationship,
    updateRelationship,
    deleteRelationship,
    getWorkLocationLinks,
    getWorkPossibleLocationLinks,
    linkWorkLocation,
    getLocationInWork,
    updateLocationInWork,
    deleteLocationInWork,
    getEvents,
    getEventsByLocationInWorkId,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    getEventParticipants,
    getEventPossibleParticipants,
    linkEventParticipant,
    unlinkEventParticipant,
} from './operations';

const op = { loading: false, error: null };

const initialState = {
    works: [],
    work: null,
    getWorks: { ...op },
    createWork: { ...op },
    getWork: { ...op },
    updateWork: { ...op },
    deleteWork: { ...op, success: false },

    getWorkCast: { ...op, cast: [] },
    linkWorkCharacter: { ...op },
    getWorkPossibleCast: { ...op, possibleCast: [] },
    characterInWork: null,
    getCharacterInWork: { ...op },
    updateCharacterInWork: { ...op },
    deleteCharacterInWork: { ...op, success: false },

    getCharacterInWorkRelationships: { ...op, relationships: [] },
    getCharacterInWorkPossibleRelationships: { ...op, possibleRelationships: [] },
    createRelationship: { ...op },
    relationship: null,
    getRelationship: { ...op },
    updateRelationship: { ...op },
    deleteRelationship: { ...op, success: false },

    getWorkLocationLinks: { ...op, locationLinks: [] },
    getWorkPossibleLocationLinks: { ...op, possibleLocationLinks: [] },
    linkWorkLocation: { ...op },
    locationInWork: null,
    getLocationInWork: { ...op },
    updateLocationInWork: { ...op },
    deleteLocationInWork: { ...op, success: false },

    getEvents: { ...op, events: [] },
    getEventsByLocationInWorkId: { ...op, events: [] },
    createEvent: { ...op },
    event: null,
    getEvent: { ...op },
    updateEvent: { ...op },
    deleteEvent: { ...op, success: false },
    reorderEvents: { ...op, success: false },

    getEventParticipants: { ...op, participants: [] },
    getEventPossibleParticipants: { ...op, possibleParticipants: [] },
    linkEventParticipant: { ...op, success: false },
    unlinkEventParticipant: { ...op, success: false },
};

const worksSlice = createSlice({
    name: 'works',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getWorks.pending, state => {
                state.getWorks.loading = true;
                state.getWorks.error = null;
            })
            .addCase(getWorks.fulfilled, (state, action) => {
                state.getWorks.loading = false;
                state.works = action.payload;
            })
            .addCase(getWorks.rejected, (state, action) => {
                state.getWorks.loading = false;
                state.getWorks.error = action.payload;
            });
        builder
            .addCase(createWork.pending, state => {
                state.createWork.loading = true;
                state.createWork.error = null;
            })
            .addCase(createWork.fulfilled, (state, action) => {
                state.createWork.loading = false;
                state.work = action.payload;
            })
            .addCase(createWork.rejected, (state, action) => {
                state.createWork.loading = false;
                state.createWork.error = action.payload;
            });
        builder
            .addCase(getWork.pending, state => {
                state.getWork.loading = true;
                state.getWork.error = null;
            })
            .addCase(getWork.fulfilled, (state, action) => {
                state.getWork.loading = false;
                state.work = action.payload;
            })
            .addCase(getWork.rejected, (state, action) => {
                state.getWork.loading = false;
                state.getWork.error = action.payload;
            });
        builder
            .addCase(updateWork.pending, state => {
                state.updateWork.loading = true;
                state.updateWork.error = null;
            })
            .addCase(updateWork.fulfilled, (state, action) => {
                state.updateWork.loading = false;
                state.work = action.payload;
            })
            .addCase(updateWork.rejected, (state, action) => {
                state.updateWork.loading = false;
                state.updateWork.error = action.payload;
            });
        builder
            .addCase(deleteWork.pending, state => {
                state.deleteWork.loading = true;
                state.deleteWork.error = null;
                state.deleteWork.success = false;
            })
            .addCase(deleteWork.fulfilled, state => {
                state.deleteWork.loading = false;
                state.deleteWork.success = true;
                state.work = null;
            })
            .addCase(deleteWork.rejected, (state, action) => {
                state.deleteWork.loading = false;
                state.deleteWork.error = action.payload;
            });
        builder
            .addCase(getWorkCast.pending, state => {
                state.getWorkCast.loading = true;
                state.getWorkCast.error = null;
            })
            .addCase(getWorkCast.fulfilled, (state, action) => {
                state.getWorkCast.loading = false;
                state.getWorkCast.cast = action.payload;
            })
            .addCase(getWorkCast.rejected, (state, action) => {
                state.getWorkCast.loading = false;
                state.getWorkCast.error = action.payload;
            });
        builder
            .addCase(linkWorkCharacter.pending, state => {
                state.linkWorkCharacter.loading = true;
                state.linkWorkCharacter.error = null;
            })
            .addCase(linkWorkCharacter.fulfilled, (state, action) => {
                state.linkWorkCharacter.loading = false;
                state.characterInWork = action.payload;
            })
            .addCase(linkWorkCharacter.rejected, (state, action) => {
                state.linkWorkCharacter.loading = false;
                state.linkWorkCharacter.error = action.payload;
            });
        builder
            .addCase(getWorkPossibleCast.pending, state => {
                state.getWorkPossibleCast.loading = true;
                state.getWorkPossibleCast.error = null;
            })
            .addCase(getWorkPossibleCast.fulfilled, (state, action) => {
                state.getWorkPossibleCast.loading = false;
                state.getWorkPossibleCast.possibleCast = action.payload;
            })
            .addCase(getWorkPossibleCast.rejected, (state, action) => {
                state.getWorkPossibleCast.loading = false;
                state.getWorkPossibleCast.error = action.payload;
            });
        builder
            .addCase(getCharacterInWork.pending, state => {
                state.getCharacterInWork.loading = true;
                state.getCharacterInWork.error = null;
            })
            .addCase(getCharacterInWork.fulfilled, (state, action) => {
                state.getCharacterInWork.loading = false;
                state.characterInWork = action.payload;
            })
            .addCase(getCharacterInWork.rejected, (state, action) => {
                state.getCharacterInWork.loading = false;
                state.getCharacterInWork.error = action.payload;
            });
        builder
            .addCase(updateCharacterInWork.pending, state => {
                state.updateCharacterInWork.loading = true;
                state.updateCharacterInWork.error = null;
            })
            .addCase(updateCharacterInWork.fulfilled, (state, action) => {
                state.updateCharacterInWork.loading = false;
                state.characterInWork = action.payload;
            })
            .addCase(updateCharacterInWork.rejected, (state, action) => {
                state.updateCharacterInWork.loading = false;
                state.updateCharacterInWork.error = action.payload;
            });
        builder
            .addCase(deleteCharacterInWork.pending, state => {
                state.deleteCharacterInWork.loading = true;
                state.deleteCharacterInWork.error = null;
                state.deleteCharacterInWork.success = false;
            })
            .addCase(deleteCharacterInWork.fulfilled, state => {
                state.deleteCharacterInWork.loading = false;
                state.deleteCharacterInWork.success = true;
                state.characterInWork = null;
            })
            .addCase(deleteCharacterInWork.rejected, (state, action) => {
                state.deleteCharacterInWork.loading = false;
                state.deleteCharacterInWork.error = action.payload;
            });
        builder
            .addCase(getCharacterInWorkRelationships.pending, state => {
                state.getCharacterInWorkRelationships.loading = true;
                state.getCharacterInWorkRelationships.error = null;
            })
            .addCase(getCharacterInWorkRelationships.fulfilled, (state, action) => {
                state.getCharacterInWorkRelationships.loading = false;
                state.getCharacterInWorkRelationships.relationships = action.payload;
            })
            .addCase(getCharacterInWorkRelationships.rejected, (state, action) => {
                state.getCharacterInWorkRelationships.loading = false;
                state.getCharacterInWorkRelationships.error = action.payload;
            });
        builder
            .addCase(getCharacterInWorkPossibleRelationships.pending, state => {
                state.getCharacterInWorkPossibleRelationships.loading = true;
                state.getCharacterInWorkPossibleRelationships.error = null;
            })
            .addCase(getCharacterInWorkPossibleRelationships.fulfilled, (state, action) => {
                state.getCharacterInWorkPossibleRelationships.loading = false;
                state.getCharacterInWorkPossibleRelationships.possibleRelationships = action.payload;
            })
            .addCase(getCharacterInWorkPossibleRelationships.rejected, (state, action) => {
                state.getCharacterInWorkPossibleRelationships.loading = false;
                state.getCharacterInWorkPossibleRelationships.error = action.payload;
            });
        builder
            .addCase(createRelationship.pending, state => {
                state.createRelationship.loading = true;
                state.createRelationship.error = null;
            })
            .addCase(createRelationship.fulfilled, (state, action) => {
                state.createRelationship.loading = false;
                state.relationship = action.payload;
            })
            .addCase(createRelationship.rejected, (state, action) => {
                state.createRelationship.loading = false;
                state.createRelationship.error = action.payload;
            });
        builder
            .addCase(getRelationship.pending, state => {
                state.getRelationship.loading = true;
                state.getRelationship.error = null;
            })
            .addCase(getRelationship.fulfilled, (state, action) => {
                state.getRelationship.loading = false;
                state.relationship = action.payload;
            })
            .addCase(getRelationship.rejected, (state, action) => {
                state.getRelationship.loading = false;
                state.getRelationship.error = action.payload;
            });
        builder
            .addCase(updateRelationship.pending, state => {
                state.updateRelationship.loading = true;
                state.updateRelationship.error = null;
            })
            .addCase(updateRelationship.fulfilled, (state, action) => {
                state.updateRelationship.loading = false;
                state.relationship = action.payload;
            })
            .addCase(updateRelationship.rejected, (state, action) => {
                state.updateRelationship.loading = false;
                state.updateRelationship.error = action.payload;
            });
        builder
            .addCase(deleteRelationship.pending, state => {
                state.deleteRelationship.loading = true;
                state.deleteRelationship.error = null;
                state.deleteRelationship.success = false;
            })
            .addCase(deleteRelationship.fulfilled, state => {
                state.deleteRelationship.loading = false;
                state.deleteRelationship.success = true;
                state.relationship = null;
            })
            .addCase(deleteRelationship.rejected, (state, action) => {
                state.deleteRelationship.loading = false;
                state.deleteRelationship.error = action.payload;
            });
        builder
            .addCase(getWorkLocationLinks.pending, state => {
                state.getWorkLocationLinks.loading = true;
                state.getWorkLocationLinks.error = null;
            })
            .addCase(getWorkLocationLinks.fulfilled, (state, action) => {
                state.getWorkLocationLinks.loading = false;
                state.getWorkLocationLinks.locationLinks = action.payload;
            })
            .addCase(getWorkLocationLinks.rejected, (state, action) => {
                state.getWorkLocationLinks.loading = false;
                state.getWorkLocationLinks.error = action.payload;
            });
        builder
            .addCase(getWorkPossibleLocationLinks.pending, state => {
                state.getWorkPossibleLocationLinks.loading = true;
                state.getWorkPossibleLocationLinks.error = null;
            })
            .addCase(getWorkPossibleLocationLinks.fulfilled, (state, action) => {
                state.getWorkPossibleLocationLinks.loading = false;
                state.getWorkPossibleLocationLinks.possibleLocationLinks = action.payload;
            })
            .addCase(getWorkPossibleLocationLinks.rejected, (state, action) => {
                state.getWorkPossibleLocationLinks.loading = false;
                state.getWorkPossibleLocationLinks.error = action.payload;
            });
        builder
            .addCase(linkWorkLocation.pending, state => {
                state.linkWorkLocation.loading = true;
                state.linkWorkLocation.error = null;
            })
            .addCase(linkWorkLocation.fulfilled, (state, action) => {
                state.linkWorkLocation.loading = false;
                state.locationInWork = action.payload;
            })
            .addCase(linkWorkLocation.rejected, (state, action) => {
                state.linkWorkLocation.loading = false;
                state.linkWorkLocation.error = action.payload;
            });
        builder
            .addCase(getLocationInWork.pending, state => {
                state.getLocationInWork.loading = true;
                state.getLocationInWork.error = null;
            })
            .addCase(getLocationInWork.fulfilled, (state, action) => {
                state.getLocationInWork.loading = false;
                state.locationInWork = action.payload;
            })
            .addCase(getLocationInWork.rejected, (state, action) => {
                state.getLocationInWork.loading = false;
                state.getLocationInWork.error = action.payload;
            });
        builder
            .addCase(updateLocationInWork.pending, state => {
                state.updateLocationInWork.loading = true;
                state.updateLocationInWork.error = null;
            })
            .addCase(updateLocationInWork.fulfilled, (state, action) => {
                state.updateLocationInWork.loading = false;
                state.locationInWork = action.payload;
            })
            .addCase(updateLocationInWork.rejected, (state, action) => {
                state.updateLocationInWork.loading = false;
                state.updateLocationInWork.error = action.payload;
            });
        builder
            .addCase(deleteLocationInWork.pending, state => {
                state.deleteLocationInWork.loading = true;
                state.deleteLocationInWork.error = null;
                state.deleteLocationInWork.success = false;
            })
            .addCase(deleteLocationInWork.fulfilled, state => {
                state.deleteLocationInWork.loading = false;
                state.deleteLocationInWork.success = true;
                state.locationInWork = null;
            })
            .addCase(deleteLocationInWork.rejected, (state, action) => {
                state.deleteLocationInWork.loading = false;
                state.deleteLocationInWork.error = action.payload;
            });
        builder
            .addCase(getEvents.pending, state => {
                state.getEvents.loading = true;
                state.getEvents.error = null;
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.getEvents.loading = false;
                state.getEvents.events = action.payload;
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.getEvents.loading = false;
                state.getEvents.error = action.payload;
            });
        builder
            .addCase(getEventsByLocationInWorkId.pending, state => {
                state.getEventsByLocationInWorkId.loading = true;
                state.getEventsByLocationInWorkId.error = null;
            })
            .addCase(getEventsByLocationInWorkId.fulfilled, (state, action) => {
                state.getEventsByLocationInWorkId.loading = false;
                state.getEventsByLocationInWorkId.events = action.payload;
            })
            .addCase(getEventsByLocationInWorkId.rejected, (state, action) => {
                state.getEventsByLocationInWorkId.loading = false;
                state.getEventsByLocationInWorkId.error = action.payload;
            });
        builder
            .addCase(createEvent.pending, state => {
                state.createEvent.loading = true;
                state.createEvent.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.createEvent.loading = false;
                state.event = action.payload;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.createEvent.loading = false;
                state.createEvent.error = action.payload;
            });
        builder
            .addCase(getEvent.pending, state => {
                state.getEvent.loading = true;
                state.getEvent.error = null;
            })
            .addCase(getEvent.fulfilled, (state, action) => {
                state.getEvent.loading = false;
                state.event = action.payload;
            })
            .addCase(getEvent.rejected, (state, action) => {
                state.getEvent.loading = false;
                state.getEvent.error = action.payload;
            });
        builder
            .addCase(updateEvent.pending, state => {
                state.updateEvent.loading = true;
                state.updateEvent.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.updateEvent.loading = false;
                state.event = action.payload;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.updateEvent.loading = false;
                state.updateEvent.error = action.payload;
            });
        builder
            .addCase(deleteEvent.pending, state => {
                state.deleteEvent.loading = true;
                state.deleteEvent.error = null;
                state.deleteEvent.success = false;
            })
            .addCase(deleteEvent.fulfilled, state => {
                state.deleteEvent.loading = false;
                state.deleteEvent.success = true;
                state.event = null;
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.deleteEvent.loading = false;
                state.deleteEvent.error = action.payload;
            });
        builder
            .addCase(reorderEvents.pending, state => {
                state.reorderEvents.loading = true;
                state.reorderEvents.error = null;
                state.reorderEvents.success = false;
            })
            .addCase(reorderEvents.fulfilled, state => {
                state.reorderEvents.loading = false;
                state.reorderEvents.success = true;
            })
            .addCase(reorderEvents.rejected, (state, action) => {
                state.reorderEvents.loading = false;
                state.reorderEvents.error = action.payload;
            });
        builder
            .addCase(getEventParticipants.pending, state => {
                state.getEventParticipants.loading = true;
                state.getEventParticipants.error = null;
            })
            .addCase(getEventParticipants.fulfilled, (state, action) => {
                state.getEventParticipants.loading = false;
                state.getEventParticipants.participants = action.payload;
            })
            .addCase(getEventParticipants.rejected, (state, action) => {
                state.getEventParticipants.loading = false;
                state.getEventParticipants.error = action.payload;
            });
        builder
            .addCase(getEventPossibleParticipants.pending, state => {
                state.getEventPossibleParticipants.loading = true;
                state.getEventPossibleParticipants.error = null;
            })
            .addCase(getEventPossibleParticipants.fulfilled, (state, action) => {
                state.getEventPossibleParticipants.loading = false;
                state.getEventPossibleParticipants.possibleParticipants = action.payload;
            })
            .addCase(getEventPossibleParticipants.rejected, (state, action) => {
                state.getEventPossibleParticipants.loading = false;
                state.getEventPossibleParticipants.error = action.payload;
            });
        builder
            .addCase(linkEventParticipant.pending, state => {
                state.linkEventParticipant.loading = true;
                state.linkEventParticipant.error = null;
                state.linkEventParticipant.success = false;
            })
            .addCase(linkEventParticipant.fulfilled, state => {
                state.linkEventParticipant.loading = false;
                state.linkEventParticipant.success = true;
            })
            .addCase(linkEventParticipant.rejected, (state, action) => {
                state.linkEventParticipant.loading = false;
                state.linkEventParticipant.error = action.payload;
            });

        builder
            .addCase(unlinkEventParticipant.pending, state => {
                state.unlinkEventParticipant.loading = true;
                state.unlinkEventParticipant.error = null;
                state.unlinkEventParticipant.success = false;
            })
            .addCase(unlinkEventParticipant.fulfilled, state => {
                state.unlinkEventParticipant.loading = false;
                state.unlinkEventParticipant.success = true;
            })
            .addCase(unlinkEventParticipant.rejected, (state, action) => {
                state.unlinkEventParticipant.loading = false;
                state.unlinkEventParticipant.error = action.payload;
            });
    },
});

export default worksSlice.reducer;
