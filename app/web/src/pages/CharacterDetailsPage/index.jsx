import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { uploadImage } from '../../api/upload';

import Title from '../../components/Title';
import List from '../../components/List';

import {
    getCharacter,
    updateCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
    deleteCharacter,
    generateCharacterImage,
} from '../../redux/characters/operations';
import { linkWorkCharacter, deleteCharacterInWork } from '../../redux/works/operations';

import {
    selectCharacter,
    selectGetCharacterLoading,
    selectGetCharacterError,
    selectUpdateCharacterLoading,
    selectUpdateCharacterError,
    selectCharacterAppearances,
    selectGetCharacterAppearancesLoading,
    selectGetCharacterAppearancesError,
    selectCharacterPossibleAppearances,
    selectGetCharacterPossibleAppearancesLoading,
    selectGetCharacterPossibleAppearancesError,
    selectDeleteCharacterLoading,
    selectDeleteCharacterError,
    selectGenerateCharacterImageLoading,
    selectGenerateCharacterImageError,
} from '../../redux/characters/selectors';

import { resetCharacter } from '../../redux/characters/slice';

import styles from './CharacterDetailsPage.module.css';

export default function CharacterDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const character = useSelector(selectCharacter);
    const loading = useSelector(selectGetCharacterLoading);
    const error = useSelector(selectGetCharacterError);

    const updateLoading = useSelector(selectUpdateCharacterLoading);
    const updateError = useSelector(selectUpdateCharacterError);

    const deleteLoading = useSelector(selectDeleteCharacterLoading);
    const deleteError = useSelector(selectDeleteCharacterError);

    const appearances = useSelector(selectCharacterAppearances) || [];
    const appearancesLoading = useSelector(selectGetCharacterAppearancesLoading);
    const appearancesError = useSelector(selectGetCharacterAppearancesError);

    const possibleWorks = useSelector(selectCharacterPossibleAppearances) || [];
    const possibleLoading = useSelector(selectGetCharacterPossibleAppearancesLoading);
    const possibleError = useSelector(selectGetCharacterPossibleAppearancesError);

    const generateLoading = useSelector(selectGenerateCharacterImageLoading);
    const generateError = useSelector(selectGenerateCharacterImageError);

    const [editMode, setEditMode] = useState(false);

    const [attrs, setAttrs] = useState({});

    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addWorkOpen, setAddWorkOpen] = useState(false);

    const [selectedWorkId, setSelectedWorkId] = useState('');
    const [adding, setAdding] = useState(false);

    const [removingId, setRemovingId] = useState(null);

    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadOpen, setUploadOpen] = useState(false);

    const [prePageLoading, setPrePageLoading] = useState(true);

    const formRef = useRef(null);
    const addTagRef = useRef(null);
    const addWorkRef = useRef(null);
    const uploadRef = useRef(null);

    useEffect(() => {
        if (!id) {
            setPrePageLoading(false);
            return;
        }
        if (character != null) {
            if (character.id === id) {
                setPrePageLoading(false);
                return;
            } else {
                dispatch(resetCharacter());
            }
        }
        setPrePageLoading(false);
        dispatch(getCharacter(id));
        dispatch(getCharacterAppearances(id));
    }, [dispatch, id, character]);

    useEffect(() => {
        if (!addWorkOpen || !id) return;
        dispatch(getCharacterPossibleAppearances(id));

        const dlg = addWorkRef.current;
        if (!dlg) return;

        if (addWorkOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addWorkOpen, dispatch, id]);

    useEffect(() => {
        if (character) {
            setAttrs(character.attributes && typeof character.attributes === 'object' ? character.attributes : {});
        }
    }, [character]);

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

    const disableAll = loading || updateLoading || deleteLoading;

    const handleGenerateImage = async () => {
        if (!id) return;

        const action = await dispatch(generateCharacterImage(id));
        if (generateCharacterImage.fulfilled.match(action)) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
            setUploadError('');
        }
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (!formRef.current || !character) return;
        formRef.current.name.value = character.name ?? '';
        formRef.current.appearance.value = character.appearance ?? '';
        formRef.current.personality.value = character.personality ?? '';
        formRef.current.bio.value = character.bio ?? '';
        setAttrs(character.attributes && typeof character.attributes === 'object' ? character.attributes : {});
    };

    const handleSave = async () => {
        if (!formRef.current) return;
        const fd = new FormData(formRef.current);

        const data = {
            name: (fd.get('name') || '').toString().trim(),
            appearance: (fd.get('appearance') || '').toString().trim(),
            personality: (fd.get('personality') || '').toString().trim(),
            bio: (fd.get('bio') || '').toString().trim(),
            attributes: attrs,
        };
        if (!data.name || !data.appearance || !data.personality || !data.bio) return;

        const action = await dispatch(updateCharacter({ id, data }));
        if (updateCharacter.fulfilled.match(action)) setEditMode(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        const ok = window.confirm('Delete this character? This action cannot be undone.');
        if (!ok) return;
        const action = await dispatch(deleteCharacter(id));
        if (deleteCharacter.fulfilled.match(action)) {
            navigate('/characters', { replace: true });
        }
    };

    const removeAttr = k => {
        setAttrs(prev => {
            const next = { ...prev };
            delete next[k];
            return next;
        });
    };

    const openAddWorkModal = () => {
        setSelectedWorkId('');
        setAddWorkOpen(true);
    };
    const closeAddWorkModal = () => {
        if (adding) return;
        setAddWorkOpen(false);
        setSelectedWorkId('');
    };
    const handleAddToWork = async () => {
        if (!id || !selectedWorkId) return;
        try {
            setAdding(true);
            const action = await dispatch(linkWorkCharacter({ workId: selectedWorkId, data: { character_id: id } }));
            if (linkWorkCharacter.fulfilled.match(action)) {
                setAddWorkOpen(false);
                setSelectedWorkId('');
                dispatch(getCharacterAppearances(id));
            }
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveAppearance = async (workId, characterInWorkId) => {
        if (!id) return;
        try {
            setRemovingId(workId);
            const action = await dispatch(deleteCharacterInWork({ workId, characterInWorkId }));
            if (deleteCharacterInWork.fulfilled.match(action)) {
                dispatch(getCharacterAppearances(id));
            }
        } finally {
            setRemovingId(null);
        }
    };

    const handleUploadImage = async file => {
        if (!file || !id) return;
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

            const action = await dispatch(updateCharacter({ id, data: { image_url: url } }));
            if (updateCharacter.fulfilled.match(action)) {
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
                                    <Link to="/characters" className={styles.crumbLink}>
                                        CHARACTERS
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <Link to={`/characters/${id}`} className={styles.crumbLink}>
                                        {character?.name ?? '—'}
                                    </Link>
                                </li>
                            </ol>
                        </nav>
                        <Title id={titleId}>{character?.name ?? '—'}</Title>
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

                    {!loading && !error && character && (
                        <>
                            <div className={styles.split}>
                                <section className={`${styles.card} ${styles.imageCard}`} aria-label="Character image">
                                    <div className={styles.imageColumn}>
                                        <span className={styles.label}>Image</span>

                                        <div className={styles.portraitWrap}>
                                            {previewUrl ? (
                                                <img className={styles.portraitImg} src={previewUrl} alt="Preview" />
                                            ) : character?.image_url ? (
                                                <img
                                                    className={styles.portraitImg}
                                                    src={character.image_url}
                                                    alt={`${character?.name ?? 'Character'} image`}
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

                                <section className={styles.card} aria-label="Character info">
                                    <form
                                        ref={formRef}
                                        className={styles.form}
                                        onSubmit={e => e.preventDefault()}
                                        noValidate
                                    >
                                        <div className={styles.field}>
                                            <label htmlFor="ch-name" className={styles.label}>
                                                Name
                                            </label>
                                            <input
                                                id="ch-name"
                                                name="name"
                                                type="text"
                                                defaultValue={character.name ?? ''}
                                                className={styles.input}
                                                disabled={!editMode || disableAll}
                                                required
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="ch-appearance" className={styles.label}>
                                                Appearance
                                            </label>
                                            <textarea
                                                id="ch-appearance"
                                                name="appearance"
                                                rows={5}
                                                defaultValue={character.appearance ?? ''}
                                                className={`${styles.input} ${styles.textarea}`}
                                                disabled={!editMode || disableAll}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="ch-personality" className={styles.label}>
                                                Personality
                                            </label>
                                            <textarea
                                                id="ch-personality"
                                                name="personality"
                                                rows={5}
                                                defaultValue={character.personality ?? ''}
                                                className={`${styles.input} ${styles.textarea}`}
                                                disabled={!editMode || disableAll}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label htmlFor="ch-bio" className={styles.label}>
                                                Bio
                                            </label>
                                            <textarea
                                                id="ch-bio"
                                                name="bio"
                                                rows={6}
                                                defaultValue={character.bio ?? ''}
                                                className={`${styles.input} ${styles.textarea}`}
                                                disabled={!editMode || disableAll}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <span className={styles.label}>Tags</span>
                                            <div className={styles.chips}>
                                                {Object.keys(attrs).length === 0 && (
                                                    <span className={styles.muted}>No tags yet.</span>
                                                )}

                                                {Object.entries(attrs).map(([k, v]) => (
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
                                                        onClick={handleEdit}
                                                        disabled={disableAll}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="dangerBtn"
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

                            <section className={styles.card} aria-label="Character appearances">
                                <div className={styles.subHeader}>
                                    <h2 className={styles.subTitle}>Appearances</h2>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={openAddWorkModal}
                                        disabled={appearancesLoading}
                                        aria-label="Add to work"
                                        title="Add to work"
                                    >
                                        Add to work
                                    </button>
                                </div>

                                {appearancesLoading && (
                                    <p aria-live="polite" className={styles.muted}>
                                        Loading...
                                    </p>
                                )}
                                {!appearancesLoading && appearancesError && (
                                    <p role="alert" className={styles.error}>
                                        {String(appearancesError)}
                                    </p>
                                )}

                                {!appearancesLoading &&
                                    !appearancesError &&
                                    (appearances.length > 0 ? (
                                        <List
                                            items={appearances}
                                            onRemove={({ id: characterInWorkId, work_id: workId }) => {
                                                if (removingId) return;
                                                handleRemoveAppearance(workId, characterInWorkId);
                                            }}
                                        />
                                    ) : (
                                        <p className={styles.muted}>No appearances yet.</p>
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
                                                setAttrs(prev => ({ ...prev, [k]: v }));
                                                setAddTagOpen(false);
                                            }}
                                            onCancel={() => setAddTagOpen(false)}
                                        />
                                    </form>
                                </dialog>
                            )}

                            {addWorkOpen && (
                                <dialog ref={addWorkRef} aria-labelledby="add-work-title" onClose={closeAddWorkModal}>
                                    <form
                                        method="dialog"
                                        className={styles.modalBody}
                                        onSubmit={e => e.preventDefault()}
                                    >
                                        <h3 id="add-work-title" className={styles.modalTitle}>
                                            Add to work
                                        </h3>

                                        {possibleLoading && (
                                            <p className={styles.muted} aria-live="polite">
                                                Loading works...
                                            </p>
                                        )}
                                        {!possibleLoading && possibleError && (
                                            <p className={styles.error} role="alert">
                                                {String(possibleError)}
                                            </p>
                                        )}

                                        {!possibleLoading &&
                                            !possibleError &&
                                            (possibleWorks.length === 0 ? (
                                                <p className={styles.muted}>No available works to add.</p>
                                            ) : (
                                                <ul className={styles.radioList}>
                                                    {possibleWorks.map(w => (
                                                        <li key={w.id}>
                                                            <label className={styles.radioRow}>
                                                                <input
                                                                    type="radio"
                                                                    name="work"
                                                                    value={w.id}
                                                                    checked={String(selectedWorkId) === String(w.id)}
                                                                    onChange={e => setSelectedWorkId(e.target.value)}
                                                                />
                                                                <span>{w.content}</span>
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ))}

                                        <div className={styles.modalActions}>
                                            <button
                                                type="button"
                                                className="primaryBtn"
                                                onClick={handleAddToWork}
                                                disabled={adding || possibleLoading || !selectedWorkId}
                                            >
                                                {adding ? 'Adding...' : 'Add'}
                                            </button>
                                            <button type="button" onClick={closeAddWorkModal} disabled={adding}>
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
                        placeholder="e.g. species"
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
                        placeholder="e.g. ektirhos"
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
