import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { uploadImage } from '../../api/upload';

import Title from '../../components/Title';
import List from '../../components/List';
import styles from './CharacterInWorkDetailsPage.module.css';

import {
    getCharacterInWork,
    updateCharacterInWork,
    getEventsByCharacterInWorkId,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    createRelationship,
    deleteRelationship,
    generateCharacterInWorkImage,
} from '../../redux/works/operations';
import {
    selectCharacterInWork,
    selectGetCharacterInWorkLoading,
    selectGetCharacterInWorkError,
    selectUpdateCharacterInWorkLoading,
    selectUpdateCharacterInWorkError,
    selectGetEventsByCharacterInWorkIdLoading,
    selectGetEventsByCharacterInWorkIdError,
    selectGetEventsByCharacterInWorkId,
    selectGetCharacterInWorkRelationshipsLoading,
    selectGetCharacterInWorkRelationshipsError,
    selectCharacterInWorkRelationships,
    selectGetCharacterInWorkPossibleRelationshipsLoading,
    selectGetCharacterInWorkPossibleRelationshipsError,
    selectCharacterInWorkPossibleRelationships,
    selectGenerateCharacterInWorkImageLoading,
    selectGenerateCharacterInWorkImageError,
} from '../../redux/works/selectors';

import { resetCharacterInWork } from '../../redux/works/slice';

