export const handleErrors = (err, req, res, next) => {
    const message = err.message || 'Internal Error';
    res.status(err.status || 500).json({ message });
};
