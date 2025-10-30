import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';

export default function AppHeader() {
    const user = useSelector(selectUser);
    const username = user?.username ?? '';

    return (
        <header role="banner">
            <a href="#main-content">Skip to content</a>

            <div>
                <strong>My Author Platform</strong>
                <div aria-live="polite">{username ? <span>@{username}</span> : null}</div>
            </div>
        </header>
    );
}
