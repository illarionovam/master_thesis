import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmEmail } from '../../redux/auth/operations';
import {
    selectConfirmEmailLoading,
    selectConfirmEmailError,
    selectConfirmEmailSuccess,
} from '../../redux/auth/selectors';

export default function ConfirmEmailPage() {
    const titleId = useId();
    const dispatch = useDispatch();

    const loading = useSelector(selectConfirmEmailLoading);
    const error = useSelector(selectConfirmEmailError);
    const success = useSelector(selectConfirmEmailSuccess);

    useEffect(() => {
        let t = window.location.hash ? window.location.hash.slice(1) : '';
        if (t) dispatch(confirmEmail(t));
    }, [dispatch]);

    return (
        <main aria-labelledby={titleId}>
            <h1 id={titleId}>Confirm Email</h1>
            {loading && <p aria-live="polite">Confirming...</p>}
            {success && <p aria-live="polite">Email verified.</p>}
            {error && <p role="alert">{error}</p>}
        </main>
    );
}
