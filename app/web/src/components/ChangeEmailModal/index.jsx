import { useEffect, useRef, useState } from 'react';

export default function ChangeEmailModal({ open, onClose, onSubmit, loading, apiError, initial }) {
    const dialogRef = useRef(null);
    const [email, setEmail] = useState(initial ?? '');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setEmail(initial ?? '');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open, initial]);

    const handleSubmit = e => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) return setFormError('Email is required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            return setFormError('Enter a valid email');
        }
        setFormError(null);
        onSubmit?.({ email: trimmed });
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="ce-title" onClose={onClose}>
            <form method="dialog" onSubmit={handleSubmit} style={{ minWidth: 360 }}>
                <h2 id="ce-title" style={{ marginTop: 0 }}>
                    Change Email
                </h2>

                <div style={{ display: 'grid', gap: 10 }}>
                    <label>
                        <span>New email</span>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>

                    {formError && <p role="alert">{formError}</p>}
                    {apiError && <p role="alert">{apiError.message ?? String(apiError)}</p>}
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                    <button type="submit" disabled={loading}>
                        Submit
                    </button>
                    <button type="button" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                </div>
            </form>
        </dialog>
    );
}
