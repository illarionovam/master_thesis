import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/auth/selectors';
import LeftSidebar from '../../components/LeftSidebar';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

export default function SharedLayout({ children }) {
    const token = useSelector(selectToken);

    return (
        <div>
            <AppHeader />

            <div>
                {token && (
                    <aside role="complementary" aria-label="Sidebar">
                        <LeftSidebar defaultCollapsed={true} />
                    </aside>
                )}

                <main id="main-content" role="main">
                    {children}
                </main>
            </div>

            <AppFooter />
        </div>
    );
}
