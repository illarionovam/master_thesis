import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { confirmEmail } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';

export default function ConfirmEmailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let t = window.location.hash ? window.location.hash.slice(1) : '';
        if (t) dispatch(confirmEmail(t));
        navigate('/');
    }, [dispatch, navigate]);

    return <></>;
}
