import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes.js';

const SignUpPage = lazy(() => import('../pages/SignUpPage/index.jsx'));

const Navigation = () => {
    return (
        <Suspense>
            <Routes>
                <Route path={ROUTES.SIGN_UP_PAGE} element={<SignUpPage />} />
            </Routes>
        </Suspense>
    );
};

export default Navigation;
