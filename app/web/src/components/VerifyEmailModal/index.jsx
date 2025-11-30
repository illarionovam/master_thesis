import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../redux/auth/operations';
import styles from './VerifyEmailModal.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function VerifyEmailModal({ onClose }) {
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

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
        onClose?.();
    };

    const handleSubmit = e => {
        e.preventDefault();
        const emailTrim = email.trim();
        if (!emailTrim) return;
        onClose?.();
        dispatch(verifyEmail({ email: emailTrim }));
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="verify-title" onCancel={handleCancel}>
            <form onSubmit={handleSubmit} className="modal" noValidate>
                <h2 id="verify-title">Verify Email</h2>

                <div className="field">
                    <label htmlFor="verify-email" className="label">
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
                        className="input"
                        disabled={globalLoading}
                    />
                </div>

                <div className={styles.actions}>
                    <button type="submit" className="primaryBtn" disabled={globalLoading}>
                        Verify
                    </button>
                    <button type="button" onClick={handleCancel} disabled={globalLoading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
