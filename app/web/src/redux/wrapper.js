export default (apiCall, rejectWithValue) => async args => {
    try {
        const res = await apiCall(args);
        return res?.data ?? res;
    } catch (err) {
        const status = err?.response?.status;
        const payload =
            err?.response?.data?.message ??
            (typeof err?.response?.data === 'string' ? err.response.data : err?.response?.data?.error) ??
            err?.message ??
            'Unknown error';

        return rejectWithValue({ message: payload, status });
    }
};
