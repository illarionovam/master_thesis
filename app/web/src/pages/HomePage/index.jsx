import { useId } from 'react';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/auth/selectors';
import LeftSidebar from '../../components/LeftSidebar';

export default function HomePage() {
    const titleId = useId();
    const token = useSelector(selectToken);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {token && <LeftSidebar defaultCollapsed={true} />}

            <main aria-labelledby={titleId} style={{ flex: 1, padding: 16 }}>
                <h1 id={titleId}>HOME</h1>
            </main>
        </div>
    );
}
