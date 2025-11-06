import { useEffect, useId, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo, signOut, updateUser, updateUserEmail } from '../../redux/auth/operations';

import {
    selectUser,
    selectGetUserInfoLoading,
    selectGetUserInfoError,
    selectUpdateUserLoading,
    selectUpdateUserError,
    selectUpdateUserEmailLoading,
    selectUpdateUserEmailError,
} from '../../redux/auth/selectors';

import { resetChangePassword } from '../../redux/auth/slice';

import ChangePasswordModal from '../../components/ChangePasswordModal';
import ConfirmSignOutModal from '../../components/ConfirmSignOutModal';
import styles from './UserDetailPage.module.css';

export default function UserDetailPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const loading = useSelector(selectGetUserInfoLoading);
    const error = useSelector(selectGetUserInfoError);

    const updateLoading = useSelector(selectUpdateUserLoading);
    const updateError = useSelector(selectUpdateUserError);

    const emailLoading = useSelector(selectUpdateUserEmailLoading);
    const emailError = useSelector(selectUpdateUserEmailError);

    const [editMode, setEditMode] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);

    const [cpOpen, setCpOpen] = useState(false);
    const [signoutOpen, setSignoutOpen] = useState(false);

    const formRef = useRef(null);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    const disableAll = loading || updateLoading || emailLoading;

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

        const action = await dispatch(updateUser({ username, name }));
        if (updateUser.fulfilled.match(action)) {
            setEditMode(false);
        }
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

        const action = await dispatch(updateUserEmail({ new_email: email }));
        if (updateUserEmail.fulfilled.match(action)) {
            setEmailEdit(false);
        }
    };

    const handleOpenChangePass = () => {
        dispatch(resetChangePassword());
        setCpOpen(true);
    };
    const handleCloseChangePass = () => setCpOpen(false);
    const handleSubmitChangePass = async ({ current_password, new_password }) => {
        const action = await dispatch(updateUser({ password: current_password, new_password }));
        if (updateUser.fulfilled.match(action)) {
            setCpOpen(false);
        }
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
        <main aria-labelledby={titleId} className={styles.page}>
            <section className={styles.card} aria-busy={disableAll ? 'true' : 'false'}>
                <h1 id={titleId} className={styles.title}>
                    User
                </h1>

                {loading && (
                    <p className={styles.muted} aria-live="polite">
                        Loading...
                    </p>
                )}
                {error && (
                    <p role="alert" className={styles.error}>
                        {error.message ?? String(error)}
                    </p>
                )}

                {!loading && !error && user && (
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
                                    disabled={disableAll || !emailEdit}
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            {!emailEdit ? (
                                <button
                                    type="button"
                                    className={styles.ghostBtn}
                                    onClick={handleStartEmailEdit}
                                    disabled={disableAll}
                                >
                                    Change email
                                </button>
                            ) : (
                                <div className={styles.rowActions}>
                                    <button
                                        type="button"
                                        className="primaryBtn"
                                        onClick={handleSaveEmail}
                                        disabled={emailLoading}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={handleCancelEmailEdit}
                                        disabled={emailLoading}
                                    >
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
                                disabled={disableAll || !editMode}
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
                                disabled={disableAll || !editMode}
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
                                        disabled={disableAll}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={handleOpenChangePass}
                                        disabled={disableAll}
                                    >
                                        Change password
                                    </button>

                                    <button
                                        type="button"
                                        className="dangerBtn"
                                        onClick={handleSignOut}
                                        disabled={disableAll}
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
                                        disabled={updateLoading}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.ghostBtn}
                                        onClick={handleCancelEdit}
                                        disabled={updateLoading}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                )}
            </section>

            <ChangePasswordModal
                open={cpOpen}
                onClose={handleCloseChangePass}
                onSubmit={handleSubmitChangePass}
                loading={updateLoading}
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
