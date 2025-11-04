import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './CreateEventModal.module.css';

export default function CreateEventModal({
    open,
    onClose,
    onSubmit,
    submitting = false,
    error = null,
    locationOptions = [],
}) {
    const dialogRef = useRef(null);

    const [description, setDescription] = useState('');
    const [locationInWorkId, setLocationInWorkId] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setDescription('');
            setLocationInWorkId('');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    const isValid = useMemo(() => description.trim().length > 0, [description]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            setFormError('Description is required.');
            return;
        }
        setFormError(null);

        const payload = {
            description: description.trim(),
            location_in_work_id: locationInWorkId ? String(locationInWorkId) : null,
        };

        onSubmit?.(payload);
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="create-event-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 id="create-event-title" className={styles.title}>
                    Create Event
                </h2>

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
                        disabled={submitting}
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
                        disabled={submitting}
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
                    <button type="button" className={styles.ghostBtn} onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.primaryBtn} disabled={!isValid || submitting}>
                        {submitting ? 'Submitting...' : 'Create'}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
