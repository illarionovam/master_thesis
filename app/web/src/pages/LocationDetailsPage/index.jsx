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
    selectGetLocationError,
    selectLocations,
    selectGetLocationsError,
    selectUpdateLocationError,
    selectLocationPlacements,
    selectGetLocationPlacementsError,
    selectLocationPossiblePlacements,
    selectGetLocationPossiblePlacementsError,
    selectDeleteLocationError,
} from '../../redux/locations/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import styles from './LocationDetailsPage.module.css';

export default function LocationDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const location = useSelector(selectLocation);
    const allLocations = useSelector(selectLocations);
    const placements = useSelector(selectLocationPlacements);
    const possibleWorks = useSelector(selectLocationPossiblePlacements);

    const error = useSelector(selectGetLocationError);
    const allLocationsError = useSelector(selectGetLocationsError);
    const placementsError = useSelector(selectGetLocationPlacementsError);
    const possibleError = useSelector(selectGetLocationPossiblePlacementsError);

    const updateError = useSelector(selectUpdateLocationError);
    const deleteError = useSelector(selectDeleteLocationError);

    const [addOpen, setAddOpen] = useState(false);
    const [selectedWorkId, setSelectedWorkId] = useState('');

    const [editMode, setEditMode] = useState(false);

    const globalError = error ?? allLocationsError ?? placementsError ?? possibleError;

    const formRef = useRef(null);
    const addWorkRef = useRef(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        if (location && location.id === id) {
            return;
        }
        dispatch(getLocations());
        dispatch(getLocation(id));
        dispatch(getLocationPlacements(id));
        dispatch(getLocationPossiblePlacements(id));
    }, [dispatch, id]);

    useEffect(() => {
        const dlg = addWorkRef.current;
        if (!dlg) return;

        if (addOpen) {
            if (!dlg.open) dlg.showModal();
        } else {
            if (dlg.open) dlg.close();
        }
    }, [addOpen]);

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
        setAddOpen(false);
        setSelectedWorkId('');
    };
    const handleAddToWork = async () => {
        if (!id || !selectedWorkId) return;
        closeAddModal();
        dispatch(linkWorkLocation({ workId: selectedWorkId, data: { location_id: id }, from: 'location' }));
    };

    const handleRemovePlacement = async (workId, locationInWorkId) => {
        dispatch(deleteLocationInWork({ workId, locationInWorkId, from: 'location' }));
    };

    return (
        <main aria-labelledby={titleId} className="page">
            {globalError && (
                <p role="alert" className={styles.error}>
                    {globalError}
                </p>
            )}

            {!globalLoading && !globalError && location && allLocations && placements && possibleWorks && (
                <>
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

                    <section className="card" aria-label="Location info">
                        <form ref={formRef} className="form" onSubmit={e => e.preventDefault()} noValidate>
                            <div className="field">
                                <label htmlFor="loc-title" className="label">
                                    Title
                                </label>
                                <input
                                    id="loc-title"
                                    name="title"
                                    type="text"
                                    defaultValue={location.title ?? ''}
                                    className={styles.input}
                                    disabled={!editMode || globalLoading}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="loc-desc" className="label">
                                    Description
                                </label>
                                <textarea
                                    id="loc-desc"
                                    name="description"
                                    rows={5}
                                    defaultValue={location.description ?? ''}
                                    className={`${styles.input} ${styles.textarea}`}
                                    disabled={!editMode || globalLoading}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="loc-parent" className="label">
                                    Parent Location
                                </label>
                                <select
                                    id="loc-parent"
                                    name="parent_location_id"
                                    defaultValue={location.parent?.id ?? ''}
                                    className={styles.input}
                                    disabled={!editMode || globalLoading}
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

                    <section className="card" aria-label="Location placements">
                        <div className={styles.subHeader}>
                            <h2 className={styles.subTitle}>Placements</h2>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={openAddModal}
                                disabled={globalLoading}
                                aria-label="Add to work"
                                title="Add to work"
                            >
                                Add to work
                            </button>
                        </div>

                        {placements.length > 0 ? (
                            <List
                                items={placements}
                                onRemove={({ id: locationInWorkId, work_id: workId }) => {
                                    handleRemovePlacement(workId, locationInWorkId);
                                }}
                            />
                        ) : (
                            <p className={styles.muted}>No placements yet.</p>
                        )}
                    </section>
                </>
            )}

            {addOpen && (
                <dialog ref={addWorkRef} aria-labelledby="add-work-title" onClose={closeAddModal}>
                    <form method="dialog" className={styles.modalBody} onSubmit={e => e.preventDefault()}>
                        <h3 id="add-work-title" className={styles.modalTitle}>
                            Add to work
                        </h3>

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
                                                checked={String(selectedWorkId) === String(w.id)}
                                                onChange={e => setSelectedWorkId(e.target.value)}
                                            />
                                            <span>{w.content}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className="primaryBtn"
                                onClick={handleAddToWork}
                                disabled={globalLoading || !selectedWorkId}
                            >
                                Add
                            </button>
                            <button type="button" onClick={closeAddModal}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </dialog>
            )}
        </main>
    );
}
