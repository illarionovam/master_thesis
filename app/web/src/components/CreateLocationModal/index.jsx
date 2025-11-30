import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateLocationModal.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function CreateLocationModal({ open, onClose, onSubmit, error = null, parentOptions = [] }) {
    const dialogRef = useRef(null);

    const globalLoading = useSelector(selectGlobalLoading);

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
        <dialog ref={dialogRef} aria-labelledby="create-location-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className="modal">
                <h2 id="create-location-title">Create Location</h2>

                <div className="field">
                    <label htmlFor="loc-title" className="label">
                        Title *
                    </label>
                    <input
                        id="loc-title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        placeholder="e.g., Northern Outpost"
                        className="input"
                        disabled={globalLoading}
                    />
                </div>

                <div className="field">
                    <label htmlFor="loc-parent" className="label">
                        Parent Location
                    </label>
                    <select
                        id="loc-parent"
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        className="input"
                        disabled={globalLoading}
                    >
                        <option value="">— None —</option>
                        {parentOptions.map(opt => (
                            <option key={String(opt.id)} value={String(opt.id)}>
                                {opt.content}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="loc-desc" className="label">
                        Description *
                    </label>
                    <textarea
                        id="loc-desc"
                        rows={5}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        placeholder="Short description..."
                        className="input textarea"
                        disabled={globalLoading}
                    />
                </div>

                {(formError || error) && (
                    <p role="alert" className="infoMessage error">
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
