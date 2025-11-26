import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateEventModal.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function CreateEventModal({ open, onClose, onSubmit, error = null, locationOptions = [] }) {
    const dialogRef = useRef(null);

    const globalLoading = useSelector(selectGlobalLoading);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [locationInWorkId, setLocationInWorkId] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setTitle('');
            setDescription('');
            setLocationInWorkId('');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    const isValid = useMemo(
        () => title.trim().length > 0 && title.trim().length <= 100 && description.trim().length > 0,
        [title, description]
    );

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            if (!title.trim()) return setFormError('Title is required.');
            if (title.trim().length > 100) return setFormError('Title must be at most 100 characters.');
            if (!description.trim()) return setFormError('Description is required.');
        }
        setFormError(null);

        const payload = {
            title: title.trim(),
            description: description.trim(),
            location_in_work_id: locationInWorkId ? String(locationInWorkId) : null,
        };

        onSubmit?.(payload);
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="create-event-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 id="create-event-title" className={styles.title}>
                    Create Event
                </h2>

                <div className={styles.field}>
                    <label htmlFor="ev-title" className={styles.label}>
                        Title *
                    </label>
                    <input
                        id="ev-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Caravan arrives"
                        className={styles.input}
                        disabled={globalLoading}
                        required
                        maxLength={100}
                        aria-describedby="ev-title-hint"
                    />
                    <small id="ev-title-hint" className={styles.hint}>
                        {Math.max(0, 100 - title.length)} characters left
                    </small>
                </div>

                <div className={styles.field}>
                    <label htmlFor="ev-desc" className={styles.label}>
                        Description *
                    </label>
                    <textarea
                        id="ev-desc"
                        rows={5}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        placeholder="Short description of the event..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={globalLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="ev-location" className={styles.label}>
                        Location (in this work)
                    </label>
                    <select
                        id="ev-location"
                        value={locationInWorkId}
                        onChange={e => setLocationInWorkId(e.target.value)}
                        className={styles.input}
                        disabled={globalLoading}
                    >
                        <option value="">— None —</option>
                        {locationOptions.map(opt => (
                            <option key={String(opt.id)} value={String(opt.id)}>
                                {opt.content ?? opt.title ?? `#${opt.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                {(formError || error) && (
                    <p role="alert" className={styles.error}>
                        {formError || error}
                    </p>
                )}

                <div className={styles.actions}>
                    <button type="button" onClick={onClose} disabled={globalLoading}>
                        Cancel
                    </button>
                    <button type="submit" className="primaryBtn" disabled={!isValid || globalLoading}>
                        Create
                    </button>
                </div>
            </form>
        </dialog>
    );
}
