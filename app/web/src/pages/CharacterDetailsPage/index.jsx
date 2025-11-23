import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';
import ImageSection from '../../components/ImageSection';

import {
    getCharacter,
    updateCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
    deleteCharacter,
} from '../../redux/characters/operations';
import { linkWorkCharacter, deleteCharacterInWork } from '../../redux/works/operations';

import {
    selectCharacter,
    selectGetCharacterError,
    selectUpdateCharacterError,
    selectCharacterAppearances,
    selectGetCharacterAppearancesError,
    selectCharacterPossibleAppearances,
    selectGetCharacterPossibleAppearancesError,
    selectDeleteCharacterError,
} from '../../redux/characters/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import { resetCharacter } from '../../redux/characters/slice';

import styles from './CharacterDetailsPage.module.css';

export default function CharacterDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const character = useSelector(selectCharacter);
    const error = useSelector(selectGetCharacterError);

    const updateError = useSelector(selectUpdateCharacterError);

    const deleteError = useSelector(selectDeleteCharacterError);

    const appearances = useSelector(selectCharacterAppearances);
    const appearancesError = useSelector(selectGetCharacterAppearancesError);

    const possibleWorks = useSelector(selectCharacterPossibleAppearances);
    const possibleError = useSelector(selectGetCharacterPossibleAppearancesError);

    const [editMode, setEditMode] = useState(false);

    const [attrs, setAttrs] = useState({});

    const [addTagOpen, setAddTagOpen] = useState(false);
    const [addWorkOpen, setAddWorkOpen] = useState(false);

    const [selectedWorkId, setSelectedWorkId] = useState('');

    const formRef = useRef(null);
    const addTagRef = useRef(null);
    const addWorkRef = useRef(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        if (character != null) {
            if (character.id === id) {
                return;
            } else {
                dispatch(resetCharacter());
            }
        }
        dispatch(getCharacter(id));
        dispatch(getCharacterAppearances(id));
        dispatch(getCharacterPossibleAppearances(id));
    }, [dispatch, id, character]);

    useEffect(() => {
        const dlg = addWorkRef.current;
        if (!dlg) return;

        if (addWorkOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addWorkOpen]);

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
        setAddWorkOpen(false);
        setSelectedWorkId('');
    };
    const handleAddToWork = async () => {
        closeAddWorkModal();
        dispatch(linkWorkCharacter({ workId: selectedWorkId, data: { character_id: id }, from: 'character' }));
    };

    const handleRemoveAppearance = async (workId, characterInWorkId) => {
        dispatch(deleteCharacterInWork({ workId, characterInWorkId, from: 'character' }));
    };

    return (
        <main aria-labelledby={titleId} className="page">
            {error && (
                <p role="alert" className={styles.error}>
                    {String(error)}
                </p>
            )}

            {!globalLoading && !error && character && (
                <>
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

                    <div className={styles.split}>
                        <section className={`${styles.card} ${styles.imageCard}`} aria-label="Character image">
                            <ImageSection
                                characterId={id}
                                name={character.name}
                                imageUrl={character.image_url}
                                disableAll={globalLoading}
                            />
                        </section>

                        <section className={styles.card} aria-label="Character info">
                            <form ref={formRef} className={styles.form} onSubmit={e => e.preventDefault()} noValidate>
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
                                        disabled={!editMode || globalLoading}
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
                                        disabled={!editMode || globalLoading}
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
                                        disabled={!editMode || globalLoading}
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
                                        disabled={!editMode || globalLoading}
                                    />
                                </div>

                                <div className={styles.field}>
                                    <span className={styles.label}>Tags</span>
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
                    </div>

                    <section className={styles.card} aria-label="Character appearances">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Appearances</h2>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={openAddWorkModal}
                                disabled={globalLoading}
                                aria-label="Add to work"
                                title="Add to work"
                            >
                                Add to work
                            </button>
                        </div>

                        {appearancesError && (
                            <p role="alert" className={styles.error}>
                                {String(appearancesError)}
                            </p>
                        )}

                        {!appearancesError &&
                            (appearances.length > 0 ? (
                                <List
                                    items={appearances}
                                    onRemove={({ id: characterInWorkId, work_id: workId }) => {
                                        handleRemoveAppearance(workId, characterInWorkId);
                                    }}
                                />
                            ) : (
                                <p className={styles.muted}>No appearances yet.</p>
                            ))}
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

            {addWorkOpen && (
                <dialog ref={addWorkRef} aria-labelledby="add-work-title" onClose={closeAddWorkModal}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-work-title" className={styles.modalTitle}>
                            Add to work
                        </h3>

                        {possibleError && (
                            <p className={styles.error} role="alert">
                                {String(possibleError)}
                            </p>
                        )}

                        {!possibleError &&
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
                                disabled={globalLoading || !selectedWorkId}
                            >
                                Add
                            </button>
                            <button type="button" onClick={closeAddWorkModal}>
                                Cancel
                            </button>
                        </div>
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
