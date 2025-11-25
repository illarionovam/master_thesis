import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo, signOut, updateUser, updateUserEmail } from '../../redux/auth/operations';

import {
    selectUser,
    selectGetUserInfoError,
    selectUpdateUserError,
    selectUpdateUserEmailError,
} from '../../redux/auth/selectors';
import { selectGlobalLoading } from '../../redux/globalSelectors';

import { resetChangePassword } from '../../redux/auth/slice';

import ChangePasswordModal from '../../components/ChangePasswordModal';
import ConfirmSignOutModal from '../../components/ConfirmSignOutModal';
import styles from './UserDetailPage.module.css';

export default function UserDetailPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const globalLoading = useSelector(selectGlobalLoading);

    const user = useSelector(selectUser);
    const error = useSelector(selectGetUserInfoError);

    const updateError = useSelector(selectUpdateUserError);

    const emailError = useSelector(selectUpdateUserEmailError);

    const [editMode, setEditMode] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);

    const [cpOpen, setCpOpen] = useState(false);
    const [signoutOpen, setSignoutOpen] = useState(false);

    const formRef = useRef(null);

    useEffect(() => {
        if (!user) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user]);

    const handleEdit = () => setEditMode(true);
    const handleCancelEdit = () => {
        setEditMode(false);
        formRef.current?.reset();
    };
    const handleSaveEdit = async e => {
        e?.preventDefault?.();
        const fd = new FormData(formRef.current);
        const username = fd.get('username')?.toString().trim() ?? '';

        const nameRaw = fd.get('name')?.toString().trim() ?? '';
        const name = nameRaw === '' ? null : nameRaw;

        setEditMode(false);
        dispatch(updateUser({ username, name }));
    };

    const handleStartEmailEdit = () => setEmailEdit(true);
    const handleCancelEmailEdit = () => {
        setEmailEdit(false);
        formRef.current?.elements?.email && (formRef.current.elements.email.value = user?.email ?? '');
    };
    const handleSaveEmail = async () => {
        const fd = new FormData(formRef.current);
        const email = fd.get('email')?.toString().trim();
        if (!email) return;

        setEmailEdit(false);
        dispatch(updateUserEmail({ new_email: email }));
    };

    const handleOpenChangePass = () => {
        dispatch(resetChangePassword());
        setCpOpen(true);
    };
    const handleCloseChangePass = () => setCpOpen(false);
    const handleSubmitChangePass = async ({ current_password, new_password }) => {
        setCpOpen(false);
        dispatch(updateUser({ password: current_password, new_password }));
    };

    const handleSignOut = () => setSignoutOpen(true);
    const handleCloseSignOut = () => setSignoutOpen(false);
    const handleSignOutCurrent = () => {
        setSignoutOpen(false);
        dispatch(signOut());
    };
    const handleSignOutAll = () => {
        setSignoutOpen(false);
        dispatch(signOut({ terminate_all_sessions: true }));
    };

    return (
        <main aria-labelledby={titleId} className="page centered">
            {error && (
                <p role="alert" className={styles.error}>
                    {error.message ?? String(error)}
                </p>
            )}

            {!globalLoading && !error && user && (
                <section className={styles.card} aria-busy={globalLoading ? 'true' : 'false'}>
                    <h1 id={titleId} className={styles.title}>
                        User
                    </h1>
                    <form
                        ref={formRef}
                        className={styles.form}
                        noValidate
                        onSubmit={e => {
                            if (editMode) {
                                handleSaveEdit(e);
                            } else {
                                e.preventDefault();
                            }
                        }}
                    >
                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email ?? ''}
                                    className={styles.input}
                                    disabled={globalLoading || !emailEdit}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {!emailEdit ? (
                                <button type="button" onClick={handleStartEmailEdit} disabled={globalLoading}>
                                    Change email
                                </button>
                            ) : (
                                <div className={styles.rowActions}>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={handleSaveEmail}
                                        disabled={globalLoading}
                                    >
                                        Save
                                    </button>
                                    <button type="button" onClick={handleCancelEmailEdit} disabled={globalLoading}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        {emailError && (
                            <p role="alert" className={styles.error}>
                                {emailError}
                            </p>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                defaultValue={user.username ?? ''}
                                className={styles.input}
                                disabled={globalLoading || !editMode}
                                autoComplete="username"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={user.name ?? ''}
                                className={styles.input}
                                disabled={globalLoading || !editMode}
                                autoComplete="name"
                            />
                        </div>

                        {updateError && (
                            <p role="alert" className={styles.error}>
                                {updateError}
                            </p>
                        )}

                        <div className={styles.actions}>
                            {!editMode ? (
                                <>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={handleEdit}
                                        disabled={globalLoading}
                                    >
                                        Edit
                                    </button>

                                    <button type="button" onClick={handleOpenChangePass} disabled={globalLoading}>
                                        Change password
                                    </button>

                                    <button
                                        type="button"
                                        className="dangerBtn"
                                        onClick={handleSignOut}
                                        disabled={globalLoading}
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={handleSaveEdit}
                                        disabled={globalLoading}
                                    >
                                        Save
                                    </button>
                                    <button type="button" onClick={handleCancelEdit} disabled={globalLoading}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </section>
            )}

            <ChangePasswordModal
                open={cpOpen}
                onClose={handleCloseChangePass}
                onSubmit={handleSubmitChangePass}
                apiError={updateError}
            />

            <ConfirmSignOutModal
                open={signoutOpen}
                onClose={handleCloseSignOut}
                onCurrent={handleSignOutCurrent}
                onAll={handleSignOutAll}
            />
        </main>
    );
}
