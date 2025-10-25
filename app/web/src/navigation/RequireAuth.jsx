import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectToken } from '../redux/auth/selectors';
import ROUTES from './routes';

export default function RequireAuth({ children }) {
    const token = useSelector(selectToken);
    const loc = useLocation();
    return token ? children : <Navigate to={ROUTES.SIGN_IN_PAGE} replace state={{ from: loc }} />;
}
