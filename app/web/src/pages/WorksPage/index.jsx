import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/List';

import { getWorks } from '../../redux/works/operations';
import { selectWorks, selectGetWorksLoading, selectGetWorksError } from '../../redux/works/selectors';

export default function CharactersPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const items = useSelector(selectWorks);
    const loading = useSelector(selectGetWorksLoading);
    const error = useSelector(selectGetWorksError);

    useEffect(() => {
        dispatch(getWorks());
    }, [dispatch]);

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Works</h1>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && <List items={items} />}
        </main>
    );
}
