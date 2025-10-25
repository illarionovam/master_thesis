import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from '../../components/List';

import { getCharacters } from '../../redux/characters/operations';
import {
    selectCharacters,
    selectGetCharactersLoading,
    selectGetCharactersError,
} from '../../redux/characters/selectors';

export default function CharactersPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const items = useSelector(selectCharacters);
    const loading = useSelector(selectGetCharactersLoading);
    const error = useSelector(selectGetCharactersError);

    useEffect(() => {
        dispatch(getCharacters());
    }, [dispatch]);

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Characters</h1>

            {loading && <p aria-live="polite">Loading…</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && <List items={items} />}
        </main>
    );
}
