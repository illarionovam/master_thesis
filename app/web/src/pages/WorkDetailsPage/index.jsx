import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';

import {
    getWork,
    updateWork,
    deleteWork,
    getWorkCast,
    getWorkPossibleCast,
    linkWorkCharacter,
    deleteCharacterInWork,
    getWorkLocationLinks,
    getWorkPossibleLocationLinks,
    linkWorkLocation,
    deleteLocationInWork,
    getEvents,
    createEvent,
    reorderEvents,
} from '../../redux/works/operations';

import {
    selectWork,
    selectGetWorkLoading,
    selectGetWorkError,
    selectUpdateWorkLoading,
    selectUpdateWorkError,
    selectDeleteWorkLoading,
    selectDeleteWorkError,
    selectWorkCast,
    selectGetWorkCastLoading,
    selectGetWorkCastError,
    selectWorkPossibleCast,
    selectGetWorkPossibleCastLoading,
    selectGetWorkPossibleCastError,
    selectWorkLocationLinks,
    selectGetWorkLocationLinksLoading,
    selectGetWorkLocationLinksError,
    selectWorkPossibleLocationLinks,
    selectGetWorkPossibleLocationLinksLoading,
    selectGetWorkPossibleLocationLinksError,
    selectGetEventsLoading,
    selectGetEventsError,
    selectEvents,
} from '../../redux/works/selectors';

import styles from './WorkDetailsPage.module.css';

import CreateEventModal from '../../components/CreateEventModal';

