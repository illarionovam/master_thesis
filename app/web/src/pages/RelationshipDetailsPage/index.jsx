import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Title from '../../components/Title';
import styles from './RelationshipDetailsPage.module.css';

import { getRelationship, updateRelationship, deleteRelationship } from '../../redux/works/operations';

import {
    selectRelationship,
    selectGetRelationshipLoading,
    selectGetRelationshipError,
    selectUpdateRelationshipLoading,
    selectUpdateRelationshipError,
    selectDeleteRelationshipLoading,
    selectDeleteRelationshipError,
} from '../../redux/works/selectors';

export default function RelationshipDetailsPage() {
    const { id: workId, characterInWorkId, relationshipId } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const rel = useSelector(selectRelationship);
    const loading = useSelector(selectGetRelationshipLoading);
    const error = useSelector(selectGetRelationshipError);

    const updateLoading = useSelector(selectUpdateRelationshipLoading);
    const updateError = useSelector(selectUpdateRelationshipError);

    const deleteLoading = useSelector(selectDeleteRelationshipLoading);
    const deleteError = useSelector(selectDeleteRelationshipError);

    const [editMode, setEditMode] = useState(false);
    const [typeVal, setTypeVal] = useState('');
    const [notesVal, setNotesVal] = useState('');

    useEffect(() => {
        if (!workId || !characterInWorkId || !relationshipId) return;
        dispatch(getRelationship({ workId, characterInWorkId, relationshipId }));
    }, [dispatch, workId, characterInWorkId, relationshipId]);

    useEffect(() => {
        if (!rel) return;
        setTypeVal(rel.type ?? '');
        setNotesVal(rel.notes ?? '');
    }, [rel]);

    const disableAll = loading || updateLoading || deleteLoading;

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        setTypeVal(rel?.type ?? '');
        setNotesVal(rel?.notes ?? '');
    };

    const handleSave = async () => {
        if (!workId || !characterInWorkId || !relationshipId) return;
        const data = {
            type: (typeVal ?? '').trim(),
            notes: (notesVal ?? '').trim(),
        };
        if (!data.type) return;
        const action = await dispatch(updateRelationship({ workId, characterInWorkId, relationshipId, data }));
        if (updateRelationship.fulfilled.match(action)) setEditMode(false);
    };

    const handleDelete = async () => {
        if (!workId || !characterInWorkId || !relationshipId) return;
        const ok = window.confirm('Delete this relationship? This action cannot be undone.');
        if (!ok) return;
        const action = await dispatch(deleteRelationship({ workId, characterInWorkId, relationshipId }));
        if (deleteRelationship.fulfilled.match(action)) {
            const backToFrom = `/works/${workId}/cast/${characterInWorkId}`;
            navigate(backToFrom, { replace: true });
        }
    };

    const workTitle = rel?.from?.work?.title ?? '—';
    const fromName = rel?.from?.character?.name ?? rel?.from?.name ?? rel?.from_name ?? '—';
    const toName = rel?.to?.character?.name ?? rel?.to?.name ?? rel?.to_name ?? '—';

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
                            <span className={styles.crumbLink}>{`[${fromName} > ${toName}]`}</span>
                        </li>
                    </ol>
                </nav>
                <Title id={titleId}>Relationship</Title>
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

            {!loading && !error && rel && (
                <section className={styles.card} aria-label="Relationship details">
                    <form ref={formRef} className={styles.form} onSubmit={e => e.preventDefault()} noValidate>
                        <div className={styles.field}>
                            <label className={styles.label}>From</label>
                            <input type="text" className={styles.input} value={fromName} disabled readOnly />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>To</label>
                            <input type="text" className={styles.input} value={toName} disabled readOnly />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="rel-type">
                                Type
                            </label>
                            <input
                                id="rel-type"
                                name="type"
                                type="text"
                                className={styles.input}
                                value={typeVal}
                                onChange={e => setTypeVal(e.target.value)}
                                disabled={!editMode || disableAll}
                                required
                                placeholder="e.g. ally, enemy, mentor"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="rel-notes">
                                Notes
                            </label>
                            <textarea
                                id="rel-notes"
                                name="notes"
                                rows={5}
                                className={`${styles.input} ${styles.textarea}`}
                                value={notesVal}
                                onChange={e => setNotesVal(e.target.value)}
                                disabled={!editMode || disableAll}
                                placeholder="Optional notes..."
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
                                        disabled={updateLoading || !typeVal.trim()}
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
            )}
        </main>
    );
}
