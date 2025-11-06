import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../redux/auth/operations';
import { selectVerifyEmailLoading, selectVerifyEmailError, selectVerifyEmailSuccess } from '../../redux/auth/selectors';
import styles from './VerifyEmailModal.module.css';

export default function VerifyEmailModal({ onClose }) {
    const dispatch = useDispatch();
    const loading = useSelector(selectVerifyEmailLoading);
    const error = useSelector(selectVerifyEmailError);
    const success = useSelector(selectVerifyEmailSuccess);

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
        dispatch(verifyEmail({ email: emailTrim }));
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="verify-title" onCancel={handleCancel}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <h2 id="verify-title" className={styles.title}>
                    Verify Email
                </h2>

                <div className={styles.field}>
                    <label htmlFor="verify-email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="verify-email"
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
                {success && <p className={styles.success}>Verification link sent. Check your email!</p>}

                <div className={styles.actions}>
                    <button type="submit" className="primaryBtn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Verify'}
                    </button>
                    <button type="button" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
