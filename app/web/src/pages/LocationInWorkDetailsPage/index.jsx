import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';
import styles from './LocationInWorkDetailsPage.module.css';

import { getLocationInWork, updateLocationInWork, getEventsByLocationInWorkId } from '../../redux/works/operations';

import {
    selectLocationInWork,
    selectGetLocationInWorkError,
    selectUpdateLocationInWorkError,
    selectGetEventsByLocationInWorkIdError,
    selectGetEventsByLocationInWorkId,
} from '../../redux/works/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function LocationInWorkDetailsPage() {
    const { id, locationInWorkId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

    const liw = useSelector(selectLocationInWork);
    const events = useSelector(selectGetEventsByLocationInWorkId);

    const error = useSelector(selectGetLocationInWorkError);
    const eventsError = useSelector(selectGetEventsByLocationInWorkIdError);

    const updateError = useSelector(selectUpdateLocationInWorkError);

    const globalError = error ?? eventsError;

    const [editMode, setEditMode] = useState(false);
    const [attrs, setAttrs] = useState({});
    const [addTagOpen, setAddTagOpen] = useState(false);

    const formRef = useRef(null);
    const addTagRef = useRef(null);

    useEffect(() => {
        if (!id || !locationInWorkId) {
            return;
        }
        if (liw && liw.id === locationInWorkId) {
            return;
        }
        dispatch(getLocationInWork({ workId: id, locationInWorkId }));
        dispatch(getEventsByLocationInWorkId({ workId: id, locationInWorkId }));
    }, [dispatch, id, locationInWorkId]);

    useEffect(() => {
        if (liw?.attributes && typeof liw.attributes === 'object') {
            setAttrs(liw.attributes || {});
        } else {
            setAttrs({});
        }
    }, [liw]);

    useEffect(() => {
        const dlg = addTagRef.current;
        if (!dlg) return;

        if (addTagOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addTagOpen]);

    const workTitle = liw?.work?.title || '—';
    const workId = liw?.work_id;
    const location = liw?.location;
    const parentTitle = liw?.location?.title ?? null;

    const removeAttr = key => {
        setAttrs(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        setAttrs(liw?.attributes || {});
    };

    const handleSave = async () => {
        if (!id || !locationInWorkId) return;
        const data = { attributes: attrs };
        const action = await dispatch(updateLocationInWork({ workId: id, locationInWorkId, data }));
        if (updateLocationInWork.fulfilled.match(action)) setEditMode(false);
    };

    return (
        <main aria-labelledby={titleId} className="page">
            {globalError && (
                <p role="alert" className="infoMessage error">
                    {globalError}
                </p>
            )}

            {!globalLoading && !globalError && liw && events && (
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
                                    {workId ? (
                                        <Link to={`/works/${workId}`} className={styles.crumbLink}>
                                            {workTitle}
                                        </Link>
                                    ) : (
                                        <span className={styles.crumbLink}>{workTitle}</span>
                                    )}
                                </li>
                                <li aria-current="page">
                                    <Link
                                        to={`/works/${workId}/location-links/${locationInWorkId}`}
                                        className={styles.crumbLink}
                                    >
                                        {location?.title ?? '—'}
                                    </Link>
                                </li>
                            </ol>
                        </nav>

                        <Title id={titleId}>{location?.title ?? '—'}</Title>
                    </div>

                    <section className="card" aria-label="Location in work">
                        <form ref={formRef} onSubmit={e => e.preventDefault()} noValidate>
                            <div className="field">
                                <label className="label">Title</label>
                                <input type="text" className="input" value={location?.title ?? ''} disabled readOnly />
                            </div>

                            <div className="field">
                                <label className="label">Description</label>
                                <textarea
                                    rows={5}
                                    className={`input ${styles.textarea}`}
                                    value={location?.description ?? ''}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="field">
                                <label className="label">Parent Location</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={parentTitle ?? '— None —'}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="field">
                                <span className="label">Tags</span>
                                <div className={styles.chips}>
                                    {Object.keys(attrs).length === 0 && (
                                        <span className={styles.muted}>No tags yet.</span>
                                    )}

                                    {Object.entries(attrs).map(([k, v]) => (
                                        <span key={k} className={styles.chip} aria-label={`${k}: ${String(v)}`}>
                                            <strong className={styles.chipKey}>{k}</strong>
                                            <span className={styles.chipSep}>:</span>
                                            <span className={styles.chipVal}>{String(v)}</span>

                                            {editMode && (
                                                <button
                                                    type="button"
                                                    className={styles.chipRemove}
                                                    onClick={() => removeAttr(k)}
                                                    aria-label={`Remove tag ${k}`}
                                                    title="Remove"
                                                >
                                                    x
                                                </button>
                                            )}
                                        </span>
                                    ))}

                                    {editMode && (
                                        <button
                                            type="button"
                                            className={styles.addChipBtn}
                                            onClick={() => setAddTagOpen(true)}
                                            aria-label="Add tag"
                                            title="Add tag"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>

                            {updateError && (
                                <p role="alert" className="infoMessage error">
                                    {String(updateError)}
                                </p>
                            )}

                            <div className={styles.actions}>
                                {!editMode ? (
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={handleEdit}
                                        disabled={globalLoading}
                                    >
                                        Edit
                                    </button>
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

                    <section className="card" aria-label="Used in events">
                        <h2 className={styles.subTitle}>Used in events</h2>

                        {events.length > 0 ? <List items={events} /> : <p className={styles.muted}>No events yet.</p>}
                    </section>
                </>
            )}

            {addTagOpen && (
                <dialog ref={addTagRef} aria-labelledby="add-tag-title" onClose={() => setAddTagOpen(false)}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-tag-title" className={styles.modalTitle}>
                            Add tag
                        </h3>
                        <AddTagFields
                            onAdd={(k, v) => {
                                if (!k) return;
                                setAttrs(prev => ({ ...prev, [k]: v }));
                                setAddTagOpen(false);
                            }}
                            onCancel={() => setAddTagOpen(false)}
                        />
                    </form>
                </dialog>
            )}
        </main>
    );
}

function AddTagFields({ onAdd, onCancel }) {
    const [keyStr, setKeyStr] = useState('');
    const [valStr, setValStr] = useState('');
    const [err, setErr] = useState('');

    const save = () => {
        const k = keyStr.trim();
        if (!k) return setErr('Key is required');
        setErr('');
        onAdd?.(k, valStr.trim());
    };

    return (
        <>
            <div className="field">
                <label className="label">
                    Key
                    <input
                        className="input"
                        type="text"
                        value={keyStr}
                        onChange={e => setKeyStr(e.target.value)}
                        placeholder="e.g. scene"
                        required
                    />
                </label>
            </div>
            <div className="field">
                <label className="label">
                    Value
                    <input
                        className="input"
                        type="text"
                        value={valStr}
                        onChange={e => setValStr(e.target.value)}
                        placeholder="e.g. intro"
                    />
                </label>
            </div>

            {err && (
                <p className="infoMessage error" role="alert">
                    {err}
                </p>
            )}

            <div className={styles.modalActions}>
                <button type="button" className="primaryBtn" onClick={save}>
                    Save
                </button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </>
    );
}
