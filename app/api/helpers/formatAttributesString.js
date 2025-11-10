export const formatAttributesString = attributes => {
    if (attributes != null) {
        return Object.entries(attributes)
            .filter(([, v]) => v !== null && v !== undefined)
            .map(([k, v]) => `${k}: ${v}`)
            .join('. ')
            .trim();
    }
    return null;
};
