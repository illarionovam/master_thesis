import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/auth/selectors';
import LeftSidebar from '../../components/LeftSidebar';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import styles from './SharedLayout.module.css';

export default function SharedLayout({ children }) {
    const token = useSelector(selectToken);

    return (
        <div className={styles.layout}>
            <AppHeader />

            <div className={styles.content}>
                {token && <LeftSidebar defaultCollapsed={true} />}

                <main id="main-content" role="main" className={styles.main}>
                    {children}
                </main>
            </div>

            <AppFooter />
        </div>
    );
}
