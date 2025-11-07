import { useNavigate } from 'react-router-dom';

import List from '../../components/List';
import BulkPageLayout from '../../layouts/BulkPageLayout';

import { getCharacters, createCharacter } from '../../redux/characters/operations';
import {
    selectCharacters,
    selectGetCharactersLoading,
    selectGetCharactersError,
} from '../../redux/characters/selectors';

import { resetCharacter } from '../../redux/characters/slice';

import CreateCharacterModal from '../../components/CreateCharacterModal';
import { useDispatch } from 'react-redux';

export default function CharactersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <BulkPageLayout
            title="Characters"
            fetchAction={getCharacters}
            selectData={selectCharacters}
            selectLoading={selectGetCharactersLoading}
            selectError={selectGetCharactersError}
            render={items => <List items={items} />}
            CreateModal={CreateCharacterModal}
            createAction={createCharacter}
            onCreated={created => {
                const id = typeof created === 'object' ? created?.id : created;
                if (id) {
                    dispatch(resetCharacter());
                    navigate(`/characters/${id}`);
                }
            }}
        />
    );
}
