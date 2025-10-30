import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Title from '../../components/Title';
import LocationModal from '../../components/LocationModal';
import { getLocation, updateLocation, getLocations } from '../../redux/locations/operations';
import {
    selectLocation,
    selectGetLocationLoading,
    selectGetLocationError,
    selectLocations,
    selectUpdateLocationLoading,
    selectUpdateLocationError,
} from '../../redux/locations/selectors';

export default function LocationDetailsPage() {
    const { id } = useParams();
    const titleId = useId();
    const dispatch = useDispatch();

    const location = useSelector(selectLocation);
    const loading = useSelector(selectGetLocationLoading);
    const error = useSelector(selectGetLocationError);

    const parentOptions = useSelector(selectLocations); // [{id, content}]
    const updateLoading = useSelector(selectUpdateLocationLoading);
    const updateError = useSelector(selectUpdateLocationError);

    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        if (id) dispatch(getLocation(id));
        dispatch(getLocations());
    }, [dispatch, id]);

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleSubmitEdit = async data => {
        const res = await dispatch(updateLocation({ id, data }));
        if (updateLocation.fulfilled.match(res)) {
            setOpenEdit(false);
        }
    };

    return (
        <main aria-labelledby={titleId}>
            <div>
                <Title id={titleId}>Location details</Title>
                {!loading && !error && location && (
                    <button type="button" onClick={handleOpenEdit} aria-label="Edit location" title="Edit">
                        Edit
                    </button>
                )}
            </div>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && location && (
                <div>
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

            <LocationModal
                open={openEdit}
                mode="update"
                initialValues={{
                    id: location?.id,
                    title: location?.title ?? '',
                    description: location?.description ?? '',
                    parent_location_id: location?.parent_location_id ?? '',
                }}
                onClose={handleCloseEdit}
                onSubmit={handleSubmitEdit}
                submitting={updateLoading}
                error={updateError}
                parentOptions={parentOptions}
            />
        </main>
    );
}
