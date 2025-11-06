import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './CreateCharacterModal.module.css';

export default function CreateCharacterModal({ open, onClose, onSubmit, submitting = false, error = null }) {
    const dialogRef = useRef(null);

    const [name, setName] = useState('');
    const [appearance, setAppearance] = useState('');
    const [personality, setPersonality] = useState('');
    const [bio, setBio] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setName('');
            setAppearance('');
            setPersonality('');
            setBio('');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open]);

    const isValid = useMemo(() => {
        return (
            name.trim().length > 0 &&
            appearance.trim().length > 0 &&
            personality.trim().length > 0 &&
            bio.trim().length > 0
        );
    }, [name, appearance, personality, bio]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            setFormError('All fields are required.');
            return;
        }
        setFormError(null);

        const payload = {
            name: name.trim(),
            appearance: appearance.trim(),
            personality: personality.trim(),
            bio: bio.trim(),
        };

        onSubmit?.(payload);
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="create-character-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 id="create-character-title" className={styles.title}>
                    Create Character
                </h2>

                <div className={styles.field}>
                    <label htmlFor="ch-name" className={styles.label}>
                        Name *
                    </label>
                    <input
                        id="ch-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="e.g., Tyrel"
                        className={styles.input}
                        disabled={submitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="ch-appearance" className={styles.label}>
                        Appearance *
                    </label>
                    <textarea
                        id="ch-appearance"
                        rows={5}
                        value={appearance}
                        onChange={e => setAppearance(e.target.value)}
                        required
                        placeholder="Short appearance description..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={submitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="ch-personality" className={styles.label}>
                        Personality *
                    </label>
                    <textarea
                        id="ch-personality"
                        rows={5}
                        value={personality}
                        onChange={e => setPersonality(e.target.value)}
                        required
                        placeholder="Key personality traits..."
                        className={`${styles.input} ${styles.textarea}`}
                        disabled={submitting}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="ch-bio" className={styles.label}>
                        Bio *
                    </label>
                    <textarea
                        id="ch-bio"
                        rows={6}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        required
                        placeholder="Backstory / biography..."
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
                    <button type="button" className="ghostBtn" onClick={onClose} disabled={submitting}>
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
