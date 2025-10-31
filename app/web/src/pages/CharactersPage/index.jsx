import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getCharacters } from '../../redux/characters/operations';
import {
    selectCharacters,
    selectGetCharactersLoading,
    selectGetCharactersError,
} from '../../redux/characters/selectors';

export default function CharactersPage() {
    return (
        <BulkPageLayout
            title="Characters"
            fetchAction={getCharacters}
            selectData={selectCharacters}
            selectLoading={selectGetCharactersLoading}
            selectError={selectGetCharactersError}
            render={items => <List items={items} />}
        />
    );
}
