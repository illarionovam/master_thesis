import { useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../redux/auth/operations';
import { selectSignUpLoading, selectSignUpError, selectSignUpResult } from '../../redux/auth/selectors';
import { resetSignUp } from '../../redux/auth/slice';

export default function SignUpPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const loading = useSelector(selectSignUpLoading);
    const error = useSelector(selectSignUpError);
    const result = useSelector(selectSignUpResult);

    const [mismatch, setMismatch] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        const form = e.currentTarget;
        const fd = new FormData(form);

        const name = fd.get('name')?.trim();
        const username = fd.get('username')?.trim();
        const email = fd.get('email')?.trim();
        const password = fd.get('password') || '';
        const passwordConfirm = fd.get('passwordConfirm') || '';

        if (password !== passwordConfirm) {
            setMismatch('Passwords do note match.');
            return;
        }

        const action = await dispatch(signUp({ name, username, email, password }));

        if (signUp.fulfilled.match(action)) {
            form.reset();
        }
    };

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Sign Up</h1>

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" autoComplete="name" />
                </div>

                <div>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" autoComplete="username" />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" autoComplete="new-password" required />
                </div>

                <div>
                    <label htmlFor="passwordConfirm">Confirm password</label>
                    <input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading' : 'Sign Up'}
                    </button>
                    <button type="button" onClick={() => dispatch(resetSignUp())} disabled={loading}>
                        Reset
                    </button>
                </div>
            </form>

            {mismatch && <p role="alert">{mismatch}</p>}
            {error && <p role="alert">{error}</p>}
            {result && <p aria-live="polite">Verify email before signing in.</p>}
        </main>
    );
}
