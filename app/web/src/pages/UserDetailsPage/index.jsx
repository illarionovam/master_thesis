import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Title from '../../components/Title';
import ConfirmSignOutModal from '../../components/ConfirmSignOutModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import EditUserDetailsModal from '../../components/EditUserDetailsModal';
import ChangeEmailModal from '../../components/ChangeEmailModal';

import { getUserInfo, signOut, updateUser, updateUserEmail } from '../../redux/auth/operations';
import {
    selectUser,
    selectGetUserInfoLoading,
    selectUpdateUserLoading,
    selectUpdateUserEmailLoading,
    selectGetUserInfoError,
    selectUpdateUserError,
    selectUpdateUserEmailError,
} from '../../redux/auth/selectors';
import { resetChangePassword } from '../../redux/auth/slice';

export default function UserDetailPage() {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const loading = useSelector(selectGetUserInfoLoading);
    const error = useSelector(selectGetUserInfoError);

    const updateLoading = useSelector(selectUpdateUserLoading);
    const updateError = useSelector(selectUpdateUserError);

    const emailLoading = useSelector(selectUpdateUserEmailLoading);
    const emailError = useSelector(selectUpdateUserEmailError);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [changePassOpen, setChangePassOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);

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

    const handleOpenChangePassword = () => {
        dispatch(resetChangePassword());
        setChangePassOpen(true);
    };
    const handleCloseChangePassword = () => setChangePassOpen(false);
    const handleSubmitChangePassword = async ({ current_password, new_password }) => {
        const action = await dispatch(updateUser({ password: current_password, new_password }));

        if (updateUser.fulfilled.match(action)) {
            setChangePassOpen(false);
        }
    };
    const handleOpenEdit = () => setEditOpen(true);
    const handleCloseEdit = () => setEditOpen(false);

    const handleSubmitEdit = async ({ username, name }) => {
        const action = await dispatch(updateUser({ username, name }));
        if (updateUser.fulfilled.match(action)) {
            setEditOpen(false);
        }
    };
    const handleOpenChangeEmail = () => setEmailOpen(true);
    const handleCloseChangeEmail = () => setEmailOpen(false);

    const handleSubmitChangeEmail = async ({ email }) => {
        const action = await dispatch(updateUserEmail({ new_email: email }));
        if (updateUserEmail.fulfilled.match(action)) {
            setEmailOpen(false);
        }
    };
    return (
        <main aria-labelledby="user-title" style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
            <Title id="user-title">User</Title>

            <div style={{ display: 'flex', gap: 8, margin: '12px 0 24px' }}>
                <button type="button" onClick={handleSignOut}>
                    Sign Out
                </button>
                <button type="button" onClick={handleOpenChangePassword}>
                    Change Password
                </button>
                <button type="button" onClick={handleOpenEdit}>
                    Edit Details
                </button>
                <button type="button" onClick={handleOpenChangeEmail}>
                    Change Email
                </button>
            </div>

            {loading && <p aria-live="polite">Loading...</p>}
            {error && <p role="alert">{error.message ?? String(error)}</p>}

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

            <ChangePasswordModal
                open={changePassOpen}
                onClose={handleCloseChangePassword}
                onSubmit={handleSubmitChangePassword}
                loading={updateLoading}
                apiError={updateError}
            />

            <EditUserDetailsModal
                open={editOpen}
                onClose={handleCloseEdit}
                onSubmit={handleSubmitEdit}
                loading={updateLoading}
                apiError={updateError}
                initial={{ username: user?.username ?? '', name: user?.name ?? '' }}
            />

            <ChangeEmailModal
                open={emailOpen}
                onClose={handleCloseChangeEmail}
                onSubmit={handleSubmitChangeEmail}
                loading={emailLoading}
                apiError={emailError}
                initial={user?.email ?? ''}
            />
        </main>
    );
}
