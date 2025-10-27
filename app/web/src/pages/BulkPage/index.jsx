import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../components/Title';

export default function DataPage({ title, fetchAction, selectData, selectLoading, selectError, render }) {
    const titleId = useId();
    const dispatch = useDispatch();

    const data = useSelector(selectData);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchAction());
    }, [dispatch, fetchAction]);

    return (
        <main aria-labelledby={titleId}>
            <Title id={titleId}>{title}</Title>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && render?.(data)}
        </main>
    );
}
