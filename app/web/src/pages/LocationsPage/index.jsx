import { useNavigate } from 'react-router-dom';
import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getLocations, createLocation } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsLoading, selectGetLocationsError } from '../../redux/locations/selectors';
import CreateLocationModal from '../../components/CreateLocationModal';
import { resetLocation } from '../../redux/locations/slice';
import { useDispatch } from 'react-redux';

export default function LocationsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <BulkPageLayout
            title="Locations"
            fetchAction={getLocations}
            selectData={selectLocations}
            selectLoading={selectGetLocationsLoading}
            selectError={selectGetLocationsError}
            render={items => <List items={items} />}
            CreateModal={CreateLocationModal}
            createAction={createLocation}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) {
                    dispatch(resetLocation());
                    navigate(`/locations/${id}`);
                }
            }}
        />
    );
}
