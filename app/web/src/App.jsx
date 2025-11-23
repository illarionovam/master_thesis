import Navigation from './navigation/Navigation.jsx';
import SharedLayout from './layouts/SharedLayout';
import Loader from './components/Loader';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectGlobalLoading } from './redux/globalSelectors';

function App() {
    const globalLoading = useSelector(selectGlobalLoading);

    return (
        <SharedLayout>
            {globalLoading && <Loader />}
            <Navigation />
            <Toaster />
        </SharedLayout>
    );
}

export default App;
