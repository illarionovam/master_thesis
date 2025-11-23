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
    generateWorkDescription,
} from '../../redux/works/operations';

import {
    selectWork,
    selectGetWorkError,
    selectUpdateWorkError,
    selectDeleteWorkError,
    selectWorkCast,
    selectGetWorkCastError,
    selectWorkPossibleCast,
    selectGetWorkPossibleCastError,
    selectWorkLocationLinks,
    selectGetWorkLocationLinksError,
    selectWorkPossibleLocationLinks,
    selectGetWorkPossibleLocationLinksError,
    selectGetEventsError,
    selectEvents,
    selectGenerateWorkDescriptionError,
    selectGenerateWorkDescriptionResult,
} from '../../redux/works/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import { resetWork } from '../../redux/works/slice';

import styles from './WorkDetailsPage.module.css';

import CreateEventModal from '../../components/CreateEventModal';

export default function WorkDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const work = useSelector(selectWork);
    const error = useSelector(selectGetWorkError);

    const updateError = useSelector(selectUpdateWorkError);
    const deleteError = useSelector(selectDeleteWorkError);

    const cast = useSelector(selectWorkCast);
    const castError = useSelector(selectGetWorkCastError);

    const possibleCast = useSelector(selectWorkPossibleCast);
    const possibleCastError = useSelector(selectGetWorkPossibleCastError);

    const locationLinks = useSelector(selectWorkLocationLinks);
    const locLinksError = useSelector(selectGetWorkLocationLinksError);

    const possibleLocLinks = useSelector(selectWorkPossibleLocationLinks);
    const possibleLocLinksError = useSelector(selectGetWorkPossibleLocationLinksError);

    const events = useSelector(selectEvents);
    const eventsError = useSelector(selectGetEventsError);

    const genError = useSelector(selectGenerateWorkDescriptionError);
    const genResult = useSelector(selectGenerateWorkDescriptionResult);

    const [editMode, setEditMode] = useState(false);

    const [castAddOpen, setCastAddOpen] = useState(false);
    const [selectedCharacterId, setSelectedCharacterId] = useState('');

    const [locAddOpen, setLocAddOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState('');

    const [eventModalOpen, setEventModalOpen] = useState(false);

    const [reorderMode, setReorderMode] = useState(false);
    const [localEvents, setLocalEvents] = useState([]);

    const [genModalOpen, setGenModalOpen] = useState(false);

    const formRef = useRef(null);
    const dragIndexRef = useRef(null);
    const addCastRef = useRef(null);
    const addLocRef = useRef(null);
    const genDialogRef = useRef(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        if (work != null) {
            if (work.id === id) {
                return;
            } else {
                dispatch(resetWork());
            }
        }
        dispatch(getWork(id));
        dispatch(getWorkCast(id));
        dispatch(getWorkPossibleCast(id));
        dispatch(getWorkLocationLinks(id));
        dispatch(getWorkPossibleLocationLinks(id));
        dispatch(getEvents(id));
    }, [dispatch, id, work]);

    useEffect(() => {
        const dlg = addCastRef.current;
        if (!dlg) return;

        if (castAddOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [castAddOpen]);

    useEffect(() => {
        const dlg = genDialogRef.current;
        if (!dlg) return;

        if (genModalOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [genModalOpen]);

    useEffect(() => {
        const dlg = addLocRef.current;
        if (!dlg) return;

        if (locAddOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [locAddOpen]);

    useEffect(() => {
        if (!reorderMode) setLocalEvents(events);
    }, [events, reorderMode]);

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
        setCastAddOpen(false);
        setSelectedCharacterId('');
    };

    const openLocAdd = () => {
        setSelectedLocationId('');
        setLocAddOpen(true);
    };
    const closeLocAdd = () => {
        setLocAddOpen(false);
        setSelectedLocationId('');
    };

    const handleAddCast = async () => {
        closeCastAdd();
        dispatch(linkWorkCharacter({ workId: id, data: { character_id: selectedCharacterId }, from: 'work' }));
    };

    const handleRemoveCast = async (workId, characterInWorkId) => {
        dispatch(deleteCharacterInWork({ workId, characterInWorkId, from: 'work' }));
    };

    const handleAddLocation = async () => {
        closeLocAdd();
        dispatch(linkWorkLocation({ workId: id, data: { location_id: selectedLocationId }, from: 'work' }));
    };

    const handleRemoveLocation = async (workId, locationInWorkId) => {
        dispatch(deleteLocationInWork({ workId, locationInWorkId, from: 'work' }));
    };

    const openEventModal = () => setEventModalOpen(true);
    const closeEventModal = () => {
        setEventModalOpen(false);
    };

    const handleCreateEvent = async payload => {
        if (!id) return;
        setEventModalOpen(false);
        dispatch(createEvent({ workId: id, data: payload }));
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

        const payload = {
            data: localEvents.map((ev, idx) => ({
                id: ev.id,
                order_in_work: idx + 1,
            })),
        };

        dispatch(
            reorderEvents({
                workId: id,
                data: payload,
            })
        );

        setReorderMode(false);
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

    const handleOpenGenerateModal = async () => {
        if (!id) return;
        setGenModalOpen(true);
        await dispatch(generateWorkDescription(id));
    };

    const handleCloseGenerateModal = () => {
        setGenModalOpen(false);
    };

    const handleCopyGenerated = async () => {
        const text = genResult?.result;
        if (!text) return;
        await navigator.clipboard.writeText(text);
    };

    return (
        <main aria-labelledby={titleId} className="page">
            {error && (
                <p role="alert" className={styles.error}>
                    {String(error)}
                </p>
            )}

            {!globalLoading && !error && work && (
                <>
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
                                    disabled={!editMode || globalLoading}
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
                                    disabled={!editMode || globalLoading}
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
                                    disabled={!editMode || globalLoading}
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
                                            className="primaryBtn"
                                            onClick={handleOpenGenerateModal}
                                            disabled={globalLoading || events.length === 0}
                                            aria-label="Generate description from events"
                                            title="Generate description from events"
                                        >
                                            <svg className="icon" aria-hidden="true" focusable="false">
                                                <use href="/icons.svg#wand" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="primaryBtn"
                                            onClick={handleEdit}
                                            disabled={globalLoading}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="dangerBtn"
                                            onClick={handleDelete}
                                            disabled={globalLoading}
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="primaryBtn"
                                            onClick={handleSave}
                                            disabled={globalLoading}
                                        >
                                            Save
                                        </button>
                                        <button type="button" onClick={handleCancel} disabled={globalLoading}>
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
                                className="primaryBtn"
                                onClick={openCastAdd}
                                disabled={globalLoading}
                                aria-label="Add character"
                                title="Add character"
                            >
                                Add character
                            </button>
                        </div>

                        {castError && (
                            <p role="alert" className={styles.error}>
                                {String(castError)}
                            </p>
                        )}

                        {!castError && (
                            <>
                                {cast.length > 0 ? (
                                    <List
                                        items={cast}
                                        onRemove={({ id: characterInWorkId, work_id: workId }) => {
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
                                className="primaryBtn"
                                onClick={openLocAdd}
                                disabled={globalLoading}
                                aria-label="Add location"
                                title="Add location"
                            >
                                Add location
                            </button>
                        </div>

                        {locLinksError && (
                            <p role="alert" className={styles.error}>
                                {String(locLinksError)}
                            </p>
                        )}

                        {!locLinksError && (
                            <>
                                {locationLinks.length > 0 ? (
                                    <List
                                        items={locationLinks}
                                        onRemove={({ id: locationInWorkId, work_id: workId }) => {
                                            handleRemoveLocation(workId, locationInWorkId);
                                        }}
                                    />
                                ) : (
                                    <p className={styles.muted}>No locations linked yet.</p>
                                )}
                            </>
                        )}
                    </section>

                    <button
                        type="button"
                        className={`roundBtn ${styles.fab}`}
                        onClick={() => navigate('dashboard')}
                        aria-label={'Open work dashboard'}
                        title={'Open work dashboard'}
                    >
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="/icons.svg#chart" />
                        </svg>
                    </button>

                    <section className={styles.card} aria-label="Events">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Events</h2>
                            {!reorderMode ? (
                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={openEventModal}
                                        disabled={globalLoading}
                                        aria-label="Add event"
                                        title="Add event"
                                    >
                                        Add event
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStartReorder}
                                        disabled={globalLoading || events.length === 0}
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
                                        className="primaryBtn"
                                        onClick={handleSaveReorder}
                                        disabled={globalLoading}
                                        aria-label="Save order"
                                        title="Save order"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelReorder}
                                        disabled={globalLoading}
                                        aria-label="Cancel reorder"
                                        title="Cancel reorder"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {eventsError && (
                            <p role="alert" className={styles.error}>
                                {String(eventsError)}
                            </p>
                        )}

                        {!eventsError &&
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
                </>
            )}

            {eventModalOpen && (
                <CreateEventModal
                    open={eventModalOpen}
                    onClose={closeEventModal}
                    onSubmit={handleCreateEvent}
                    submitting={globalLoading}
                    error={null}
                    locationOptions={locationLinks}
                />
            )}

            {genModalOpen && (
                <dialog
                    ref={genDialogRef}
                    aria-labelledby="generate-description-title"
                    onClose={handleCloseGenerateModal}
                >
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="generate-description-title" className={styles.modalTitle}>
                            Generated description
                        </h3>

                        {genError && (
                            <p className={styles.error} role="alert">
                                {String(genError)}
                            </p>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="generated-description" className={styles.label}>
                                Text
                            </label>
                            <textarea
                                id="generated-description"
                                className={`${styles.input} ${styles.textarea}`}
                                rows={10}
                                readOnly
                                value={genResult?.result ?? 'Generating...'}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={handleCopyGenerated}
                                disabled={!genResult?.result}
                            >
                                Copy
                            </button>
                            <button type="button" onClick={handleCloseGenerateModal} disabled={globalLoading}>
                                Close
                            </button>
                        </div>
                    </form>
                </dialog>
            )}

            {castAddOpen && (
                <dialog ref={addCastRef} aria-labelledby="add-cast-title" onClose={closeCastAdd}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-cast-title" className={styles.modalTitle}>
                            Add character
                        </h3>

                        {possibleCastError && (
                            <p className={styles.error} role="alert">
                                {String(possibleCastError)}
                            </p>
                        )}

                        {!possibleCastError && (
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
                                className="primaryBtn"
                                onClick={handleAddCast}
                                disabled={globalLoading || !selectedCharacterId}
                            >
                                Add
                            </button>
                            <button type="button" onClick={closeCastAdd} disabled={globalLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            )}

            {locAddOpen && (
                <dialog ref={addLocRef} aria-labelledby="add-loc-title" onClose={closeLocAdd}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-loc-title" className={styles.modalTitle}>
                            Add location
                        </h3>

                        {possibleLocLinksError && (
                            <p className={styles.error} role="alert">
                                {String(possibleLocLinksError)}
                            </p>
                        )}

                        {!possibleLocLinksError && (
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
                                className="primaryBtn"
                                onClick={handleAddLocation}
                                disabled={globalLoading || !selectedLocationId}
                            >
                                Add
                            </button>
                            <button type="button" onClick={closeLocAdd} disabled={globalLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            )}
        </main>
    );
}
