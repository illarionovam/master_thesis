import { useMemo, useState } from 'react';

export default function CreateLocationModal({ open, onClose, onSubmit, submitting, error, parentOptions = [] }) {
    if (!open) return null;

    const [title, setTitle] = useState('');
    const [parentId, setParentId] = useState('');
    const [description, setDescription] = useState('');
    const [localError, setLocalError] = useState(null);

    const isValid = useMemo(() => title.trim().length > 0 && description.trim().length > 0, [title, description]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isValid) {
            setLocalError('Title and Description are required.');
            return;
        }
        setLocalError(null);

        onSubmit?.({
            title: title.trim(),
            description: description.trim(),
            ...(parentId ? { parent_location_id: parentId } : {}),
        });
    };

    return (
        <div role="dialog" aria-modal="true" style={overlay} onClick={onClose}>
            <div style={modal} onClick={e => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, marginBottom: 16 }}>Create Location</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: 12 }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Title *</span>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                placeholder="e.g., Northern Outpost"
                                style={input}
                            />
                        </label>

                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Parent Location</span>
                            <select value={parentId} onChange={e => setParentId(e.target.value)} style={input}>
                                <option value="">— None —</option>
                                {parentOptions.map(opt => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.content}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={{ display: 'grid', gap: 6 }}>
                            <span>Description *</span>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                                rows={4}
                                placeholder="Short description…"
                                style={{ ...input, resize: 'vertical' }}
                            />
                        </label>

                        {(localError || error) && <p style={{ color: '#b00020', margin: 0 }}>{localError || error}</p>}

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                            <button type="button" onClick={onClose} style={btnGhost} disabled={submitting}>
                                Cancel
                            </button>
                            <button type="submit" style={btnPrimary} disabled={!isValid || submitting}>
                                {submitting ? 'Submitting…' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const overlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 16,
};

const modal = {
    background: '#fff',
    borderRadius: 12,
    width: 'min(520px, 100%)',
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
};

const input = {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #ccc',
    outline: 'none',
};

const btnPrimary = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
};

const btnGhost = {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #ccc',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
};
