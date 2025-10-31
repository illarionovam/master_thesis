import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getWorks } from '../../redux/works/operations';
import { selectWorks, selectGetWorksLoading, selectGetWorksError } from '../../redux/works/selectors';

export default function WorksPage() {
    return (
        <BulkPageLayout
            title="Works"
            fetchAction={getWorks}
            selectData={selectWorks}
            selectLoading={selectGetWorksLoading}
            selectError={selectGetWorksError}
            render={items => <List items={items} />}
        />
    );
}
