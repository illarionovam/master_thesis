import List from '../../components/List';
import BulkPage from '../BulkPage';

import { getLocations } from '../../redux/locations/operations';
import { selectLocations, selectGetLocationsLoading, selectGetLocationsError } from '../../redux/locations/selectors';

export default function LocationsPage() {
    return (
        <BulkPage
            title="Locations"
            fetchAction={getLocations}
            selectData={selectLocations}
            selectLoading={selectGetLocationsLoading}
            selectError={selectGetLocationsError}
            render={items => <List items={items} />}
        />
    );
}
