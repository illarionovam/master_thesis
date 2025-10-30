import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import List from '../../components/List';
import BulkPage from '../BulkPage';

import { getLocations, createLocation } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsLoading, selectGetLocationsError } from '../../redux/locations/selectors';
import CreateLocationModal from '../../components/CreateLocationModal';

export default function LocationsPage() {
    const locations = useSelector(selectLocations);
    const navigate = useNavigate();

    return (
        <BulkPage
            title="Locations"
            fetchAction={getLocations}
            selectData={selectLocations}
            selectLoading={selectGetLocationsLoading}
            selectError={selectGetLocationsError}
            render={items => <List items={items} />}
            CreateModal={CreateLocationModal}
            createAction={createLocation}
            createModalProps={{ parentOptions: locations }}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) navigate(`/locations/${id}`);
            }}
        />
    );
}
