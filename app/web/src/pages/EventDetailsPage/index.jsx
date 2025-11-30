import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

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
    generateEventCheck,
} from '../../redux/works/operations';

import {
    selectEvent,
    selectGetEventError,
    selectUpdateEventError,
    selectDeleteEventError,
    selectEventParticipants,
    selectGetEventParticipantsError,
    selectEventPossibleParticipants,
    selectGetEventPossibleParticipantsError,
    selectWorkLocationLinks,
    selectGetWorkLocationLinksError,
    selectGenerateEventCheckError,
    selectGenerateEventCheckResult,
} from '../../redux/works/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import styles from './EventDetailsPage.module.css';

export default function EventDetailsPage() {
    const { id, eventId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const event = useSelector(selectEvent);
    const participants = useSelector(selectEventParticipants);
    const possibleParticipants = useSelector(selectEventPossibleParticipants);
    const locationLinks = useSelector(selectWorkLocationLinks);

    const genResult = useSelector(selectGenerateEventCheckResult);

    const error = useSelector(selectGetEventError);
    const participantsError = useSelector(selectGetEventParticipantsError);
    const possibleParticipantsError = useSelector(selectGetEventPossibleParticipantsError);
    const locLinksError = useSelector(selectGetWorkLocationLinksError);

    const updateError = useSelector(selectUpdateEventError);
    const deleteError = useSelector(selectDeleteEventError);
    const genError = useSelector(selectGenerateEventCheckError);

    const globalError = error ?? participantsError ?? possibleParticipantsError ?? locLinksError;

    const [editMode, setEditMode] = useState(false);

    const [addCastOpen, setAddCastOpen] = useState(false);
    const [selectedCharacterId, setSelectedCharacterId] = useState('');

    const [genModalOpen, setGenModalOpen] = useState(false);

    const formRef = useRef(null);
    const addCastRef = useRef(null);
    const genDialogRef = useRef(null);

    useEffect(() => {
        if (!id || !eventId) {
            return;
        }

        if (event && event.id === eventId) {
            return;
        }

        dispatch(getEvent({ workId: id, eventId }));
        dispatch(getEventParticipants({ workId: id, eventId }));
        dispatch(getWorkLocationLinks(id));
        dispatch(getEventPossibleParticipants({ workId: id, eventId }));
    }, [dispatch, id, eventId]);

    useEffect(() => {
        const dlg = addCastRef.current;
        if (!dlg) return;

        if (addCastOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addCastOpen]);

    useEffect(() => {
        const dlg = genDialogRef.current;
        if (!dlg) return;

        if (genModalOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [genModalOpen]);

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (!formRef.current || !event) return;
        formRef.current.title.value = event.title ?? '';
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

        const title = (fd.get('title') || '').toString().trim();
        const description = (fd.get('description') || '').toString().trim();
        const locRaw = (fd.get('location_in_work_id') || '').toString().trim();

        if (!title || title.length > 100 || !description) return;

        const data = {
            title,
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
        setAddCastOpen(false);
        setSelectedCharacterId('');
    };

    const handleAddCast = async () => {
        closeAddCast();
        dispatch(linkEventParticipant({ workId: id, eventId, data: { character_in_work_id: selectedCharacterId } }));
    };

    const handleRemoveCast = async (_workId, participantId) => {
        dispatch(unlinkEventParticipant({ workId: id, eventId, eventParticipantId: participantId }));
    };

    const handleOpenGenerateModal = async () => {
        if (!id || !eventId) return;
        setGenModalOpen(true);
        await dispatch(generateEventCheck({ workId: id, eventId }));
    };

    const handleCloseGenerateModal = () => {
        setGenModalOpen(false);
    };

    const workTitle = event?.work?.title ?? '—';
    const pageTitle = event?.title || '—';

    const defaultLocationInWorkId = event?.location_in_work_id;

    return (
        <main aria-labelledby={titleId} className="page">
            {globalError && (
                <p role="alert" className="infoMessage error">
                    {globalError}
                </p>
            )}

            {!globalLoading && !globalError && event && participants && possibleParticipants && locationLinks && (
                <>
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

                        <h2 id={titleId}>{pageTitle}</h2>
                    </div>
                    <section className="card" aria-label="Event info">
                        <form ref={formRef} onSubmit={e => e.preventDefault()} noValidate>
                            <div className="field">
                                <label htmlFor="ev-title" className="label">
                                    Title
                                </label>
                                <input
                                    id="ev-title"
                                    name="title"
                                    type="text"
                                    defaultValue={event.title ?? ''}
                                    className="input"
                                    disabled={!editMode || globalLoading}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ev-desc" className="label">
                                    Description
                                </label>
                                <textarea
                                    id="ev-desc"
                                    name="description"
                                    rows={6}
                                    defaultValue={event.description ?? ''}
                                    className="input textarea"
                                    disabled={!editMode || globalLoading}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ev-location" className="label">
                                    Location
                                </label>
                                <select
                                    id="ev-location"
                                    name="location_in_work_id"
                                    defaultValue={defaultLocationInWorkId}
                                    className="input"
                                    disabled={!editMode || globalLoading}
                                >
                                    <option value="">— None —</option>
                                    {locationLinks.map(opt => (
                                        <option key={String(opt.id)} value={String(opt.id)}>
                                            {opt.content ?? opt.title ?? `#${opt.id}`}
                                        </option>
                                    ))}
                                </select>
                                {locLinksError && (
                                    <p className="infoMessage error" role="alert">
                                        {String(locLinksError)}
                                    </p>
                                )}
                            </div>

                            {updateError && (
                                <p role="alert" className="infoMessage error">
                                    {String(updateError)}
                                </p>
                            )}
                            {deleteError && (
                                <p role="alert" className="infoMessage error">
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
                                            disabled={globalLoading}
                                            aria-label="Generate event's fact check"
                                            title="Generate event's fact check"
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

                    <section className="card" aria-label="Cast">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Cast</h2>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={openAddCast}
                                disabled={globalLoading}
                                aria-label="Add participant"
                                title="Add participant"
                            >
                                Add participant
                            </button>
                        </div>

                        {participants.length > 0 ? (
                            <List
                                items={participants}
                                onRemove={({ id: participantId, work_id: workIdProp }) => {
                                    handleRemoveCast(workIdProp || id, participantId);
                                }}
                            />
                        ) : (
                            <p className={styles.muted}>No participants yet.</p>
                        )}
                    </section>
                </>
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

                        <div className="field">
                            <textarea
                                id="generated-description"
                                className="input textarea"
                                rows={10}
                                readOnly
                                value={genResult?.result ?? 'Generating...'}
                            />
                        </div>

                        {genError && (
                            <p className="infoMessage error" role="alert">
                                {String(genError)}
                            </p>
                        )}

                        <div className={styles.modalActions}>
                            <button type="button" onClick={handleCloseGenerateModal} disabled={globalLoading}>
                                Close
                            </button>
                        </div>
                    </form>
                </dialog>
            )}

            {addCastOpen && (
                <dialog ref={addCastRef} aria-labelledby="add-cast-title" onClose={closeAddCast}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-cast-title" className={styles.modalTitle}>
                            Add participant
                        </h3>

                        {possibleParticipants.length === 0 ? (
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
                            <button type="button" onClick={closeAddCast} disabled={globalLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            )}
        </main>
    );
}
