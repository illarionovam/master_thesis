import { useEffect, useRef, useState } from 'react';

export default function ChangePasswordModal({ open, onClose, onSubmit, loading, apiError }) {
    const dialogRef = useRef(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    const [formError, setFormError] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();

        if (!currentPassword || !newPassword) return setFormError('Both fields are required');
        if (newPassword.length < 8) return setFormError('Min 8 characters');
        if (newPassword === currentPassword) return setFormError('Must differ from current');

        setFormError(null);
        onSubmit({ current_password: currentPassword, new_password: newPassword });
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="cp-title" onClose={onClose}>
            <form method="dialog" onSubmit={handleSubmit}>
                <h2 id="cp-title">Change Password</h2>

                <div>
                    <label>
                        <span>Current password</span>
                        <input
                            type="password"
                            name="current_password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    <label>
                        <span>New password</span>
                        <input
                            type="password"
                            name="new_password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                            minLength={8}
                        />
                    </label>
                    {formError && <p role="alert">{formError}</p>}
                    {apiError && <p role="alert">{apiError}</p>}
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        Submit
                    </button>
                    <button type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
