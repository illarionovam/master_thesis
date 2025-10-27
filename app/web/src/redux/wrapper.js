export default (apiCall, rejectWithValue) =>
    (...args) =>
        Promise.resolve(apiCall(...args))
            .then(res => res?.data ?? res)
            .catch(err => {
                const respData = err?.response?.data;
                const message =
                    respData?.message ??
                    (typeof respData === 'string' ? respData : respData?.error) ??
                    err?.message ??
                    'Unknown error';

                return rejectWithValue(message);
            });
