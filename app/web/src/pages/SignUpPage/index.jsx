import { useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signUp } from '../../redux/auth/operations';
import { selectSignUpError, selectSignUpSuccess } from '../../redux/auth/selectors';
import { resetSignUp } from '../../redux/auth/slice';
import styles from './SignUpPage.module.css';
import { selectGlobalLoading } from '../../redux/globalSelectors';

export default function SignUpPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

    const success = useSelector(selectSignUpSuccess);

    const error = useSelector(selectSignUpError);

    const [mismatch, setMismatch] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);

        const name = fd.get('name')?.trim() || '';
        const username = fd.get('username')?.trim() || '';
        const email = fd.get('email')?.trim();
        const password = fd.get('password') || '';
        const passwordConfirm = fd.get('passwordConfirm') || '';

        if (password !== passwordConfirm) {
            setMismatch('Passwords do not match.');
            return;
        }

        const action = await dispatch(signUp({ name, username, email, password }));
        if (signUp.fulfilled.match(action)) {
            form.reset();
        }
    };

    const clearLocalValidation = () => {
        if (mismatch) setMismatch('');
    };

    return (
        <main aria-labelledby={titleId} className="page centered">
            {!globalLoading && (
                <section className="card narrow" aria-busy={globalLoading ? 'true' : 'false'}>
                    <h1 id={titleId} className={styles.title}>
                        Sign Up
                    </h1>

                    <form onSubmit={handleSubmit} noValidate className={styles.form} onInput={clearLocalValidation}>
                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                className={styles.input}
                                disabled={globalLoading}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                className={styles.input}
                                disabled={globalLoading}
                            />
                        </div>

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
                                disabled={globalLoading}
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
                                autoComplete="new-password"
                                required
                                className={styles.input}
                                disabled={globalLoading}
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="passwordConfirm" className={styles.label}>
                                Confirm password
                            </label>
                            <input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={styles.input}
                                disabled={globalLoading}
                            />
                        </div>

                        {(mismatch || error) && (
                            <p role="alert" className={styles.error}>
                                {mismatch || error}
                            </p>
                        )}

                        {success && (
                            <p aria-live="polite" className={styles.success}>
                                Verify email before signing in.
                            </p>
                        )}

                        <div className={styles.actions}>
                            <button type="submit" disabled={globalLoading} className="primaryBtn">
                                Sign Up
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMismatch('');
                                    dispatch(resetSignUp());
                                }}
                                disabled={globalLoading}
                            >
                                Reset
                            </button>
                        </div>

                        <p className={styles.meta}>
                            Already have an account?{' '}
                            <Link to="/sign-in" className={styles.link}>
                                Sign In
                            </Link>
                        </p>
                    </form>
                </section>
            )}
        </main>
    );
}
