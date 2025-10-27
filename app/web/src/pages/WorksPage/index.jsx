import List from '../../components/List';
import BulkPage from '../BulkPage';

import { getWorks } from '../../redux/works/operations';
import { selectWorks, selectGetWorksLoading, selectGetWorksError } from '../../redux/works/selectors';

export default function WorksPage() {
    return (
        <BulkPage
            title="Works"
            fetchAction={getWorks}
            selectData={selectWorks}
            selectLoading={selectGetWorksLoading}
            selectError={selectGetWorksError}
            render={items => <List items={items} />}
        />
    );
}
