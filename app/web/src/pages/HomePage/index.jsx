import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../redux/auth/selectors';
import { signOut } from '../../redux/auth/operations';
import LeftSidebar from '../../components/LeftSidebar';

export default function HomePage() {
    const titleId = useId();
    const token = useSelector(selectToken);
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(signOut());
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {token && <LeftSidebar defaultCollapsed={true} />}

            <main aria-labelledby={titleId} style={{ flex: 1, padding: 16 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 id={titleId} style={{ margin: 0 }}>
                        HOME
                    </h1>
                </header>
            </main>
        </div>
    );
}
