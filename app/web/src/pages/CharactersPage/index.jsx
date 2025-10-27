import List from '../../components/List';
import BulkPage from '../BulkPage';

import { getCharacters } from '../../redux/characters/operations';
import {
    selectCharacters,
    selectGetCharactersLoading,
    selectGetCharactersError,
} from '../../redux/characters/selectors';

export default function CharactersPage() {
    return (
        <BulkPage
            title="Characters"
            fetchAction={getCharacters}
            selectData={selectCharacters}
            selectLoading={selectGetCharactersLoading}
            selectError={selectGetCharactersError}
            render={items => <List items={items} />}
        />
    );
}
