import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectUser } from '../../redux/auth/selectors';
import styles from './AppHeader.module.css';

export default function AppHeader() {
    const user = useSelector(selectUser);
    const username = user?.username?.trim() ?? '';
    const { pathname } = useLocation();

    const onSignInPage = pathname === '/sign-in';

    const userTo = username ? '/user' : onSignInPage ? '/sign-up' : '/sign-in';

    const userLabel = username ? `@${username}` : onSignInPage ? 'Sign Up' : 'Sign In';

    const userAria = username ? `Open user profile for ${username}` : onSignInPage ? 'Create an account' : 'Sign in';

    return (
        <header role="banner" className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.brand} aria-label="Narrive">
                    Narrive
                </Link>

                <Link to={userTo} aria-label={userAria}>
                    {userLabel}
                </Link>
            </div>
        </header>
    );
}
