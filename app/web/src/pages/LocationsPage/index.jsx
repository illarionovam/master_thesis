import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/List';

import { getLocations } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsLoading, selectGetLocationsError } from '../../redux/locations/selectors';

export default function CharactersPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const items = useSelector(selectLocations);
    const loading = useSelector(selectGetLocationsLoading);
    const error = useSelector(selectGetLocationsError);

    useEffect(() => {
        dispatch(getLocations());
    }, [dispatch]);

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Locations</h1>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && <List items={items} />}
        </main>
    );
}
