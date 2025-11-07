import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';

import Title from '../../components/Title';
import List from '../../components/List';
import {
    getLocation,
    getLocations,
    updateLocation,
    getLocationPlacements,
    getLocationPossiblePlacements,
    deleteLocation,
} from '../../redux/locations/operations';
import { linkWorkLocation, deleteLocationInWork } from '../../redux/works/operations';

import {
    selectLocation,
    selectGetLocationLoading,
    selectGetLocationError,
    selectLocations,
    selectUpdateLocationLoading,
    selectUpdateLocationError,
    selectLocationPlacements,
    selectGetLocationPlacementsLoading,
    selectGetLocationPlacementsError,
    selectLocationPossiblePlacements,
    selectGetLocationPossiblePlacementsLoading,
    selectGetLocationPossiblePlacementsError,
    selectDeleteLocationLoading,
    selectDeleteLocationError,
} from '../../redux/locations/selectors';

import { resetLocation } from '../../redux/locations/slice';

import styles from './LocationDetailsPage.module.css';

export default function LocationDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useSelector(selectLocation);
    const loading = useSelector(selectGetLocationLoading);
    const error = useSelector(selectGetLocationError);

    const allLocations = useSelector(selectLocations) || [];
    const updateLoading = useSelector(selectUpdateLocationLoading);
    const updateError = useSelector(selectUpdateLocationError);

    const placements = useSelector(selectLocationPlacements) || [];
    const placementsLoading = useSelector(selectGetLocationPlacementsLoading);
    const placementsError = useSelector(selectGetLocationPlacementsError);

    const possibleWorks = useSelector(selectLocationPossiblePlacements) || [];
    const possibleLoading = useSelector(selectGetLocationPossiblePlacementsLoading);
    const possibleError = useSelector(selectGetLocationPossiblePlacementsError);

    const deleteLoading = useSelector(selectDeleteLocationLoading);
    const deleteError = useSelector(selectDeleteLocationError);

    const [addOpen, setAddOpen] = useState(false);
    const [selectedWorkId, setSelectedWorkId] = useState('');
    const [adding, setAdding] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [prePageLoading, setPrePageLoading] = useState(true);

    const formRef = useRef(null);

    useEffect(() => {
        if (!id) {
            setPrePageLoading(false);
            return;
        }
        if (location != null) {
            if (location.id === id) {
                setPrePageLoading(false);
                return;
            } else {
                dispatch(resetLocation());
            }
        }
        setPrePageLoading(false);
        dispatch(getLocation(id));
        dispatch(getLocationPlacements(id));
        dispatch(getLocations());
    }, [dispatch, id, location]);

    useEffect(() => {
        if (!addOpen || !id) return;
        dispatch(getLocationPossiblePlacements(id));
    }, [addOpen, dispatch, id]);

    const disableAll = loading || updateLoading || deleteLoading;

    const parentOptions = useMemo(() => {
        if (!id) return allLocations;
        return allLocations.filter(l => String(l.id) !== String(id));
    }, [allLocations, id]);

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (!formRef.current || !location) return;
        formRef.current.title.value = location.title ?? '';
        formRef.current.description.value = location.description ?? '';
        if (formRef.current.parent_location_id) {
            formRef.current.parent_location_id.value = location.parent?.id ? String(location.parent.id) : '';
        }
    };

    const handleSave = async () => {
        if (!formRef.current) return;
        const fd = new FormData(formRef.current);
        const title = (fd.get('title') || '').toString().trim();
        const description = (fd.get('description') || '').toString().trim();
        const parentRaw = (fd.get('parent_location_id') || '').toString().trim();
        const parent_location_id = parentRaw ? parentRaw : null;
        if (!title || !description) return;

        const action = await dispatch(updateLocation({ id, data: { title, description, parent_location_id } }));
        if (updateLocation.fulfilled.match(action)) setEditMode(false);
    };

    const handleDelete = async () => {
        if (!id) return;
        const ok = window.confirm('Delete this location? This action cannot be undone.');
        if (!ok) return;
        const action = await dispatch(deleteLocation(id));
        if (deleteLocation.fulfilled.match(action)) {
            navigate('/locations', { replace: true });
        }
    };

    const openAddModal = () => {
        setSelectedWorkId('');
        setAddOpen(true);
    };
    const closeAddModal = () => {
        if (adding) return;
        setAddOpen(false);
        setSelectedWorkId('');
    };
    const handleAddToWork = async () => {
        if (!id || !selectedWorkId) return;
        try {
            setAdding(true);
            const action = await dispatch(linkWorkLocation({ workId: selectedWorkId, data: { location_id: id } }));
            if (linkWorkLocation.fulfilled.match(action)) {
                setAddOpen(false);
                setSelectedWorkId('');
                dispatch(getLocationPlacements(id));
            }
        } finally {
            setAdding(false);
        }
    };

    const [removingId, setRemovingId] = useState(null);

    const handleRemovePlacement = async (workId, locationInWorkId) => {
        if (!id) return;
        try {
            setRemovingId(workId);
            const action = await dispatch(deleteLocationInWork({ workId, locationInWorkId }));
            if (deleteLocationInWork.fulfilled.match(action)) {
                dispatch(getLocationPlacements(id));
            }
        } finally {
            setRemovingId(null);
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
                                    <Link to="/locations" className={styles.crumbLink}>
                                        LOCATIONS
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <Link to={`/locations/${id}`} className={styles.crumbLink}>
                                        {location?.title ?? '—'}
                                    </Link>
                                </li>
                            </ol>
                        </nav>

                        <Title id={titleId}>{location?.title ?? '—'}</Title>
                    </div>

                    {loading && (
                        <p aria-live="polite" className={styles.muted}>
                            Loading...
                        </p>
                    )}
                    {error && (
                        <p role="alert" className={styles.error}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && location && (
                        <>
                            <section className={styles.card} aria-label="Location info">
                                <form
                                    ref={formRef}
                                    className={styles.form}
                                    onSubmit={e => e.preventDefault()}
                                    noValidate
                                >
                                    <div className={styles.field}>
                                        <label htmlFor="loc-title" className={styles.label}>
                                            Title
                                        </label>
                                        <input
                                            id="loc-title"
                                            name="title"
                                            type="text"
                                            defaultValue={location.title ?? ''}
                                            className={styles.input}
                                            disabled={!editMode || disableAll}
                                            required
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label htmlFor="loc-desc" className={styles.label}>
                                            Description
                                        </label>
                                        <textarea
                                            id="loc-desc"
                                            name="description"
                                            rows={5}
                                            defaultValue={location.description ?? ''}
                                            className={`${styles.input} ${styles.textarea}`}
                                            disabled={!editMode || disableAll}
                                            required
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label htmlFor="loc-parent" className={styles.label}>
                                            Parent Location
                                        </label>
                                        <select
                                            id="loc-parent"
                                            name="parent_location_id"
                                            defaultValue={location.parent?.id ? String(location.parent.id) : ''}
                                            className={styles.input}
                                            disabled={!editMode || disableAll}
                                        >
                                            <option value="">— None —</option>
                                            {parentOptions.map(opt => (
                                                <option key={String(opt.id)} value={String(opt.id)}>
                                                    {opt.title ?? opt.content ?? `#${opt.id}`}
                                                </option>
                                            ))}
                                        </select>
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
                                                <button type="button" onClick={handleCancel} disabled={updateLoading}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </section>

                            <section className={styles.card} aria-label="Location placements">
                                <div className={styles.subHeader}>
                                    <h2 className={styles.subTitle}>Placements</h2>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={openAddModal}
                                        disabled={placementsLoading}
                                        aria-label="Add to work"
                                        title="Add to work"
                                    >
                                        Add to work
                                    </button>
                                </div>

                                {placementsLoading && (
                                    <p aria-live="polite" className={styles.muted}>
                                        Loading...
                                    </p>
                                )}

                                {!placementsLoading && placementsError && (
                                    <p role="alert" className={styles.error}>
                                        {String(placementsError)}
                                    </p>
                                )}

                                {!placementsLoading && !placementsError && (
                                    <>
                                        {placements.length > 0 ? (
                                            <List
                                                items={placements}
                                                onRemove={({ id: locationInWorkId, work_id: workId }) => {
                                                    if (removingId) return;
                                                    handleRemovePlacement(workId, locationInWorkId);
                                                }}
                                            />
                                        ) : (
                                            <p className={styles.muted}>No placements yet.</p>
                                        )}
                                    </>
                                )}
                            </section>

                            {addOpen && (
                                <dialog
                                    open
                                    className={styles.dialog}
                                    aria-labelledby="add-work-title"
                                    onClose={closeAddModal}
                                >
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

                                        {!possibleLoading && !possibleError && (
                                            <>
                                                {possibleWorks.length === 0 ? (
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
                                                                        checked={
                                                                            String(selectedWorkId) === String(w.id)
                                                                        }
                                                                        onChange={e =>
                                                                            setSelectedWorkId(e.target.value)
                                                                        }
                                                                    />
                                                                    <span>{w.content}</span>
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
                                                onClick={handleAddToWork}
                                                disabled={adding || possibleLoading || !selectedWorkId}
                                            >
                                                {adding ? 'Adding...' : 'Add'}
                                            </button>
                                            <button type="button" onClick={closeAddModal} disabled={adding}>
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
