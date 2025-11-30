import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../redux/auth/operations';
import { resetSignIn } from '../../redux/auth/slice';
import {
    selectSignInError,
    selectToken,
    selectVerifyEmailError,
    selectResetPasswordError,
} from '../../redux/auth/selectors';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import VerifyEmailModal from '../../components/VerifyEmailModal';
import styles from './SignInPage.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function SignInPage() {
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const globalLoading = useSelector(selectGlobalLoading);

    const token = useSelector(selectToken);

    const error = useSelector(selectSignInError);
    const verifyEmailError = useSelector(selectVerifyEmailError);
    const resetPasswordError = useSelector(selectResetPasswordError);

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isVerifyEmailModalOpen, setIsVerifyEmailModalOpen] = useState(false);

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
            {!globalLoading && (
                <section className="card narrow" aria-busy={globalLoading ? 'true' : 'false'}>
                    <h1 id={titleId} className={styles.title}>
                        Sign In
                    </h1>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field">
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="input"
                                disabled={globalLoading}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input"
                                disabled={globalLoading}
                            />
                        </div>

                        {error && (
                            <p role="alert" className="infoMessage error">
                                {error}
                            </p>
                        )}

                        {verifyEmailError && (
                            <p role="alert" className="infoMessage error">
                                {verifyEmailError}
                            </p>
                        )}

                        {resetPasswordError && (
                            <p role="alert" className="infoMessage error">
                                {resetPasswordError}
                            </p>
                        )}

                        <div className={styles.actions}>
                            <button type="submit" disabled={globalLoading} className="primaryBtn">
                                Sign In
                            </button>
                            <button type="button" onClick={() => dispatch(resetSignIn())} disabled={globalLoading}>
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
                    </form>
                </section>
            )}
            {isResetPasswordModalOpen && <ResetPasswordModal onClose={closeResetPasswordModal} />}
            {isVerifyEmailModalOpen && <VerifyEmailModal onClose={closeVerifyEmailModal} />}{' '}
        </main>
    );
}
