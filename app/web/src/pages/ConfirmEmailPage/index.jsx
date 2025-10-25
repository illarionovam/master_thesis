import { useEffect, useId, useState } from 'react';
import axios from 'axios';

export default function ConfirmEmailPage() {
    const titleId = useId();
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    useEffect(() => {
        const confirm = async () => {
            let token = window.location.hash ? window.location.hash.slice(1) : '';

            if (!token) {
                setStatus('error');
                setError('Missing token in URL hash.');
                return;
            }

            setStatus('loading');

            try {
                // Використовуємо "axios" напряму, аби інтерсептор не підмінив Authorization
                await axios.post(
                    '/api/auth/confirm-email',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setStatus('success');
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

        confirm();
    }, []);

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Confirm Email</h1>

            {status === 'loading' && <p aria-live="polite">Confirming email...</p>}
            {status === 'success' && <p aria-live="polite">Email is verified.</p>}
            {status === 'error' && <p role="alert">{error}</p>}
        </main>
    );
}