export default function CharacterInWorkDetailsPage() {
    const { id, characterInWorkId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();

    const ciw = useSelector(selectCharacterInWork);
    const loading = useSelector(selectGetCharacterInWorkLoading);
    const error = useSelector(selectGetCharacterInWorkError);

    const updateLoading = useSelector(selectUpdateCharacterInWorkLoading);
    const updateError = useSelector(selectUpdateCharacterInWorkError);

    const eventsLoading = useSelector(selectGetEventsByCharacterInWorkIdLoading);
    const eventsError = useSelector(selectGetEventsByCharacterInWorkIdError);
    const events = useSelector(selectGetEventsByCharacterInWorkId) || [];

    const relLoading = useSelector(selectGetCharacterInWorkRelationshipsLoading);
    const relError = useSelector(selectGetCharacterInWorkRelationshipsError);
    const relationships = useSelector(selectCharacterInWorkRelationships) || [];

    const possibleRelLoading = useSelector(selectGetCharacterInWorkPossibleRelationshipsLoading);
    const possibleRelError = useSelector(selectGetCharacterInWorkPossibleRelationshipsError);
    const possibleRels = useSelector(selectCharacterInWorkPossibleRelationships) || [];

    const generateLoading = useSelector(selectGenerateCharacterInWorkImageLoading);
    const generateError = useSelector(selectGenerateCharacterInWorkImageError);

    const [editMode, setEditMode] = useState(false);
    const [currentAttrs, setCurrentAttrs] = useState({});
    const [initialAttrs, setInitialAttrs] = useState({});
    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addRelOpen, setAddRelOpen] = useState(false);
    const [selectedTargetId, setSelectedTargetId] = useState('');
    const [addingRel, setAddingRel] = useState(false);
    const [removingRelId, setRemovingRelId] = useState(null);
    const [relType, setRelType] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadOpen, setUploadOpen] = useState(false);

    const [prePageLoading, setPrePageLoading] = useState(true);

    const formRef = useRef(null);
    const addTagRef = useRef(null);
    const addRelRef = useRef(null);
    const uploadRef = useRef(null);

    useEffect(() => {
        if (!id || !characterInWorkId) {
            setPrePageLoading(false);
            return;
        }
        if (ciw != null) {
            if (ciw.id === characterInWorkId) {
                setPrePageLoading(false);
                return;
            } else {
                dispatch(resetCharacterInWork());
            }
        }
        setPrePageLoading(false);
        dispatch(getCharacterInWork({ workId: id, characterInWorkId }));
        dispatch(getEventsByCharacterInWorkId({ workId: id, characterInWorkId }));
        dispatch(getCharacterInWorkRelationships({ workId: id, characterInWorkId }));
    }, [dispatch, id, characterInWorkId, ciw]);

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
        if (!addRelOpen || !id || !characterInWorkId) return;
        dispatch(getCharacterInWorkPossibleRelationships({ workId: id, characterInWorkId }));
        const dlg = addRelRef.current;
        if (!dlg) return;

        if (addRelOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addRelOpen, dispatch, id, characterInWorkId]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        const dlg = uploadRef.current;
        if (!dlg) return;
        if (uploadOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [uploadOpen]);

    const workTitle = ciw?.work?.title || '—';
    const workId = ciw?.work_id;
    const character = ciw?.character;
    const characterName = character?.name ?? '—';
    const characterAppearance = character?.appearance ?? '—';
    const characterPersonality = character?.personality ?? '—';
    const characterBio = character?.bio ?? '—';

    const disableAll = loading || updateLoading;

    const handleGenerateImage = async () => {
        if (!id || !characterInWorkId) return;

        const action = await dispatch(generateCharacterInWorkImage({ workId: id, characterInWorkId }));
        if (generateCharacterInWorkImage.fulfilled.match(action)) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
            setUploadError('');
        }
    };

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
        if (addingRel) return;
        setAddRelOpen(false);
        setSelectedTargetId('');
        setRelType('');
    };

    const handleAddRelationship = async () => {
        if (!id || !characterInWorkId || !selectedTargetId) return;
        try {
            setAddingRel(true);
            const action = await dispatch(
                createRelationship({
                    workId: id,
                    characterInWorkId,
                    data: { to_character_in_work_id: selectedTargetId, type: relType.trim() },
                })
            );
            if (createRelationship.fulfilled.match(action)) {
                setAddRelOpen(false);
                setSelectedTargetId('');
                setRelType('');
                dispatch(getCharacterInWorkRelationships({ workId: id, characterInWorkId }));
            }
        } finally {
            setAddingRel(false);
        }
    };

    const handleRemoveRelationship = async (workId, relationshipId) => {
        try {
            setRemovingRelId(relationshipId);
            const action = await dispatch(deleteRelationship({ workId, characterInWorkId, relationshipId }));
            if (deleteRelationship.fulfilled.match(action)) {
                dispatch(getCharacterInWorkRelationships({ workId: id, characterInWorkId }));
            }
        } finally {
            setRemovingRelId(null);
        }
    };

    const handleUploadImage = async file => {
        if (!file || !id || !characterInWorkId) return;
        try {
            setUploading(true);
            setUploadError('');

            const fd = new FormData();
            fd.append('file', file);

            const res = await uploadImage(fd);
            const url = res?.url;

            if (!url || typeof url !== 'string') {
                throw new Error('Upload succeeded but no URL was returned');
            }

            const action = await dispatch(
                updateCharacterInWork({ workId: id, characterInWorkId, data: { image_url: url } })
            );
            if (updateCharacterInWork.fulfilled.match(action)) {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
            }
        } catch (err) {
            setUploadError(err?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {!prePageLoading && (
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
                                    <Link
                                        to={`/works/${workId}/cast/${characterInWorkId}`}
                                        className={styles.crumbLink}
                                    >
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

                    {!loading && !error && ciw && (
                        <>
                            <div className={styles.split}>
                                <section className={`${styles.card} ${styles.imageCard}`} aria-label="Character image">
                                    <div className={styles.imageColumn}>
                                        <span className={styles.label}>Image</span>

                                        <div className={styles.portraitWrap}>
                                            {previewUrl ? (
                                                <img className={styles.portraitImg} src={previewUrl} alt="Preview" />
                                            ) : ciw?.image_url ? (
                                                <img
                                                    className={styles.portraitImg}
                                                    src={ciw.image_url}
                                                    alt={`${ciw?.character?.name ?? 'Character'} image`}
                                                />
                                            ) : ciw?.character?.image_url ? (
                                                <img
                                                    className={styles.portraitImg}
                                                    src={ciw.character.image_url}
                                                    alt={`${ciw?.character?.name ?? 'Character'} image`}
                                                />
                                            ) : (
                                                <div className={styles.portraitEmpty}>No image</div>
                                            )}
                                        </div>

                                        <div className={styles.uploader}>
                                            {generateError && (
                                                <p role="alert" className={styles.error}>
                                                    {generateError}
                                                </p>
                                            )}

                                            <div className={styles.imageActions}>
                                                <button
                                                    type="button"
                                                    className="primaryBtn"
                                                    onClick={() => setUploadOpen(true)}
                                                    disabled={uploading || disableAll || generateLoading}
                                                    aria-label="Upload and attach image"
                                                    title="Upload and attach image"
                                                >
                                                    {uploading ? 'Uploading...' : 'Upload & Attach'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="primaryBtn"
                                                    onClick={handleGenerateImage}
                                                    disabled={generateLoading || disableAll || uploading}
                                                    aria-label="Generate image"
                                                    title="Generate image"
                                                >
                                                    <svg className="icon" aria-hidden="true" focusable="false">
                                                        <use href="/icons.svg#wand" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <section className={styles.card} aria-label="Character in work">
                                    <form
                                        ref={formRef}
                                        className={styles.form}
                                        onSubmit={e => e.preventDefault()}
                                        noValidate
                                    >
                                        <div className={styles.field}>
                                            <label className={styles.label}>Character Name</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={characterName}
                                                disabled
                                                readOnly
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label className={styles.label}>Appearance</label>
                                            <textarea
                                                rows={5}
                                                className={`${styles.input} ${styles.textarea}`}
                                                value={characterAppearance}
                                                disabled
                                                readOnly
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label className={styles.label}>Personality</label>
                                            <textarea
                                                rows={5}
                                                className={`${styles.input} ${styles.textarea}`}
                                                value={characterPersonality}
                                                disabled
                                                readOnly
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label className={styles.label}>Bio</label>
                                            <textarea
                                                rows={6}
                                                className={`${styles.input} ${styles.textarea}`}
                                                value={characterBio}
                                                disabled
                                                readOnly
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <span className={styles.label}>Parent Tags</span>
                                            <div className={styles.chips}>
                                                {Object.keys(initialAttrs).length === 0 && (
                                                    <span className={styles.muted}>No tags yet.</span>
                                                )}

                                                {Object.entries(initialAttrs).map(([k, v]) => (
                                                    <span
                                                        key={k}
                                                        className={styles.chip}
                                                        aria-label={`${k}: ${String(v)}`}
                                                    >
                                                        <strong className={styles.chipKey}>{k}</strong>
                                                        <span className={styles.chipSep}>:</span>
                                                        <span className={styles.chipVal}>{String(v)}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.field}>
                                            <span className={styles.label}>Current Tags</span>
                                            <div className={styles.chips}>
                                                {Object.keys(currentAttrs).length === 0 && (
                                                    <span className={styles.muted}>No tags yet.</span>
                                                )}

                                                {Object.entries(currentAttrs).map(([k, v]) => (
                                                    <span
                                                        key={k}
                                                        className={styles.chip}
                                                        aria-label={`${k}: ${String(v)}`}
                                                    >
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
                                                    className="primaryBtn"
                                                    onClick={handleEdit}
                                                    disabled={disableAll}
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="primaryBtn"
                                                        onClick={handleSave}
                                                        disabled={updateLoading}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
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
                            </div>

                            <section className={styles.card} aria-label="Used in events">
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

                            {uploadOpen && (
                                <dialog
                                    ref={uploadRef}
                                    className="dialog"
                                    aria-labelledby="upload-title"
                                    onClose={() => {
                                        setUploadOpen(false);
                                    }}
                                >
                                    <form
                                        method="dialog"
                                        className={styles.modalBody}
                                        onSubmit={e => e.preventDefault()}
                                    >
                                        <h3 id="upload-title" className={styles.modalTitle}>
                                            Upload image
                                        </h3>

                                        <div className={styles.field}>
                                            <label className={styles.label}>
                                                Choose file
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async e => {
                                                        setUploadError('');
                                                        const inputEl = e.currentTarget;
                                                        const file = inputEl.files?.[0];
                                                        if (!file) return;

                                                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                                                        setPreviewUrl(URL.createObjectURL(file));

                                                        await handleUploadImage(file);
                                                        setUploadOpen(false);
                                                        inputEl.value = '';
                                                    }}
                                                    disabled={uploading || disableAll}
                                                />
                                            </label>
                                        </div>

                                        {uploadError && (
                                            <p role="alert" className={styles.error}>
                                                {uploadError}
                                            </p>
                                        )}

                                        <div className={styles.modalActions}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadError('');
                                                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                                                    setPreviewUrl('');
                                                    setUploadOpen(false);
                                                }}
                                                disabled={uploading}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </dialog>
                            )}

                            {addTagOpen && (
                                <dialog
                                    ref={addTagRef}
                                    aria-labelledby="add-tag-title"
                                    onClose={() => setAddTagOpen(false)}
                                >
                                    <form
                                        method="dialog"
                                        className={styles.modalBody}
                                        onSubmit={e => e.preventDefault()}
                                    >
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

                            <section className={styles.card} aria-label="Relationships">
                                <div className={styles.subHeader}>
                                    <h2 className={styles.subTitle}>Relationships</h2>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={openAddRelModal}
                                        disabled={relLoading}
                                        aria-label="Add relationship"
                                        title="Add relationship"
                                    >
                                        Add relationship
                                    </button>
                                </div>

                                {relLoading && (
                                    <p aria-live="polite" className={styles.muted}>
                                        Loading...
                                    </p>
                                )}
                                {!relLoading && relError && (
                                    <p role="alert" className={styles.error}>
                                        {String(relError)}
                                    </p>
                                )}

                                {!relLoading &&
                                    !relError &&
                                    (relationships.length > 0 ? (
                                        <List
                                            items={relationships}
                                            onRemove={({ id: relationshipId, work_id: workId }) => {
                                                if (removingRelId) return;
                                                handleRemoveRelationship(workId, relationshipId);
                                            }}
                                        />
                                    ) : (
                                        <p className={styles.muted}>No relationships yet.</p>
                                    ))}
                            </section>

                            {addRelOpen && (
                                <dialog ref={addRelRef} aria-labelledby="add-rel-title" onClose={closeAddRelModal}>
                                    <form
                                        method="dialog"
                                        className={styles.modalBody}
                                        onSubmit={e => e.preventDefault()}
                                    >
                                        <h3 id="add-rel-title" className={styles.modalTitle}>
                                            Add relationship
                                        </h3>

                                        {possibleRelLoading && (
                                            <p className={styles.muted} aria-live="polite">
                                                Loading candidates...
                                            </p>
                                        )}
                                        {!possibleRelLoading && possibleRelError && (
                                            <p className={styles.error} role="alert">
                                                {String(possibleRelError)}
                                            </p>
                                        )}

                                        {!possibleRelLoading &&
                                            !possibleRelError &&
                                            (possibleRels.length === 0 ? (
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
                                            ))}

                                        <div className={styles.field} style={{ marginTop: 12 }}>
                                            <label className={styles.label}>
                                                Type
                                                <input
                                                    className={styles.input}
                                                    type="text"
                                                    value={relType}
                                                    onChange={e => setRelType(e.target.value)}
                                                    placeholder="e.g. ally, enemy, mentor"
                                                    required
                                                />
                                            </label>
                                            <small className={styles.muted}>This field is required.</small>
                                        </div>

                                        <div className={styles.modalActions}>
                                            <button
                                                type="button"
                                                className="primaryBtn"
                                                onClick={handleAddRelationship}
                                                disabled={addingRel || possibleRelLoading || !selectedTargetId}
                                            >
                                                {addingRel ? 'Adding...' : 'Add'}
                                            </button>
                                            <button type="button" onClick={closeAddRelModal} disabled={addingRel}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </dialog>
                            )}
                        </>
                    )}
                </main>
            )}
        </>
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
