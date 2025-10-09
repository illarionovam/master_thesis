export const normalizeOptionalText = v => {
    if (v == null) return null;
    const val = String(v).trim();
    return val === '' ? null : val;
};
