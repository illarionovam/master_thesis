import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Title from '../../components/Title';
import { getLocation } from '../../redux/locations/operations';
import { selectLocation, selectGetLocationLoading, selectGetLocationError } from '../../redux/locations/selectors';

export default function LocationDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();

    const location = useSelector(selectLocation);
    const loading = useSelector(selectGetLocationLoading);
    const error = useSelector(selectGetLocationError);

    useEffect(() => {
        if (id) dispatch(getLocation(id));
    }, [dispatch, id]);

    return (
        <main aria-labelledby={titleId} style={{ display: 'grid', gap: 12 }}>
            <Title id={titleId}>Location details</Title>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && location && (
                <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                        <strong>Title:</strong> {location.title ?? '—'}
                    </div>
                    <div>
                        <strong>Description:</strong> {location.description ?? '—'}
                    </div>
                    <div>
                        <strong>Parent Location:</strong> {location.parent?.title ?? '—'}
                    </div>
                </div>
            )}
        </main>
    );
}
