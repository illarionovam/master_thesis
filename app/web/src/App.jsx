import Navigation from './navigation/Navigation.jsx';
import SharedLayout from './layouts/SharedLayout';
import Loader from './components/Loader';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectAnyAuthLoading } from './redux/auth/selectors.js';
import { selectAnyWorksLoading } from './redux/works/selectors.js';
import { selectAnyLocationsLoading } from './redux/locations/selectors.js';
import { selectAnyCharactersLoading } from './redux/characters/selectors.js';

function App() {
    const anyAuthLoading = useSelector(selectAnyAuthLoading);
    const anyWorksLoading = useSelector(selectAnyWorksLoading);
    const anyLocationsLoading = useSelector(selectAnyLocationsLoading);
    const anyCharactersLoading = useSelector(selectAnyCharactersLoading);

    const globalLoading = anyAuthLoading || anyWorksLoading || anyLocationsLoading || anyCharactersLoading;

    return (
        <SharedLayout>
            {globalLoading && <Loader />}
            <Navigation />
            <Toaster />
        </SharedLayout>
    );
}

export default App;
