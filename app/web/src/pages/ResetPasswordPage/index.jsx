import { useEffect, useId, useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
    const titleId = useId();
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        let token = window.location.hash ? window.location.hash.slice(1) : '';

        if (!token) {
            setStatus('error');
            setError('Missing token in URL hash.');
        } else {
            setToken(token);
        }
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!token) return;

        const fd = new FormData(e.currentTarget);
        const new_password = (fd.get('new_password') || '').toString();

        if (!new_password) {
            setStatus('error');
            setError('New password is required.');
            return;
        }

        setStatus('loading');
        setError('');

        try {
            // Використовуємо "axios" напряму, аби інтерсептор не підмінив Authorization
            await axios.post(
                '/api/auth/confirm-password',
                { new_password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setStatus('success');
            e.currentTarget.reset();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                (typeof err?.response?.data === 'string' ? err.response.data : null) ||
                err?.message ||
                'Unknown error';
            setError(msg);
            setStatus('error');
        }
    };

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Reset Password</h1>

            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="new_password">New password</label>
                    <input
                        id="new_password"
                        name="new_password"
                        type="password"
                        autoComplete="new-password"
                        required
                        disabled={status === 'loading' || !token}
                    />
                </div>

                <div>
                    <button type="submit" disabled={status === 'loading' || !token}>
                        {status === 'loading' ? 'Submitting...' : 'Set New Password'}
                    </button>
                </div>
            </form>

            {status === 'success' && <p aria-live="polite">Password changed.</p>}
            {status === 'error' && error && <p role="alert">{error}</p>}
        </main>
    );
}
