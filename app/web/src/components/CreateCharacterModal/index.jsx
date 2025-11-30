import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styles from './CreateCharacterModal.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function CreateCharacterModal({ open, onClose, onSubmit, error = null }) {
    const dialogRef = useRef(null);

    const globalLoading = useSelector(selectGlobalLoading);

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
        <dialog ref={dialogRef} aria-labelledby="create-character-title" onClose={onClose}>
            <form onSubmit={handleSubmit} className="modal">
                <h2 id="create-character-title" className={styles.title}>
                    Create Character
                </h2>

                <div className="field">
                    <label htmlFor="ch-name" className="label">
                        Name *
                    </label>
                    <input
                        id="ch-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Name"
                        className="input"
                        disabled={globalLoading}
                    />
                </div>

                <div className="field">
                    <label htmlFor="ch-appearance" className="label">
                        Appearance *
                    </label>
                    <textarea
                        id="ch-appearance"
                        rows={5}
                        value={appearance}
                        onChange={e => setAppearance(e.target.value)}
                        required
                        placeholder="Short appearance description"
                        className="input textarea"
                        disabled={globalLoading}
                    />
                </div>

                <div className="field">
                    <label htmlFor="ch-personality" className="label">
                        Personality *
                    </label>
                    <textarea
                        id="ch-personality"
                        rows={5}
                        value={personality}
                        onChange={e => setPersonality(e.target.value)}
                        required
                        placeholder="Key personality traits"
                        className="input textarea"
                        disabled={globalLoading}
                    />
                </div>

                <div className="field">
                    <label htmlFor="ch-bio" className="label">
                        Bio *
                    </label>
                    <textarea
                        id="ch-bio"
                        rows={6}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        required
                        placeholder="Backstory"
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
