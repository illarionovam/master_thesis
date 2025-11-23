import { useNavigate } from 'react-router-dom';
import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getLocations, createLocation } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsError } from '../../redux/locations/selectors';
import CreateLocationModal from '../../components/CreateLocationModal';

export default function LocationsPage() {
    const navigate = useNavigate();

    return (
        <BulkPageLayout
            title="Locations"
            fetchAction={getLocations}
            selectData={selectLocations}
            selectError={selectGetLocationsError}
            render={items => <List items={items} />}
            CreateModal={CreateLocationModal}
            createAction={createLocation}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) navigate(`/locations/${id}`);
            }}
        />
    );
}
