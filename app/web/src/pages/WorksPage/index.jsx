import { useNavigate } from 'react-router-dom';
import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getWorks, createWork } from '../../redux/works/operations';
import { selectWorks, selectGetWorksError } from '../../redux/works/selectors';
import CreateWorkModal from '../../components/CreateWorkModal';

export default function WorksPage() {
    const navigate = useNavigate();

    return (
        <BulkPageLayout
            title="Works"
            fetchAction={getWorks}
            selectData={selectWorks}
            selectError={selectGetWorksError}
            render={items => <List items={items} />}
            CreateModal={CreateWorkModal}
            createAction={createWork}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) navigate(`/works/${id}`);
            }}
        />
    );
}
