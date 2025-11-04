import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';

import {
    getEvent,
    updateEvent,
    deleteEvent,
    getEventParticipants,
    getEventPossibleParticipants,
    linkEventParticipant,
    unlinkEventParticipant,
    getWorkLocationLinks,
} from '../../redux/works/operations';

import {
    selectEvent,
    selectGetEventLoading,
    selectGetEventError,
    selectUpdateEventLoading,
    selectUpdateEventError,
    selectDeleteEventLoading,
    selectDeleteEventError,
    selectEventParticipants,
    selectGetEventParticipantsLoading,
    selectGetEventParticipantsError,
    selectEventPossibleParticipants,
    selectGetEventPossibleParticipantsLoading,
    selectGetEventPossibleParticipantsError,
    selectWorkLocationLinks,
    selectGetWorkLocationLinksLoading,
    selectGetWorkLocationLinksError,
} from '../../redux/works/selectors';

import styles from './EventDetailsPage.module.css';

export default function EventDetailsPage() {
    const { id, eventId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const event = useSelector(selectEvent);
    const loading = useSelector(selectGetEventLoading);
    const error = useSelector(selectGetEventError);

    const updateLoading = useSelector(selectUpdateEventLoading);
    const updateError = useSelector(selectUpdateEventError);
    const deleteLoading = useSelector(selectDeleteEventLoading);
    const deleteError = useSelector(selectDeleteEventError);

    const participants = useSelector(selectEventParticipants) || [];
    const participantsLoading = useSelector(selectGetEventParticipantsLoading);
    const participantsError = useSelector(selectGetEventParticipantsError);

    const possibleParticipants = useSelector(selectEventPossibleParticipants) || [];
    const possibleParticipantsLoading = useSelector(selectGetEventPossibleParticipantsLoading);
    const possibleParticipantsError = useSelector(selectGetEventPossibleParticipantsError);

    const locationLinks = useSelector(selectWorkLocationLinks) || [];
    const locLinksLoading = useSelector(selectGetWorkLocationLinksLoading);
    const locLinksError = useSelector(selectGetWorkLocationLinksError);

    const [editMode, setEditMode] = useState(false);
    const formRef = useRef(null);

    const [addCastOpen, setAddCastOpen] = useState(false);
    const [selectedCharacterId, setSelectedCharacterId] = useState('');
    const [addingCast, setAddingCast] = useState(false);
    const [removingCastId, setRemovingCastId] = useState(null);

    useEffect(() => {
        if (!id || !eventId) return;
        dispatch(getEvent({ workId: id, eventId }));
        dispatch(getEventParticipants({ workId: id, eventId }));
        // ↓ підтягнемо лінки локацій для селекта
        dispatch(getWorkLocationLinks(id));
    }, [dispatch, id, eventId]);

    useEffect(() => {
        if (addCastOpen && id && eventId) {
            dispatch(getEventPossibleParticipants({ workId: id, eventId }));
        }
    }, [addCastOpen, dispatch, id, eventId]);

    const disableAll = loading || updateLoading || deleteLoading;

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (!formRef.current || !event) return;
        formRef.current.description.value = event.description ?? '';

        if (formRef.current.location_in_work_id) {
            const currentId = event.location_in_work?.id
                ? String(event.location_in_work.id)
                : event.location_in_work_id
                ? String(event.location_in_work_id)
                : '';
            formRef.current.location_in_work_id.value = currentId;
        }
    };

    const handleSave = async () => {
        if (!formRef.current || !id || !eventId) return;
        const fd = new FormData(formRef.current);
        const description = (fd.get('description') || '').toString().trim();
        const locRaw = (fd.get('location_in_work_id') || '').toString().trim();

        if (!description) return;

        const data = {
            description,
            location_in_work_id: locRaw ? locRaw : null,
        };

        const action = await dispatch(updateEvent({ workId: id, eventId, data }));
        if (updateEvent.fulfilled.match(action)) setEditMode(false);
    };

    const handleDelete = async () => {
        if (!id || !eventId) return;
        const ok = window.confirm('Delete this event? This action cannot be undone.');
        if (!ok) return;
        const action = await dispatch(deleteEvent({ workId: id, eventId }));
        if (deleteEvent.fulfilled.match(action)) {
            navigate(`/works/${id}`, { replace: true });
        }
    };

    const openAddCast = () => {
        setSelectedCharacterId('');
        setAddCastOpen(true);
    };
    const closeAddCast = () => {
        if (addingCast) return;
        setAddCastOpen(false);
        setSelectedCharacterId('');
    };

    const handleAddCast = async () => {
        if (!id || !eventId || !selectedCharacterId) return;
        try {
            setAddingCast(true);
            const action = await dispatch(
                linkEventParticipant({ workId: id, eventId, data: { character_in_work_id: selectedCharacterId } })
            );
            if (linkEventParticipant.fulfilled.match(action)) {
                setAddCastOpen(false);
                setSelectedCharacterId('');
                dispatch(getEventParticipants({ workId: id, eventId }));
            }
        } finally {
            setAddingCast(false);
        }
    };

    const handleRemoveCast = async (_workId, participantId) => {
        if (!id || !eventId) return;
        try {
            setRemovingCastId(participantId);
            const action = await dispatch(
                unlinkEventParticipant({ workId: id, eventId, eventParticipantId: participantId })
            );
            if (unlinkEventParticipant.fulfilled.match(action)) {
                dispatch(getEventParticipants({ workId: id, eventId }));
            }
        } finally {
            setRemovingCastId(null);
        }
    };

    const workTitle = event?.work?.title ?? '—';
    const pageTitle = event?.description || '—';

    const defaultLocationInWorkId = event?.location_in_work_id;

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
                        <li>
                            {id ? (
                                <Link to={`/works/${id}`} className={styles.crumbLink}>
                                    {workTitle}
                                </Link>
                            ) : (
                                <span className={styles.crumbLink}>{workTitle}</span>
                            )}
                        </li>
                        <li aria-current="page">
                            <Link to={`/works/${id}/events/${eventId}`} className={styles.crumbLink}>
                                {pageTitle}
                            </Link>
                        </li>
                    </ol>
                </nav>

                <Title id={titleId}>{pageTitle}</Title>
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

            {!loading && !error && event && (
                <>
                    <section className={styles.card} aria-label="Event info">
                        <form ref={formRef} className={styles.form} onSubmit={e => e.preventDefault()} noValidate>
                            <div className={styles.field}>
                                <label htmlFor="ev-desc" className={styles.label}>
                                    Description
                                </label>
                                <textarea
                                    id="ev-desc"
                                    name="description"
                                    rows={6}
                                    defaultValue={event.description ?? ''}
                                    className={`${styles.input} ${styles.textarea}`}
                                    disabled={!editMode || disableAll}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="ev-location" className={styles.label}>
                                    Location (in this work)
                                </label>
                                <select
                                    id="ev-location"
                                    name="location_in_work_id"
                                    defaultValue={defaultLocationInWorkId}
                                    className={styles.input}
                                    disabled={!editMode || disableAll || locLinksLoading}
                                >
                                    <option value="">— None —</option>
                                    {locationLinks.map(opt => (
                                        <option key={String(opt.id)} value={String(opt.id)}>
                                            {opt.content ?? opt.title ?? `#${opt.id}`}
                                        </option>
                                    ))}
                                </select>
                                {locLinksLoading && (
                                    <p className={styles.muted} aria-live="polite">
                                        Loading locations...
                                    </p>
                                )}
                                {!locLinksLoading && locLinksError && (
                                    <p className={styles.error} role="alert">
                                        {String(locLinksError)}
                                    </p>
                                )}
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
                                onClick={openAddCast}
                                disabled={participantsLoading}
                                aria-label="Add participant"
                                title="Add participant"
                            >
                                Add participant
                            </button>
                        </div>

                        {participantsLoading && (
                            <p aria-live="polite" className={styles.muted}>
                                Loading...
                            </p>
                        )}
                        {!participantsLoading && participantsError && (
                            <p role="alert" className={styles.error}>
                                {String(participantsError)}
                            </p>
                        )}

                        {!participantsLoading &&
                            !participantsError &&
                            (participants.length > 0 ? (
                                <List
                                    items={participants}
                                    onRemove={({ id: participantId, work_id: workIdProp }) => {
                                        if (removingCastId) return;
                                        handleRemoveCast(workIdProp || id, participantId);
                                    }}
                                />
                            ) : (
                                <p className={styles.muted}>No participants yet.</p>
                            ))}
                    </section>

                    {addCastOpen && (
                        <dialog open className={styles.dialog} aria-labelledby="add-cast-title" onClose={closeAddCast}>
                            <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                                <h3 id="add-cast-title" className={styles.modalTitle}>
                                    Add participant
                                </h3>

                                {possibleParticipantsLoading && (
                                    <p className={styles.muted} aria-live="polite">
                                        Loading characters...
                                    </p>
                                )}
                                {!possibleParticipantsLoading && possibleParticipantsError && (
                                    <p className={styles.error} role="alert">
                                        {String(possibleParticipantsError)}
                                    </p>
                                )}

                                {!possibleParticipantsLoading &&
                                    !possibleParticipantsError &&
                                    (possibleParticipants.length === 0 ? (
                                        <p className={styles.muted}>No available characters to add.</p>
                                    ) : (
                                        <ul className={styles.radioList}>
                                            {possibleParticipants.map(p => (
                                                <li key={p.id}>
                                                    <label className={styles.radioRow}>
                                                        <input
                                                            type="radio"
                                                            name="participant"
                                                            value={p.id}
                                                            checked={String(selectedCharacterId) === String(p.id)}
                                                            onChange={e => setSelectedCharacterId(e.target.value)}
                                                        />
                                                        <span>{p.content}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    ))}

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={handleAddCast}
                                        disabled={addingCast || possibleParticipantsLoading || !selectedCharacterId}
                                    >
                                        {addingCast ? 'Adding...' : 'Add'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={closeAddCast}
                                        disabled={addingCast}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </dialog>
                    )}
                </>
            )}
        </main>
    );
}
