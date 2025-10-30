import Navigation from './navigation/Navigation.jsx';
import SharedLayout from './layouts/SharedLayout';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <SharedLayout>
            <Navigation />
            <Toaster />
        </SharedLayout>
    );
}

export default App;
