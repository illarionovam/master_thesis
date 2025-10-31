import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getLocations, createLocation } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsLoading, selectGetLocationsError } from '../../redux/locations/selectors';
import LocationModal from '../../components/LocationModal';

export default function LocationsPage() {
    const locations = useSelector(selectLocations);
    const navigate = useNavigate();

    return (
        <BulkPageLayout
            title="Locations"
            fetchAction={getLocations}
            selectData={selectLocations}
            selectLoading={selectGetLocationsLoading}
            selectError={selectGetLocationsError}
            render={items => <List items={items} />}
            CreateModal={LocationModal}
            createAction={createLocation}
            createModalProps={{ parentOptions: locations }}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) navigate(`/locations/${id}`);
            }}
        />
    );
}
