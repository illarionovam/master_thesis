import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';
import styles from './CharacterInWorkDetailsPage.module.css';

import { getCharacterInWork, updateCharacterInWork, getEventsByCharacterInWorkId } from '../../redux/works/operations';

import {
    selectCharacterInWork,
    selectGetCharacterInWorkLoading,
    selectGetCharacterInWorkError,
    selectUpdateCharacterInWorkLoading,
    selectUpdateCharacterInWorkError,
    selectGetEventsByCharacterInWorkIdLoading,
    selectGetEventsByCharacterInWorkIdError,
    selectGetEventsByCharacterInWorkId,
} from '../../redux/works/selectors';

export default function CharacterInWorkDetailsPage() {
    const { id, characterInWorkId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();

    const characterInWork = useSelector(selectCharacterInWork);
    const loading = useSelector(selectGetCharacterInWorkLoading);
    const error = useSelector(selectGetCharacterInWorkError);
    const updateLoading = useSelector(selectUpdateCharacterInWorkLoading);
    const updateError = useSelector(selectUpdateCharacterInWorkError);

    const eventsLoading = useSelector(selectGetEventsByCharacterInWorkIdLoading);
    const eventsError = useSelector(selectGetEventsByCharacterInWorkIdError);
    const events = useSelector(selectGetEventsByCharacterInWorkId) || [];

    const [editMode, setEditMode] = useState(false);
    const [currentAttrs, setCurrentAttrs] = useState({});
    const [initialAttrs, setInitialAttrs] = useState({});
    const [addTagOpen, setAddTagOpen] = useState(false);

    const formRef = useRef(null);

    useEffect(() => {
        if (!characterInWorkId) return;
        dispatch(getCharacterInWork({ workId: id, characterInWorkId }));
        dispatch(getEventsByCharacterInWorkId({ workId: id, characterInWorkId }));
    }, [dispatch, id, characterInWorkId]);

    useEffect(() => {
        if (characterInWork?.attributes && typeof characterInWork.attributes === 'object') {
            setInitialAttrs(characterInWork.attributes || {});
            setCurrentAttrs(characterInWork.attributes || {});
        }
    }, [characterInWork]);

    const workTitle = characterInWork?.work?.title || '—';
    const workId = characterInWork?.work_id;
    const characterName = characterInWork?.character?.name ?? '—';

    const disableAll = loading || updateLoading;

    const removeAttr = key => {
        setCurrentAttrs(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        setCurrentAttrs(initialAttrs || {});
    };

    const handleSave = async () => {
        if (!id || !characterInWorkId) return;
        const data = { attributes: currentAttrs };
        const action = await dispatch(updateCharacterInWork({ workId: id, characterInWorkId, data }));
        if (updateCharacterInWork.fulfilled.match(action)) setEditMode(false);
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
                            <Link to={`/character-in-work/${characterInWorkId}`} className={styles.crumbLink}>
                                {characterName}
                            </Link>
                        </li>
                    </ol>
                </nav>

                <Title id={titleId}>{characterName}</Title>
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

            {!loading && !error && characterInWork && (
                <>
                    <section className={styles.card} aria-label="Character in work">
                        <form ref={formRef} className={styles.form} onSubmit={e => e.preventDefault()} noValidate>
                            <div className={styles.field}>
                                <label className={styles.label}>Character Name</label>
                                <input type="text" className={styles.input} value={characterName} disabled readOnly />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Work Title</label>
                                <input type="text" className={styles.input} value={workTitle} disabled readOnly />
                            </div>

                            <div className={styles.field}>
                                <span className={styles.label}>Current Tags</span>
                                <div className={styles.chips}>
                                    {Object.keys(currentAttrs).length === 0 && (
                                        <span className={styles.muted}>No tags yet.</span>
                                    )}

                                    {Object.entries(currentAttrs).map(([k, v]) => (
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
                                <p role="alert" className={styles.error}>
                                    {String(updateError)}
                                </p>
                            )}

                            <div className={styles.actions}>
                                {!editMode ? (
                                    <button
                                        type="button"
                                        className={styles.primaryBtn}
                                        onClick={handleEdit}
                                        disabled={disableAll}
                                    >
                                        Edit
                                    </button>
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

                    <section className={styles.card} aria-label="Character events">
                        <h2 className={styles.subTitle}>Used in events</h2>

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
                                <List items={events} />
                            ) : (
                                <p className={styles.muted}>No events yet.</p>
                            ))}
                    </section>

                    {addTagOpen && (
                        <dialog
                            open
                            className={styles.dialog}
                            aria-labelledby="add-tag-title"
                            onClose={() => setAddTagOpen(false)}
                        >
                            <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                                <h3 id="add-tag-title" className={styles.modalTitle}>
                                    Add tag
                                </h3>
                                <AddTagFields
                                    onAdd={(k, v) => {
                                        if (!k) return;
                                        setCurrentAttrs(prev => ({ ...prev, [k]: v }));
                                        setAddTagOpen(false);
                                    }}
                                    onCancel={() => setAddTagOpen(false)}
                                />
                            </form>
                        </dialog>
                    )}
                </>
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
            <div className={styles.field}>
                <label className={styles.label}>
                    Key
                    <input
                        className={styles.input}
                        type="text"
                        value={keyStr}
                        onChange={e => setKeyStr(e.target.value)}
                        placeholder="e.g. scene"
                        required
                    />
                </label>
            </div>
            <div className={styles.field}>
                <label className={styles.label}>
                    Value
                    <input
                        className={styles.input}
                        type="text"
                        value={valStr}
                        onChange={e => setValStr(e.target.value)}
                        placeholder="e.g. intro"
                    />
                </label>
            </div>

            {err && (
                <p className={styles.error} role="alert">
                    {err}
                </p>
            )}

            <div className={styles.modalActions}>
                <button type="button" className={styles.primaryBtn} onClick={save}>
                    Save
                </button>
                <button type="button" className={styles.ghostBtn} onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </>
    );
}