export default function WorkDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const work = useSelector(selectWork);
    const loading = useSelector(selectGetWorkLoading);
    const error = useSelector(selectGetWorkError);

    const updateLoading = useSelector(selectUpdateWorkLoading);
    const updateError = useSelector(selectUpdateWorkError);
    const deleteLoading = useSelector(selectDeleteWorkLoading);
    const deleteError = useSelector(selectDeleteWorkError);

    const cast = useSelector(selectWorkCast) || [];
    const castLoading = useSelector(selectGetWorkCastLoading);
    const castError = useSelector(selectGetWorkCastError);

    const possibleCast = useSelector(selectWorkPossibleCast) || [];
    const possibleCastLoading = useSelector(selectGetWorkPossibleCastLoading);
    const possibleCastError = useSelector(selectGetWorkPossibleCastError);

    const locationLinks = useSelector(selectWorkLocationLinks) || [];
    const locLinksLoading = useSelector(selectGetWorkLocationLinksLoading);
    const locLinksError = useSelector(selectGetWorkLocationLinksError);

    const possibleLocLinks = useSelector(selectWorkPossibleLocationLinks) || [];
    const possibleLocLinksLoading = useSelector(selectGetWorkPossibleLocationLinksLoading);
    const possibleLocLinksError = useSelector(selectGetWorkPossibleLocationLinksError);

    const events = useSelector(selectEvents) || [];
    const eventsLoading = useSelector(selectGetEventsLoading);
    const eventsError = useSelector(selectGetEventsError);

    const [editMode, setEditMode] = useState(false);
    const formRef = useRef(null);

    const [castAddOpen, setCastAddOpen] = useState(false);
    const [selectedCharacterId, setSelectedCharacterId] = useState('');
    const [addingCast, setAddingCast] = useState(false);

    const [locAddOpen, setLocAddOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState('');
    const [addingLoc, setAddingLoc] = useState(false);

    const [removingCastId, setRemovingCastId] = useState(null);
    const [removingLocId, setRemovingLocId] = useState(null);

    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [creatingEvent, setCreatingEvent] = useState(false);

    const [reorderMode, setReorderMode] = useState(false);
    const [savingReorder, setSavingReorder] = useState(false);
    const [localEvents, setLocalEvents] = useState([]);
    const dragIndexRef = useRef(null);

    useEffect(() => {
        if (!id) return;
        dispatch(getWork(id));
        dispatch(getWorkCast(id));
        dispatch(getWorkLocationLinks(id));
        dispatch(getEvents(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (castAddOpen && id) dispatch(getWorkPossibleCast(id));
    }, [castAddOpen, dispatch, id]);

    useEffect(() => {
        if (locAddOpen && id) dispatch(getWorkPossibleLocationLinks(id));
    }, [locAddOpen, dispatch, id]);

    useEffect(() => {
        if (!reorderMode) setLocalEvents(events);
    }, [events, reorderMode]);

    const disableAll = loading || updateLoading || deleteLoading;

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (!formRef.current || !work) return;
        formRef.current.title.value = work.title ?? '';
        formRef.current.annotation.value = work.annotation ?? '';
        formRef.current.synopsis.value = work.synopsis ?? '';
    };

    const handleSave = async () => {
        if (!formRef.current) return;
        const fd = new FormData(formRef.current);
        const title = (fd.get('title') || '').toString().trim();
        const annotationRaw = (fd.get('annotation') || '').toString().trim();
        const synopsisRaw = (fd.get('synopsis') || '').toString().trim();

        if (!title) return;

        const data = {
            title,
            annotation: annotationRaw || null,
            synopsis: synopsisRaw || null,
        };

        const action = await dispatch(updateWork({ id, data }));
        if (updateWork.fulfilled.match(action)) setEditMode(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        const ok = window.confirm('Delete this work? This action cannot be undone.');
        if (!ok) return;
        const action = await dispatch(deleteWork(id));
        if (deleteWork.fulfilled.match(action)) {
            navigate('/works', { replace: true });
        }
    };

    const openCastAdd = () => {
        setSelectedCharacterId('');
        setCastAddOpen(true);
    };
    const closeCastAdd = () => {
        if (addingCast) return;
        setCastAddOpen(false);
        setSelectedCharacterId('');
    };

    const openLocAdd = () => {
        setSelectedLocationId('');
        setLocAddOpen(true);
    };
    const closeLocAdd = () => {
        if (addingLoc) return;
        setLocAddOpen(false);
        setSelectedLocationId('');
    };

    const handleAddCast = async () => {
        if (!id || !selectedCharacterId) return;
        try {
            setAddingCast(true);
            const action = await dispatch(
                linkWorkCharacter({ workId: id, data: { character_id: selectedCharacterId } })
            );
            if (linkWorkCharacter.fulfilled.match(action)) {
                setCastAddOpen(false);
                setSelectedCharacterId('');
                dispatch(getWorkCast(id));
            }
        } finally {
            setAddingCast(false);
        }
    };

    const handleRemoveCast = async (workId, characterInWorkId) => {
        if (!id) return;
        try {
            setRemovingCastId(characterInWorkId);
            const action = await dispatch(deleteCharacterInWork({ workId, characterInWorkId }));
            if (deleteCharacterInWork.fulfilled.match(action)) {
                dispatch(getWorkCast(id));
            }
        } finally {
            setRemovingCastId(null);
        }
    };

    const handleAddLocation = async () => {
        if (!id || !selectedLocationId) return;
        try {
            setAddingLoc(true);
            const action = await dispatch(linkWorkLocation({ workId: id, data: { location_id: selectedLocationId } }));
            if (linkWorkLocation.fulfilled.match(action)) {
                setLocAddOpen(false);
                setSelectedLocationId('');
                dispatch(getWorkLocationLinks(id));
            }
        } finally {
            setAddingLoc(false);
        }
    };

    const handleRemoveLocation = async (workId, locationInWorkId) => {
        if (!id) return;
        try {
            setRemovingLocId(locationInWorkId);
            const action = await dispatch(deleteLocationInWork({ workId, locationInWorkId }));
            if (deleteLocationInWork.fulfilled.match(action)) {
                dispatch(getWorkLocationLinks(id));
            }
        } finally {
            setRemovingLocId(null);
        }
    };

    const openEventModal = () => setEventModalOpen(true);
    const closeEventModal = () => {
        if (creatingEvent) return;
        setEventModalOpen(false);
    };

    const handleCreateEvent = async payload => {
        if (!id) return;
        try {
            setCreatingEvent(true);
            const action = await dispatch(createEvent({ workId: id, data: payload }));
            if (createEvent.fulfilled.match(action)) {
                setEventModalOpen(false);
                dispatch(getEvents(id));
            }
        } finally {
            setCreatingEvent(false);
        }
    };

    const handleStartReorder = () => {
        setLocalEvents(events);
        setReorderMode(true);
    };

    const handleCancelReorder = () => {
        setLocalEvents(events);
        setReorderMode(false);
    };

    const handleSaveReorder = async () => {
        if (!id) return;
        try {
            setSavingReorder(true);
            const payload = {
                data: localEvents.map((ev, idx) => ({
                    id: ev.id,
                    order_in_work: idx + 1,
                })),
            };

            await dispatch(reorderEvents({ workId: id, data: payload })).unwrap();
            await dispatch(getEvents(id));

            setReorderMode(false);
        } finally {
            setSavingReorder(false);
        }
    };

    const onDragStart = index => e => {
        dragIndexRef.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };
    const onDragOver = overIndex => e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const from = dragIndexRef.current;
        if (from === null || from === overIndex) return;
        setLocalEvents(prev => {
            const next = prev.slice();
            const [moved] = next.splice(from, 1);
            next.splice(overIndex, 0, moved);
            dragIndexRef.current = overIndex;
            return next;
        });
    };
    const onDrop = () => {
        dragIndexRef.current = null;
    };

    return (
        <main aria-labelledby={titleId} className={styles.page}>
            <div className={styles.header}>
                <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                    <ol>
                        <li>
                            <Link to="/works" className={styles.crumbLink}>
                                WORKS
                            </Link>
                        </li>
                        <li aria-current="page">
                            <Link to={`/works/${id}`} className={styles.crumbLink}>
                                {work?.title ?? '—'}
                            </Link>
                        </li>
                    </ol>
                </nav>

                <Title id={titleId}>{work?.title ?? '—'}</Title>
            </div>

            {loading && (
                <p aria-live="polite" className={styles.muted}>
                    Loading...
                </p>
            )}
            {error && (
                <p role="alert" className={styles.error}>
                    {String(error)}
                </p>
            )}

            {!loading && !error && work && (
                <>
                    <section className={styles.card} aria-label="Work info">
                        <form ref={formRef} className={styles.form} onSubmit={e => e.preventDefault()} noValidate>
                            <div className={styles.field}>
                                <label htmlFor="work-title" className={styles.label}>
                                    Title
                                </label>
                                <input
                                    id="work-title"
                                    name="title"
                                    type="text"
                                    defaultValue={work.title ?? ''}
                                    className={styles.input}
                                    disabled={!editMode || disableAll}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="work-annotation" className={styles.label}>
                                    Annotation
                                </label>
                                <textarea
                                    id="work-annotation"
                                    name="annotation"
                                    rows={4}
                                    defaultValue={work.annotation ?? ''}
                                    className={`${styles.input} ${styles.textarea}`}
                                    disabled={!editMode || disableAll}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="work-synopsis" className={styles.label}>
                                    Synopsis
                                </label>
                                <textarea
                                    id="work-synopsis"
                                    name="synopsis"
                                    rows={8}
                                    defaultValue={work.synopsis ?? ''}
                                    className={`${styles.input} ${styles.textarea}`}
                                    disabled={!editMode || disableAll}
                                />
                            </div>

                            {updateError && (
                                <p role="alert" className={styles.error}>
                                    {String(updateError)}
                                </p>
                            )}
                            {deleteError && (
                                <p role="alert" className={styles.error}>
                                    {String(deleteError)}
                                </p>
                            )}

                            <div className={styles.actions}>
                                {!editMode ? (
                                    <>
                                        <button
                                            type="button"
                                            className={styles.primaryBtn}
                                            onClick={handleEdit}
                                            disabled={disableAll}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.dangerBtn}
                                            onClick={handleDelete}
                                            disabled={disableAll}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={styles.primaryBtn}
                                            onClick={handleSave}
                                            disabled={updateLoading}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.ghostBtn}
                                            onClick={handleCancel}
                                            disabled={updateLoading}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </section>

                    <section className={styles.card} aria-label="Cast">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Cast</h2>
                            <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={openCastAdd}
                                disabled={castLoading}
                                aria-label="Add character"
                                title="Add character"
                            >
                                Add character
                            </button>
                        </div>

                        {castLoading && (
                            <p aria-live="polite" className={styles.muted}>
                                Loading...
                            </p>
                        )}
                        {!castLoading && castError && (
                            <p role="alert" className={styles.error}>
                                {String(castError)}
                            </p>
                        )}

                        {!castLoading && !castError && (
                            <>
                                {cast.length > 0 ? (
                                    <List
                                        items={cast}
                                        onRemove={({ id: characterInWorkId, work_id: workId }) => {
                                            if (removingCastId) return;
                                            handleRemoveCast(workId, characterInWorkId);
                                        }}
                                    />
                                ) : (
                                    <p className={styles.muted}>No cast yet.</p>
                                )}
                            </>
                        )}
                    </section>

                    <section className={styles.card} aria-label="Location links">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Location links</h2>
                            <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={openLocAdd}
                                disabled={locLinksLoading}
                                aria-label="Add location"
                                title="Add location"
                            >
                                Add location
                            </button>
                        </div>

                        {locLinksLoading && (
                            <p aria-live="polite" className={styles.muted}>
                                Loading...
                            </p>
                        )}
                        {!locLinksLoading && locLinksError && (
                            <p role="alert" className={styles.error}>
                                {String(locLinksError)}
                            </p>
                        )}

                        {!locLinksLoading && !locLinksError && (
                            <>
                                {locationLinks.length > 0 ? (
                                    <List
                                        items={locationLinks}
                                        onRemove={({ id: locationInWorkId, work_id: workId }) => {
                                            if (removingLocId) return;
                                            handleRemoveLocation(workId, locationInWorkId);
                                        }}
                                    />
                                ) : (
                                    <p className={styles.muted}>No locations linked yet.</p>
                                )}
                            </>
                        )}
                    </section>

                    {castAddOpen && (
                        <dialog open className={styles.dialog} aria-labelledby="add-cast-title" onClose={closeCastAdd}>
                            <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                                <h3 id="add-cast-title" className={styles.modalTitle}>
                                    Add character
                                </h3>

                                {possibleCastLoading && (
                                    <p className={styles.muted} aria-live="polite">
                                        Loading characters...
                                    </p>
                                )}
                                {!possibleCastLoading && possibleCastError && (
                                    <p className={styles.error} role="alert">
                                        {String(possibleCastError)}
                                    </p>
                                )}

                                {!possibleCastLoading && !possibleCastError && (
                                    <>
                                        {possibleCast.length === 0 ? (
                                            <p className={styles.muted}>No available characters to add.</p>
                                        ) : (
                                            <ul className={styles.radioList}>
                                                {possibleCast.map(c => (
                                                    <li key={c.id}>
                                                        <label className={styles.radioRow}>
                                                            <input
                                                                type="radio"
                                                                name="character"
                                                                value={c.id}
                                                                checked={String(selectedCharacterId) === String(c.id)}
                                                                onChange={e => setSelectedCharacterId(e.target.value)}
                                                            />
                                                            <span>{c.content ?? c.title ?? `#${c.id}`}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={handleAddCast}
                                        disabled={addingCast || possibleCastLoading || !selectedCharacterId}
                                    >
                                        {addingCast ? 'Adding...' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={closeCastAdd}
                                        disabled={addingCast}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </dialog>
                    )}

                    {locAddOpen && (
                        <dialog open className={styles.dialog} aria-labelledby="add-loc-title" onClose={closeLocAdd}>
                            <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                                <h3 id="add-loc-title" className={styles.modalTitle}>
                                    Add location
                                </h3>

                                {possibleLocLinksLoading && (
                                    <p className={styles.muted} aria-live="polite">
                                        Loading locations...
                                    </p>
                                )}
                                {!possibleLocLinksLoading && possibleLocLinksError && (
                                    <p className={styles.error} role="alert">
                                        {String(possibleLocLinksError)}
                                    </p>
                                )}

                                {!possibleLocLinksLoading && !possibleLocLinksError && (
                                    <>
                                        {possibleLocLinks.length === 0 ? (
                                            <p className={styles.muted}>No available locations to add.</p>
                                        ) : (
                                            <ul className={styles.radioList}>
                                                {possibleLocLinks.map(l => (
                                                    <li key={l.id}>
                                                        <label className={styles.radioRow}>
                                                            <input
                                                                type="radio"
                                                                name="location"
                                                                value={l.id}
                                                                checked={String(selectedLocationId) === String(l.id)}
                                                                onChange={e => setSelectedLocationId(e.target.value)}
                                                            />
                                                            <span>{l.content ?? l.title ?? `#${l.id}`}</span>
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )}

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={handleAddLocation}
                                        disabled={addingLoc || possibleLocLinksLoading || !selectedLocationId}
                                    >
                                        {addingLoc ? 'Adding...' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={closeLocAdd}
                                        disabled={addingLoc}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </dialog>
                    )}

                    <section className={styles.card} aria-label="Events">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Events</h2>
                            {!reorderMode ? (
                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={openEventModal}
                                        disabled={eventsLoading}
                                        aria-label="Add event"
                                        title="Add event"
                                    >
                                        Add event
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={handleStartReorder}
                                        disabled={eventsLoading || events.length === 0}
                                        aria-label="Reorder events"
                                        title="Reorder events"
                                    >
                                        Reorder
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={handleSaveReorder}
                                        disabled={savingReorder}
                                        aria-label="Save order"
                                        title="Save order"
                                    >
                                        {savingReorder ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={handleCancelReorder}
                                        disabled={savingReorder}
                                        aria-label="Cancel reorder"
                                        title="Cancel reorder"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {eventsLoading && (
                            <p aria-live="polite" className={styles.muted}>
                                Loading...
                            </p>
                        )}
                        {!eventsLoading && eventsError && (
                            <p role="alert" className={styles.error}>
                                {String(eventsError)}
                            </p>
                        )}

                        {!eventsLoading &&
                            !eventsError &&
                            (events.length > 0 ? (
                                !reorderMode ? (
                                    <List items={events} />
                                ) : (
                                    <ul className={styles.draggableList} role="list">
                                        {localEvents.map((ev, idx) => (
                                            <li
                                                key={ev.id}
                                                className={styles.draggableItem}
                                                draggable
                                                onDragStart={onDragStart(idx)}
                                                onDragOver={onDragOver(idx)}
                                                onDrop={onDrop}
                                                aria-label={`Move ${ev.title ?? ev.description}`}
                                                title="Drag to reorder"
                                            >
                                                <span className={styles.dragHandle} aria-hidden>
                                                    ⋮⋮
                                                </span>
                                                <span className={styles.itemText}>
                                                    {ev.content ?? ev.title ?? ev.description}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            ) : (
                                <p className={styles.muted}>No events yet.</p>
                            ))}
                    </section>

                    {eventModalOpen && (
                        <CreateEventModal
                            open={eventModalOpen}
                            onClose={closeEventModal}
                            onSubmit={handleCreateEvent}
                            submitting={creatingEvent}
                            error={null}
                            locationOptions={locationLinks}
                        />
                    )}
                </>
            )}
        </main>
    );
}
