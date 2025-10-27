import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Title from '../../components/Title';
import ConfirmSignOutModal from '../../components/ConfirmSignOutModal';

import { getUserInfo, signOut } from '../../redux/auth/operations';
import { selectUser, selectGetUserInfoLoading, selectGetUserInfoError } from '../../redux/auth/selectors';

export default function UserDetailPage() {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const loading = useSelector(selectGetUserInfoLoading);
    const error = useSelector(selectGetUserInfoError);

    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    const handleSignOut = () => setConfirmOpen(true);

    const handleSignOutCurrent = () => {
        setConfirmOpen(false);
        dispatch(signOut());
    };

    const handleSignOutAll = () => {
        setConfirmOpen(false);
        dispatch(signOut({ terminate_all_sessions: true }));
    };

    const handleClose = () => setConfirmOpen(false);

    return (
        <main aria-labelledby="user-title" style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
            <Title id="user-title">User</Title>

            <div style={{ margin: '12px 0 24px' }}>
                <button type="button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error}</p>}

            {!loading && !error && user && (
                <section aria-label="User info">
                    <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 16px' }}>
                        {user.id !== undefined && (
                            <>
                                <dt>ID</dt>
                                <dd>{user.id}</dd>
                            </>
                        )}
                        {user.username && (
                            <>
                                <dt>Username</dt>
                                <dd>{user.username}</dd>
                            </>
                        )}
                        {user.name && (
                            <>
                                <dt>Name</dt>
                                <dd>{user.name}</dd>
                            </>
                        )}
                        {user.email && (
                            <>
                                <dt>Email</dt>
                                <dd>{user.email}</dd>
                            </>
                        )}
                    </dl>
                </section>
            )}

            <ConfirmSignOutModal
                open={confirmOpen}
                onClose={handleClose}
                onCurrent={handleSignOutCurrent}
                onAll={handleSignOutAll}
            />
        </main>
    );
}
