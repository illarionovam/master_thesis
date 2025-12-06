import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import List from '../../components/List';
import ImageSection from '../../components/ImageSection';

import styles from './CharacterInWorkDetailsPage.module.css';

import {
    getCharacterInWork,
    updateCharacterInWork,
    getEventsByCharacterInWorkId,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    createRelationship,
    deleteRelationship,
} from '../../redux/works/operations';
import {
    selectCharacterInWork,
    selectGetCharacterInWorkError,
    selectUpdateCharacterInWorkError,
    selectGetEventsByCharacterInWorkIdError,
    selectGetEventsByCharacterInWorkId,
    selectGetCharacterInWorkRelationshipsError,
    selectCharacterInWorkRelationships,
    selectGetCharacterInWorkPossibleRelationshipsError,
    selectCharacterInWorkPossibleRelationships,
} from '../../redux/works/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function CharacterInWorkDetailsPage() {
    const { id, characterInWorkId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const ciw = useSelector(selectCharacterInWork);
    const events = useSelector(selectGetEventsByCharacterInWorkId);
    const relationships = useSelector(selectCharacterInWorkRelationships);
    const possibleRels = useSelector(selectCharacterInWorkPossibleRelationships);

    const error = useSelector(selectGetCharacterInWorkError);
    const eventsError = useSelector(selectGetEventsByCharacterInWorkIdError);
    const relError = useSelector(selectGetCharacterInWorkRelationshipsError);
    const possibleRelError = useSelector(selectGetCharacterInWorkPossibleRelationshipsError);

    const updateError = useSelector(selectUpdateCharacterInWorkError);

    const globalError = error ?? eventsError ?? relError ?? possibleRelError;

    const [editMode, setEditMode] = useState(false);
    const [currentAttrs, setCurrentAttrs] = useState({});
    const [initialAttrs, setInitialAttrs] = useState({});
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addRelOpen, setAddRelOpen] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState('');
    const [relType, setRelType] = useState('');

    const formRef = useRef(null);
    const addTagRef = useRef(null);
    const addRelRef = useRef(null);

    useEffect(() => {
        if (!id || !characterInWorkId) {
            return;
        }
        if (ciw && ciw.id === characterInWorkId) {
            return;
        }
        dispatch(getCharacterInWork({ workId: id, characterInWorkId }));
        dispatch(getEventsByCharacterInWorkId({ workId: id, characterInWorkId }));
        dispatch(getCharacterInWorkRelationships({ workId: id, characterInWorkId }));
        dispatch(getCharacterInWorkPossibleRelationships({ workId: id, characterInWorkId }));
    }, [dispatch, id, characterInWorkId]);

    useEffect(() => {
        if (ciw?.character?.attributes && typeof ciw.character.attributes === 'object') {
            setInitialAttrs(ciw.character.attributes || {});
        }
        if (ciw && typeof ciw.attributes === 'object') {
            setCurrentAttrs(ciw.attributes || {});
        }
    }, [ciw]);

    useEffect(() => {
        const dlg = addTagRef.current;
        if (!dlg) return;

        if (addTagOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addTagOpen]);

    useEffect(() => {
        const dlg = addRelRef.current;
        if (!dlg) return;

        if (addRelOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addRelOpen]);

    const workTitle = ciw?.work?.title || '—';
    const workId = ciw?.work_id;
    const character = ciw?.character;
    const characterName = character?.name ?? '—';
    const characterAppearance = character?.appearance ?? '—';
    const characterPersonality = character?.personality ?? '—';
    const characterBio = character?.bio ?? '—';

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

    const openAddRelModal = () => {
        setSelectedTargetId('');
        setAddRelOpen(true);
    };
    const closeAddRelModal = () => {
        setAddRelOpen(false);
        setSelectedTargetId('');
        setRelType('');
    };

    const handleAddRelationship = async () => {
        closeAddRelModal();
        dispatch(
            createRelationship({
                workId: id,
                characterInWorkId,
                data: { to_character_in_work_id: selectedTargetId, type: relType.trim() },
            })
        );
    };

    const handleRemoveRelationship = async (workId, relationshipId) => {
        dispatch(deleteRelationship({ workId, characterInWorkId, relationshipId }));
    };

    return (
        <main aria-labelledby={titleId} className="page">
            {globalError && (
                <p role="alert" className="infoMessage error">
                    {globalError}
                </p>
            )}

            {!globalLoading && !globalError && ciw && events && relationships && possibleRels && (
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
                                        to={`/works/${workId}/cast/${characterInWorkId}`}
                                        className={styles.crumbLink}
                                    >
                                        {characterName}
                                    </Link>
                                </li>
                            </ol>
                        </nav>

                        <h2 id={titleId}>{characterName}</h2>
                    </div>

                    <div className={styles.split}>
                        <section className={`card ${styles.imageCard}`} aria-label="Character image">
                            <ImageSection
                                workId={workId}
                                ciwId={characterInWorkId}
                                name={ciw.name}
                                imageUrl={ciw.image_url ?? ciw.character.image_url}
                            />
                        </section>
                        <section className="card" aria-label="Character in work">
                            <form ref={formRef} onSubmit={e => e.preventDefault()} noValidate>
                                <div className="field">
                                    <label className="label">Name</label>
                                    <input type="text" className="input" value={characterName} disabled readOnly />
                                </div>

                                <div className="field">
                                    <label className="label">Appearance</label>
                                    <textarea
                                        rows={5}
                                        className="input textarea"
                                        value={characterAppearance}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="field">
                                    <label className="label">Personality</label>
                                    <textarea
                                        rows={5}
                                        className="input textarea"
                                        value={characterPersonality}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="field">
                                    <label className="label">Bio</label>
                                    <textarea
                                        rows={6}
                                        className="input textarea"
                                        value={characterBio}
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div className="field">
                                    <span className="label">Tags</span>
                                    <div className={styles.chips}>
                                        {Object.keys(initialAttrs).length === 0 && (
                                            <span className={styles.muted}>No tags yet.</span>
                                        )}

                                        {Object.entries(initialAttrs).map(([k, v]) => (
                                            <span key={k} className={styles.chip} aria-label={`${k}: ${String(v)}`}>
                                                <strong className={styles.chipKey}>{k}</strong>
                                                <span className={styles.chipSep}>:</span>
                                                <span className={styles.chipVal}>{String(v)}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="field">
                                    <span className="label">In Work Tags</span>
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
                    </div>

                    <section className="card" aria-label="Events">
                        <h2 className={styles.subTitle}>Events</h2>

                        {events.length > 0 ? <List items={events} /> : <p className={styles.muted}>No events yet.</p>}
                    </section>

                    <button
                        type="button"
                        className={`roundBtn ${styles.fab}`}
                        onClick={() => navigate('dashboard')}
                        aria-label={'Open per-character dashboard'}
                        title={'Open per-character dashboard'}
                    >
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="/icons.svg#chart" />
                        </svg>
                    </button>

                    <section className="card" aria-label="Relationships">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Relationships</h2>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={openAddRelModal}
                                disabled={globalLoading}
                                aria-label="Add relationship"
                                title="Add relationship"
                            >
                                Add relationship
                            </button>
                        </div>

                        {relationships.length > 0 ? (
                            <List
                                items={relationships}
                                onRemove={({ id: relationshipId, work_id: workId }) => {
                                    handleRemoveRelationship(workId, relationshipId);
                                }}
                            />
                        ) : (
                            <p className={styles.muted}>No relationships yet.</p>
                        )}
                    </section>
                </>
            )}

            {addRelOpen && (
                <dialog ref={addRelRef} aria-labelledby="add-rel-title" onClose={closeAddRelModal}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-rel-title" className={styles.modalTitle}>
                            Add relationship
                        </h3>

                        {possibleRels.length === 0 ? (
                            <p className={styles.muted}>No available characters to relate.</p>
                        ) : (
                            <ul className={styles.radioList}>
                                {possibleRels.map(t => (
                                    <li key={t.id}>
                                        <label className={styles.radioRow}>
                                            <input
                                                type="radio"
                                                name="rel-target"
                                                value={t.id}
                                                checked={String(selectedTargetId) === String(t.id)}
                                                onChange={e => setSelectedTargetId(e.target.value)}
                                            />
                                            <span>{t.content}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="field">
                            <label className="label">Type *</label>
                            <input
                                className="input"
                                type="text"
                                value={relType}
                                onChange={e => setRelType(e.target.value)}
                                placeholder="Type"
                                required
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={handleAddRelationship}
                                disabled={globalLoading || !selectedTargetId}
                            >
                                Add
                            </button>
                            <button type="button" onClick={closeAddRelModal} disabled={globalLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
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
                                setCurrentAttrs(prev => ({ ...prev, [k]: v }));
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
