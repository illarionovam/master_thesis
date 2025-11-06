import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './CreateLocationModal.module.css';

export default function CreateLocationModal({
    open,
    onClose,
    onSubmit,
    submitting = false,
    error = null,
    parentOptions = [],
}) {
    const dialogRef = useRef(null);

    const [title, setTitle] = useState('');
    const [parentId, setParentId] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setTitle('');
            setParentId('');
            setDescription('');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    const isValid = useMemo(() => title.trim().length > 0 && description.trim().length > 0, [title, description]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            setFormError('Title and Description are required.');
            return;
        }
        setFormError(null);

        const payload = {
            title: title.trim(),
            description: description.trim(),
            parent_location_id: parentId ? String(parentId) : null,
        };

        onSubmit?.(payload);
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="create-location-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 id="create-location-title" className={styles.title}>
                    Create Location
                </h2>

                <div className={styles.field}>
                    <label htmlFor="loc-title" className={styles.label}>
                        Title *
                    </label>
                    <input
                        id="loc-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="e.g., Northern Outpost"
                        className={styles.input}
                        disabled={submitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="loc-parent" className={styles.label}>
                        Parent Location
                    </label>
                    <select
                        id="loc-parent"
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        className={styles.input}
                        disabled={submitting}
                    >
                        <option value="">— None —</option>
                        {parentOptions.map(opt => (
                            <option key={String(opt.id)} value={String(opt.id)}>
                                {opt.content}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.field}>
                    <label htmlFor="loc-desc" className={styles.label}>
                        Description *
                    </label>
                    <textarea
                        id="loc-desc"
                        rows={5}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        placeholder="Short description..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={submitting}
                    />
                </div>

                {(formError || error) && (
                    <p role="alert" className={styles.error}>
                        {formError || error}
                    </p>
                )}

                <div className={styles.actions}>
                    <button type="button" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button type="submit" className="primaryBtn" disabled={!isValid || submitting}>
                        {submitting ? 'Submitting...' : 'Create'}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
