import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPassword } from '../../redux/auth/operations';
import {
    selectConfirmPasswordLoading,
    selectConfirmPasswordError,
    selectConfirmPasswordSuccess,
} from '../../redux/auth/selectors';
import styles from './ResetPasswordPage.module.css';

export default function ResetPasswordPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const loading = useSelector(selectConfirmPasswordLoading);
    const error = useSelector(selectConfirmPasswordError);
    const success = useSelector(selectConfirmPasswordSuccess);

    const [token, setToken] = useState('');

    useEffect(() => {
        let t = window.location.hash ? window.location.hash.slice(1) : '';
        setToken(t);
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const new_password = (fd.get('new_password') || '').toString();
        if (!new_password || !token) return;
        dispatch(confirmPassword({ token, new_password }));
        e.currentTarget.reset();
    };

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId} className={styles.title}>
                Reset Password
            </h1>

            <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="new_password" className={styles.label}>
                        New password
                    </label>
                    <input
                        id="new_password"
                        name="new_password"
                        type="password"
                        autoComplete="new-password"
                        required
                        disabled={loading || !token}
                        className={styles.input}
                    />
                </div>

                <div className={styles.actions}>
                    <button type="submit" disabled={loading || !token} className={styles.primaryBtn}>
                        {loading ? 'Submitting...' : 'Set New Password'}
                    </button>
                </div>
            </form>

            {success && (
                <p aria-live="polite" className={styles.success}>
                    Password changed.
                </p>
            )}
            {error && (
                <p role="alert" className={styles.error}>
                    {error}
                </p>
            )}
        </main>
    );
}
