import { useEffect, useRef, useState } from 'react';
import styles from './ChangePasswordModal.module.css';

export default function ChangePasswordModal({ open, onClose, onSubmit, loading, apiError }) {
    const dialogRef = useRef(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
        } else {
            dialogRef.current?.close?.();
            setCurrentPassword('');
            setNewPassword('');
            setFormError(null);
        }
    }, [open]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!currentPassword || !newPassword) return setFormError('Both fields are required');
        if (newPassword.length < 8) return setFormError('Min 8 characters');
        if (newPassword === currentPassword) return setFormError('Must differ from current');
        setFormError(null);
        onSubmit({ current_password: currentPassword, new_password: newPassword });
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="cp-title" onClose={onClose} className={styles.dialog}>
            <form method="dialog" onSubmit={handleSubmit} className={styles.body} noValidate>
                <h2 id="cp-title" className={styles.title}>
                    Change Password
                </h2>

                <div className={styles.fields}>
                    <label className={styles.field}>
                        <span className={styles.label}>Current password</span>
                        <input
                            type="password"
                            name="current_password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className={styles.input}
                            disabled={loading}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>New password</span>
                        <input
                            type="password"
                            name="new_password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className={styles.input}
                            disabled={loading}
                        />
                    </label>

                    {(formError || apiError) && (
                        <p role="alert" className={styles.error}>
                            {formError || apiError}
                        </p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={loading} className="primaryBtn">
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
