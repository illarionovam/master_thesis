import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmEmail } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import { selectConfirmEmailError } from '../../redux/auth/selectors';

export default function ConfirmEmailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const titleId = useId();

    const confirmEmailError = useSelector(selectConfirmEmailError);

    useEffect(() => {
        const t = window.location.hash ? window.location.hash.slice(1) : '';
        if (!t) return;

        const run = async () => {
            const action = await dispatch(confirmEmail(t));
            if (confirmEmail.fulfilled.match(action)) {
                navigate('/', { replace: true });
            }
        };

        run();
    }, [dispatch, navigate]);

    return (
        <main aria-labelledby={titleId} className="page">
            {confirmEmailError && (
                <p role="alert" className="infoMessage error">
                    {confirmEmailError}
                </p>
            )}
        </main>
    );
}
