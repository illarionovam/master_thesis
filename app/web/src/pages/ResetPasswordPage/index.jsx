import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPassword } from '../../redux/auth/operations';
import { selectConfirmPasswordError } from '../../redux/auth/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';
import styles from './ResetPasswordPage.module.css';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const globalLoading = useSelector(selectGlobalLoading);

    const error = useSelector(selectConfirmPasswordError);

    const [token, setToken] = useState('');

    useEffect(() => {
        let t = window.location.hash ? window.location.hash.slice(1) : '';
        setToken(t);
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const new_password = (fd.get('new_password') || '').toString();
        if (!new_password || !token) return;
        await dispatch(confirmPassword({ token, new_password }));
        e.currentTarget.reset();
        navigate('/');
    };

    return (
        <main aria-labelledby={titleId} className="page centered">
            {!globalLoading && (
                <section className="card narrow" aria-busy={globalLoading ? 'true' : 'false'}>
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
                                disabled={globalLoading || !token}
                                className={styles.input}
                            />
                        </div>

                        {error && (
                            <p role="alert" className={styles.error}>
                                {error}
                            </p>
                        )}

                        <div className={styles.actions}>
                            <button type="submit" disabled={globalLoading || !token} className="primaryBtn">
                                Set New Password
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </main>
    );
}
