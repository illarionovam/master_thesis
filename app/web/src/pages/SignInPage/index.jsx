import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../redux/auth/operations';
import { resetSignIn } from '../../redux/auth/slice';
import { selectSignInLoading, selectSignInError, selectToken, selectUser } from '../../redux/auth/selectors';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import VerifyEmailModal from '../../components/VerifyEmailModal';
import styles from './SignInPage.module.css';

export default function SignInPage() {
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const loading = useSelector(selectSignInLoading);
    const error = useSelector(selectSignInError);
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false); // State for VerifyEmailModal

    useEffect(() => {
        if (!token) return;
        const backTo = location.state?.from?.pathname || '/';
        navigate(backTo, { replace: true });
    }, [token, navigate, location]);

    const handleSubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = fd.get('email')?.trim();
        const password = fd.get('password') || '';
        dispatch(signIn({ email, password }));
    };

    const openResetPasswordModal = () => {
        setIsResetPasswordModalOpen(true);
    };

    const closeResetPasswordModal = () => {
        setIsResetPasswordModalOpen(false);
    };

    const openVerifyEmailModal = () => {
        setIsVerifyEmailModalOpen(true);
    };

    const closeVerifyEmailModal = () => {
        setIsVerifyEmailModalOpen(false);
    };

    return (
        <main aria-labelledby={titleId} className="page centered">
            <section className={styles.card} aria-busy={loading ? 'true' : 'false'}>
                <h1 id={titleId} className={styles.title}>
                    Sign In
                </h1>

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
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

                    <div className={styles.actions}>
                        <button type="submit" disabled={loading} className="primaryBtn">
                            {loading ? 'Loading...' : 'Sign In'}
                        </button>
                        <button type="button" onClick={() => dispatch(resetSignIn())} disabled={loading}>
                            Reset
                        </button>
                    </div>

                    <p className={styles.meta}>
                        No account?{' '}
                        <Link to="/sign-up" className={styles.link}>
                            Sign Up
                        </Link>
                    </p>

                    <p className={styles.meta}>
                        <button type="button" className={styles.link} onClick={openResetPasswordModal}>
                            Forgot password?
                        </button>
                    </p>

                    <p className={styles.meta}>
                        <button type="button" className={styles.link} onClick={openVerifyEmailModal}>
                            Resend verification email?
                        </button>
                    </p>

                    {token && user && (
                        <p aria-live="polite" className={styles.success}>
                            Signed in as <strong>{user.name ?? user.username ?? user.email}</strong>.
                        </p>
                    )}
                </form>
            </section>
            {isResetPasswordModalOpen && <ResetPasswordModal onClose={closeResetPasswordModal} />}
            {isVerifyEmailModalOpen && <VerifyEmailModal onClose={closeVerifyEmailModal} />}{' '}
        </main>
    );
}
