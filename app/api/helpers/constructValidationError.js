export const constructValidationError = err => {
    const messages = (err.errors || []).map(e => e?.message).filter(Boolean);
    return [...new Set(messages.map(s => s.trim()))].join('; ');
};
