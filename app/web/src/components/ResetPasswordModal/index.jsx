import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/auth/operations';
import {
    selectResetPasswordLoading,
    selectResetPasswordError,
    selectResetPasswordSuccess,
} from '../../redux/auth/selectors';
import styles from './ResetPasswordModal.module.css';

export default function ResetPasswordModal({ onClose }) {
    const dispatch = useDispatch();
    const loading = useSelector(selectResetPasswordLoading);
    const error = useSelector(selectResetPasswordError);
    const success = useSelector(selectResetPasswordSuccess);

    const [email, setEmail] = useState('');
    const dialogRef = useRef(null);

    useEffect(() => {
        const dlg = dialogRef.current;
        if (dlg && typeof dlg.showModal === 'function' && !dlg.open) {
            dlg.showModal();
        }
    }, []);

    const handleCancel = e => {
        e?.preventDefault?.();
        if (!loading) onClose?.();
    };

    const handleSubmit = e => {
        e.preventDefault();
        const emailTrim = email.trim();
        if (!emailTrim) return;
        dispatch(resetPassword({ email: emailTrim }));
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="reset-title" onCancel={handleCancel}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <h2 id="reset-title" className={styles.title}>
                    Reset Password
                </h2>

                <div className={styles.field}>
                    <label htmlFor="reset-email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="reset-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className={styles.input}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p role="alert" className={styles.error}>
                        {error}
                    </p>
                )}
                {success && <p className={styles.success}>Reset link sent. Check your email!</p>}

                <div className={styles.actions}>
                    <button type="submit" className="primaryBtn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Reset'}
                    </button>
                    <button type="button" className="ghostBtn" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
