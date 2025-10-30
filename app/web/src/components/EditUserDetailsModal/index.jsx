import { useEffect, useRef, useState } from 'react';

export default function EditDetailsModal({ open, onClose, onSubmit, loading, apiError, initial }) {
    const dialogRef = useRef(null);
    const [username, setUsername] = useState(initial?.username ?? '');
    const [name, setName] = useState(initial?.name ?? '');
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (open) {
            dialogRef.current?.showModal?.();
            setUsername(initial?.username ?? '');
            setName(initial?.name ?? '');
            setFormError(null);
        } else {
            dialogRef.current?.close?.();
        }
    }, [open, initial?.username, initial?.name]);

    const handleSubmit = e => {
        e.preventDefault();
        setFormError(null);
        onSubmit?.({ username, name: (name ?? '').trim() || null });
    };

    return (
        <dialog ref={dialogRef} aria-labelledby="ed-title" onClose={onClose}>
            <form method="dialog" onSubmit={handleSubmit}>
                <h2 id="ed-title">Edit Details</h2>

                <div>
                    <label>
                        <span>Username</span>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </label>

                    <label>
                        <span>Name</span>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete="name"
                        />
                    </label>

                    {formError && <p role="alert">{formError}</p>}
                    {apiError && <p role="alert">{apiError.message ?? String(apiError)}</p>}
                </div>

                <div>
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
