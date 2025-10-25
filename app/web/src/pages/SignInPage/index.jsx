import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../redux/auth/operations';
import { selectSignInLoading, selectSignInError, selectToken, selectUser } from '../../redux/auth/selectors';
import { resetSignIn } from '../../redux/auth/slice';

export default function SignInPage() {
    const titleId = useId();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector(selectSignInLoading);
    const error = useSelector(selectSignInError);
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);

    useEffect(() => {
        if (token) navigate('/', { replace: true });
    }, [token, navigate]);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);

        const email = fd.get('email')?.trim();
        const password = fd.get('password') || '';

        const action = await dispatch(signIn({ email, password }));

        if (signIn.fulfilled.match(action)) {
            form.reset();
            navigate('/', { replace: true });
        }
    };

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Sign In</h1>

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading' : 'Sign In'}
                    </button>
                    <button type="button" onClick={() => dispatch(resetSignIn())} disabled={loading}>
                        Reset
                    </button>
                </div>
            </form>

            {error && <p role="alert">{error}</p>}
            {token && user && (
                <p aria-live="polite">
                    Signed in as <strong>{user.name ?? user.username ?? user.email}</strong>.
                </p>
            )}
        </main>
    );
}
