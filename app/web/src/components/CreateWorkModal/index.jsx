import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateWorkModal.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function CreateWorkModal({ open, onClose, onSubmit, error = null }) {
    const dialogRef = useRef(null);

    const globalLoading = useSelector(selectGlobalLoading);

    const [title, setTitle] = useState('');
    const [annotation, setAnnotation] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setTitle('');
            setAnnotation('');
            setSynopsis('');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    const isValid = useMemo(() => title.trim().length > 0, [title]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            setFormError('Title is required.');
            return;
        }
        setFormError(null);

        const payload = {
            title: title.trim(),
            annotation: annotation.trim() || null,
            synopsis: synopsis.trim() || null,
        };

        onSubmit?.(payload);
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="create-work-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 id="create-work-title" className={styles.title}>
                    Create Work
                </h2>

                <div className={styles.field}>
                    <label htmlFor="work-title" className={styles.label}>
                        Title *
                    </label>
                    <input
                        id="work-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="e.g., The Ashen Caravan"
                        className={styles.input}
                        disabled={globalLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="work-annotation" className={styles.label}>
                        Annotation
                    </label>
                    <textarea
                        id="work-annotation"
                        rows={3}
                        value={annotation}
                        onChange={e => setAnnotation(e.target.value)}
                        placeholder="One-two sentences summary..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={globalLoading}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="work-synopsis" className={styles.label}>
                        Synopsis
                    </label>
                    <textarea
                        id="work-synopsis"
                        rows={8}
                        value={synopsis}
                        onChange={e => setSynopsis(e.target.value)}
                        placeholder="Extended outline, key beats, arcs..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={globalLoading}
                    />
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
